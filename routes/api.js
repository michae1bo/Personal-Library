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
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      res.json();
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      res.json();
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      res.json();
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      res.json();
    });
  
};
