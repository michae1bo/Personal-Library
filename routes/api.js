/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
require('dotenv').config();



module.exports = function (app) {

  mongoose.connect(process.env.MONGO_URI);

  const librarySchema = new mongoose.Schema({
    title: String,
    commentcount: { type: Number, default: 0},
    comments: { type: [String], default: [] }
  })

  const Library = mongoose.model('Library', librarySchema);

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let response;
      const libraryResponse = await Library.find({}, { __v: 0 });
      if (libraryResponse === null) {
        response = [];
      } else {
        response = libraryResponse;
      }
      res.json(response);
    })
    
    .post(async function (req, res){
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
      let response;
      if (title) {
        const newBook = new Library({ title: title });
        const savedBook = await newBook.save();
        response = { title: savedBook.title, _id: savedBook._id };
      } else {
        response = 'missing required field title';
      }
      res.json(response);
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      let response;
      const deleteResponse = await Library.deleteMany({});
      if (deleteResponse === null) {
        response = 'delete not successful';
      } else {
        response = 'complete delete successful';
      }
      res.json(response);
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let response;
      const requestedBook = await Library.findById(bookid, { __v: 0 });
      if (requestedBook === null) {
        response = 'no book exists';
      } else {
        response = requestedBook;
      }
      res.json(response);
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      let response;
      if (comment) {
        const requestedBook = await Library.findById(bookid, { __v: 0 });
        if (requestedBook === null) {
          response = 'no book exists';
        } else {
          requestedBook.comments.push(comment);
          requestedBook.commentcount = requestedBook.comments.length;
          const savedBook = await requestedBook.save();
          if (savedBook === null) {
            response = "error saving book"
          } else {
            response = requestedBook;
          }
        }
      } else {
        response = 'missing required field comment';
      }
      res.json(response);
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      let response;
      const bookToDelete = await Library.findById(bookid);
      if (bookToDelete === null) {
        response = 'no book exists';
      } else {
        const deleteResponse = await bookToDelete.deleteOne();
        if (deleteResponse.acknowledged === true) {
          response = 'delete successful';
        } else {
          response = 'delete failed';
        }
      }
      res.json(response);
    });
  
};
