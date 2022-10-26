require('should');
const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'Test';

const app = require('../app');

const Book = mongoose.model('Book');
const agent = request.agent(app);

describe('Book CRUD Test', () => {
  it('should allow a book to be posted and return read and _id', (done) => {
    const bookPost = { title: 'My Book', author: 'Me', genre: 'My Genre' };

    agent.post('/api/books')
      .send(bookPost)
      .expect(200)
      .end((err, results) => {
        // console.log(results);
        results.body.read.should.equal(false);
        results.body.should.have.property('_id');
        done();
      });

    // eslint-disable-next-line no-shadow
    afterEach((done) => {
      Book.deleteMany({}).exec();
      done();
    });

    // eslint-disable-next-line no-shadow
    after((done) => {
      mongoose.connection.close();
      app.server.close(done());
    });
  });
});
