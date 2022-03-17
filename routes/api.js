'use strict';

const Book = require('../models');

module.exports = function (app) {
  app
    .route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      Book.find({}, (err, data) => {
        if (err || !data) {
          res.json('error');
        } else {
          const mapped = data.map(el => {
            return {
              _id: el._id,
              title: el.title,
              commentcount: el.comments.length
            };
          });
          res.json(mapped);
        }
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title) {
        res.json('missing required field title');
        return;
      }

      Book.create({ title: title }, (err, data) => {
        if (err || !data) {
          res.json('error');
        } else {
          res.json({ _id: data._id, title: data.title });
        }
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, data) => {
        if (err) {
          res.json('error');
        } else {
          res.json('complete delete successful');
        }
      });
    });

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.findById(bookid, (err, data) => {
        if (!data) {
          res.json('no book exists');
        } else {
          res.json(data);
        }
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!comment) {
        res.json('missing required field comment');
        return;
      }

      Book.findById(bookid, (err, data) => {
        if (!data) {
          res.json('no book exists');
        } else {
          data.comments.push(comment);
          data.save((err, saved) => {
            res.json({
              _id: saved._id,
              title: saved.title,
              comments: saved.comments
            });
          });
        }
      });
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid, (err, data) => {
        if (!data) {
          res.json('no book exists');
        } else {
          res.json('delete successful');
        }
      });
    });
};
