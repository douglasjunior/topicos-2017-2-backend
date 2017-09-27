const app = require('../app');
const request = require('supertest');
const expect = require('chai').expect;

describe('App', function () {
    describe('/todos', function () {

        it('GET /todos', function (done) {
            request(app)
                .get('/todos')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(response.body).to.be.a('array');
                    done();
                });
        });

        it('GET /todo/:id', function(done) {
            request(app)
                .get('/todos/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(response.body).to.be.a('object');
                    expect(response.body).to.have.property('id');
                    expect(response.body).to.have.property('title');
                    expect(response.body).to.have.property('description');
                    expect(response.body).to.have.property('completed');
                    done();
                }).catch(done);
        });

        it('DELETE /todo/:id', function(done) {
            request(app)
                .delete('/todos/1')
                .expect(200, done);
        });
    });
});