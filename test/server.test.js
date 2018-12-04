const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('server', () => {
  describe('/api/v1/ingredients', () => {
    beforeEach(done => {
      done();
    });
    describe('GET', () => {
      it('should return a 200 status', done => {
        chai
          .request(app)
          .get('/api/v1/ingredients')
          .end((error, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should return an array of objects', done => {
        chai
          .request(app)
          .get('/api/v1/ingredients')
          .end((error, res) => {
            expect(res.body).to.be.a('array');
            expect(res.body[0]).to.have.property('id');
            expect(res.body[0]).to.have.property('ingredient_name');
            expect(res.body[0]).to.have.property('created_at');
            expect(res.body[0]).to.have.property('updated_at');
            done();
          });
      });
    });
  });
  describe('/api/v1/recipes', () => {
    describe('GET', () => {
      it('should return a 200 status', done => {
        chai
          .request(app)
          .get('/api/v1/recipes')
          .end((error, res) => {
            expect(error).to.equal(null);
            done();
          });
      });
      it('should return an array of objects', done => {
        chai.request(app)
          .get('/api/v1/recipes')
          .end((error, res) => {
            expect(res.body).to.be.a('array')
            expect(res.body[0]).to.have.property('id')
            expect(res.body[0]).to.have.property('recipe_name')
            expect(res.body[0]).to.have.property('created_at')
            expect(res.body[0]).to.have.property('updated_at')
            done()
          })
      })
    });
  });
});
