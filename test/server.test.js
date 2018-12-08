/*eslint-disable*/
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

const environment = 'testing';
const config = require('../knexfile')[environment];
const database = require('knex')(config);

const expect = chai.expect;
chai.use(chaiHttp);

describe('server', () => {
  describe('/api/v1/ingredients', () => {
    beforeEach(done => {
      database.migrate
        .rollback()
        .then(() => database.migrate.latest())
        .then(() => database.seed.run())
        .then(() => done())
        .catch(error => error)
        .done();
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
    after(done => {
      database.migrate
        .rollback()
        .then(() => done())
        .catch(error => error)
        .done();
    });
  });
  describe('/api/v1/recipes', () => {
    beforeEach(done => {
      database.migrate
        .rollback()
        .then(() => database.migrate.latest())
        .then(() => database.seed.run())
        .then(() => done())
        .catch(error => error)
        .done();
    });
    describe('GET', () => {
      it('should return a 200 status', done => {
        chai
          .request(app)
          .get('/api/v1/recipes')
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
      it('should return an array of objects', done => {
        chai
          .request(app)
          .get('/api/v1/recipes')
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res.body).to.be.a('array');
            expect(res.body[0]).to.have.keys([
              'id',
              'recipe_name',
              'created_at',
              'updated_at',
            ]);
            expect(res.body[0].id).to.equal(1);
            expect(res.body[0].recipe_name).to.equal('chicken pot pie');
            done();
          });
      });
    });
    describe('POST', () => {
      it('should return a 201 status if successful', done => {
        const newRecipe = {
          recipe_name: 'spaghetti',
          ingredients: ['meow', 'bark', 'tomato'],
          steps: ['1', '2', '3'],
        };
        chai
          .request(app)
          .post('/api/v1/recipes')
          .send(newRecipe)
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message');
            done();
          });
      });
      it('should return a 422 if required parameter is missing', done => {
        const newRecipe = {};
        chai
          .request(app)
          .post('/api/v1/recipes')
          .send(newRecipe)
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(422);
            done();
          });
      });
    });
    after(done => {
      database.migrate
        .rollback()
        .then(() => done())
        .catch(error => error)
        .done();
    });
  });
  describe('/api/v1/recipes/:id', () => {
    beforeEach(done => {
      database.migrate
        .rollback()
        .then(() => database.migrate.latest())
        .then(() => database.seed.run())
        .then(() => done())
        .catch(error => error)
        .done();
    });
    describe('PUT', () => {
      it('should update a recipe name', done => {
        const name = {
          recipe_name: 'billys bootastic bacon & eggs',
        };
        chai
          .request(app)
          .put('/api/v1/recipes/1')
          .send(name)
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
      it('should return a 404 if recipe does not exist', done => {
        const name = {
          recipe_name: 'billys bootastic bacon & eggs',
        };
        chai
          .request(app)
          .put('/api/v1/recipes/100')
          .send(name)
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(404);
            done();
          });
      });
    });
    describe('DELETE', () => {
      it('Should delete a record', done => {
        chai
          .request(app)
          .del('/api/v1/recipes/2')
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(204);
            done();
          });
      });
      it('Should return a 404 if no record exists', done => {
        chai
          .request(app)
          .del('/api/v1/recipes/200')
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(404);
            done();
          });
      });
    });
    after(done => {
      database.migrate
        .rollback()
        .then(() => done())
        .catch(error => error)
        .done();
    });
  });
  describe('/api/v1/ingredients/:id/recipes', () => {
    beforeEach(done => {
      database.migrate
        .rollback()
        .then(() => database.migrate.latest())
        .then(() => database.seed.run())
        .then(() => done())
        .catch(error => error)
        .done();
    });
    describe('GET', () => {
      it('should return 200 if ok', done => {
        chai
          .request(app)
          .get('/api/v1/ingredients/1/recipes')
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            expect(res.body[0]).to.have.keys([
              'id',
              'recipe_name',
              'created_at',
              'updated_at',
            ]);
            expect(res.body[0].id).to.equal(1);
            expect(res.body[0].recipe_name).to.equal('chicken pot pie');
            done();
          });
      });
      it('should return an error if ingredient does not exist', done => {
        chai
          .request(app)
          .get('/api/v1/ingredients/300/recipes')
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(404);
            done();
          });
      });
    });
    after(done => {
      database.migrate
        .rollback()
        .then(() => done())
        .catch(error => error)
        .done();
    });
  });
  describe('/api/v1/recipes/:id/steps', () => {
    beforeEach(done => {
      database.migrate
        .rollback()
        .then(() => database.migrate.latest())
        .then(() => database.seed.run())
        .then(() => done())
        .catch(error => error)
        .done();
    });

    describe('GET', () => {
      it('Should return status 404', done => {
        chai
          .request(app)
          .get('/api/v1/recipes/500/steps')
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(404);
            done();
          });
      });
      it('Should return status 200 if ok', done => {
        chai
          .request(app)
          .get('/api/v1/recipes/1/steps')
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });

    describe('POST', () => {
      it('Should return a status of 404', done => {
        const step = {
          step_text: 'churn the butter',
        };
        chai
          .request(app)
          .post('/api/v1/recipes/500/steps')
          .send(step)
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(404);
            done();
          });
      });
      it('Should return a status of 201', done => {
        const step = {
          step_text: 'churn the butter',
        };
        chai
          .request(app)
          .post('/api/v1/recipes/1/steps')
          .send(step)
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.have.key('message');
            done();
          });
      });
    });

    describe('DELETE', () => {
      it('Should return status 404', done => {
        chai
          .request(app)
          .del('/api/v1/recipes/500/steps')
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(404);
            done();
          });
      });
      it('should return a status 204', done => {
        chai
          .request(app)
          .del('/api/v1/recipes/1/steps')
          .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(204);
            done();
          });
      });
    });
    after(done => {
      database.migrate
        .rollback()
        .then(() => done())
        .catch(error => error)
        .done();
    });
  });

  describe('/api/v1/recipes/:id/ingredients', () => {
    before(done => {
      database.migrate
        .latest()
        .then(() => database.seed.run())
        .then(() => done())
        .catch(error => error)
        .done();
    });
    describe('GET', () => {
      it('should return a 200 status if ok', done => {
        chai.request(app)
          .get('/api/v1/recipes/1/ingredients')
          .end((error, res) => {
            expect(error).to.be.null
            expect(res).to.have.status(200)
            done()
          })
      })
      it('should return a 404 status if id does not exist', done => {
        chai.request(app)
          .get('/api/v1/recipes/5000/ingredients')
          .end((error, res) => {
            expect(error).to.be.null
            expect(res).to.have.status(404)
            done()
          })
      })
    after(done => {
      database.migrate
        .rollback()
        .then(() => done())
        .catch(error => error)
        .done();
    });
  })
  })
  describe('/api/v1/recipes/:recipe_id/steps/:step_num', () => {
    before(done => {
      database.migrate
        .latest()
        .then(() => database.seed.run())
        .then(() => done())
        .catch(error => error)
        .done();
    });
    describe('PUT', () => {
      it('should return a status of 204 if successful', done => {
        const step = {step_text: 'Insert food into face'}
        chai.request(app)
          .put('/api/v1/recipes/2/steps/1')
          .send(step)
          .end((error, res) => {
            expect(error).to.be.null
            expect(res).to.have.status(204)
            done()
          })
      })
    })
      it('should return 404 if recipe id does not exist', done => {
        const step = {step_text: 'Insert food into face'}
        chai.request(app)
          .put('/api/v1/recipes/5000/steps/1')
          .send(step)
          .end((error, res) => {
            expect(error).to.be.null
            expect(res).to.have.status(404)
            done()
          })
      })
      it('should return 404 if recipe id does not exist', done => {
        const step = {step_text: 'Insert food into face'}
        chai.request(app)
          .put('/api/v1/recipes/1/steps/5000')
          .send(step)
          .end((error, res) => {
            expect(error).to.be.null
            expect(res).to.have.status(404)
            done()
          })
      })
  })
  after(done => {
    database.migrate
      .rollback()
      .then(() => done())
      .catch(error => error)
      .done();
  });  
});
