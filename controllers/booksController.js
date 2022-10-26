function booksController(Book) {
  function post(req, res) {
    const book = new Book(req.body);
    if (!req.body.title) {
      res.status(400);
      return res.send('Title is required');
    }

    book.save();
    res.status(201);
    return res.json(book);
  }
  function get(req, res) {
    const filter = {};
    if (req.query.genre) {
      filter.genre = req.query.genre;
    }
    Book.find(filter, (err, books) => {
      if (err) {
        return res.send(err);
      }
      const returnBooks = books.map((book) => {
        const newBook = book.toJSON();
        newBook.links = {};
        // eslint-disable-next-line no-underscore-dangle
        newBook.links.self = `https://${req.headers.host}/api/books/${book._id}`;
        return newBook;
      });
      return res.json(returnBooks);
    });
  }
  return { post, get };
}

module.exports = booksController;
