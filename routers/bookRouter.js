/* eslint-disable no-param-reassign */
const express = require('express');

const bookRouter = express.Router();
const Book = require('../models/bookModel');
const booksController = require('../controllers/booksController');

const controller = booksController(Book);
// adding new book - filtering books

bookRouter.route('/books')
  .post(controller.post)
  .get(controller.get);

// middleware for checking if book exists and handles if it doesn't

bookRouter.use('/books/:bookId', (req, res, next) => {
  Book.findById(req.params.bookId, (err, book) => {
    if (err) {
      return res.send(err);
    }
    if (book) {
      req.book = book;
      return next();
    }
    return res.sendStatus(404);
  });
});

// getting book by id - updating book by id

bookRouter.route('/books/:bookId')
  .get((req, res) => {
    const returnBook = req.book.toJSON();

    returnBook.links = {};
    const genre = req.book.genre.replace(' ', '%20');
    returnBook.links.FilterByThisGenre = `https://${req.headers.host}/api/books/?genre=${genre}`;
    res.json(returnBook);
  })
  .put((req, res) => {
    const { book } = req;
    book.title = req.body.title;
    book.author = req.body.author;
    book.genre = req.body.genre;
    book.read = req.body.read;
    req.book.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  })
  .patch((req, res) => {
    const { book } = req;
    // eslint-disable-next-line no-underscore-dangle
    if (req.body._id) {
      // eslint-disable-next-line no-underscore-dangle
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      book[key] = value;
    });
    req.book.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  })
  .delete((req, res) => {
    req.book.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204);
    });
  });

module.exports = bookRouter;
