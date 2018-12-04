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
      const testObject = { 
        id: 9,
        ingredient_name: 'carrots',
        aisle: 'gravy',
        created_at: '2018-12-04T21:18:14.999Z',
        updated_at: '2018-12-04T21:18:14.999Z' 
      }
      chai.request(app)
        .get('/api/v1/ingredients')
        .end((error, res) => {
          expect(res.body).to.be.a('array')
          expect(res.body).to.deep.nested.include(testObject)
          done();
        });
    });

    // it('should ', done => {

    // });
  });
});
