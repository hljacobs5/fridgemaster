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
    it('Should return a 200 status', done => {
      chai
        .request(app)
        .get('/api/v1/ingredients')
        .end((error, res) => {
          expect(res).to.have.status(200);
          console.log(process.ENV.DATABASE_URL);
          done();
        });
    });
    //    it('', done => {});
  });
});
