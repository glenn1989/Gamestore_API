const request = require('supertest');
const {Genre} = require('../models/genre');
const {User} = require('../models/user');
const expect = require('chai').expect;


describe('api/genres', () => {
    beforeEach( () => { server = require('../index');})
    afterEach( async () => {
        server.close();
        await Genre.remove({});
        
    });
describe('GET/', () => {
    it('should be status 200', async () => {
        await Genre.collection.insertOne({name:"RPG"});
        const genre = await request(server).get('/api/genres');

        expect(genre.body[0].name).to.equal('RPG')
        expect(genre.status).to.equal(200)
    })
    
});
describe('GET/:id', () => {
    it('find genre by id: should be status 200', async () => {
        await Genre.collection.insertOne({name:"RPG"});
        const genre = await request(server).get('/api/genres');
        const genreRes = await request(server).get(`/api/genres/${genre.body[0]._id}`);

        expect(genreRes.status).to.equal(200)
    });
    it('find genre by id: should be error 404', async () => {
        const id = '63a9db46338c483d42abfb84'
        const res = await request(server).get(`/api/genres/${id}`);

        expect(res.status).to.equal(404);

    })
})
describe('PUT/:id', () => {
    it('should be status 200: update a recored', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzIwNzYxMDJ9.-o2MkiO_SUdLSDi_7hIae7Y-wMuL6DS3DFG_8C4BGSE'
        await Genre.collection.insertOne({name:"RPG"});
        const genre = await request(server).get('/api/genres')
        const res = await request(server)
        .put(`/api/genres/${genre.body[0]._id}`)
        .set('x-auth-token', token)
        .send({name:"Role Playing Game"});
        expect(res.status).to.equal(200)
    });
    it('should be status 404: genre not found', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzIwNzYxMDJ9.-o2MkiO_SUdLSDi_7hIae7Y-wMuL6DS3DFG_8C4BGSE'
        const id = '63a9db46338c483d42abfb84';

        const res = await request(server)
        .put(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send({name:'test genre'});

        expect(res.status).to.equal(404);
    });
});
describe('DELETE/:ID', () => {
    it('should be status 200', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzIwNzYxMDJ9.-o2MkiO_SUdLSDi_7hIae7Y-wMuL6DS3DFG_8C4BGSE';
        await Genre.collection.insertOne({name:"RPG"});
        const genre = await request(server).get('/api/genres')
        const res = await request(server)
        .delete(`/api/genres/${genre.body[0]._id}`)
        .set('x-auth-token',token)

        expect(res.status).to.equal(200);
    });
    it('should be status 404: genre not found', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzIwNzYxMDJ9.-o2MkiO_SUdLSDi_7hIae7Y-wMuL6DS3DFG_8C4BGSE';
        const id = '63a9db46338c483d42abfb84';
        const genre = await request(server).get('/api/genres')
        const res = await request(server)
        .delete(`/api/genres/${id}`)
        .set('x-auth-token',token)

        expect(res.status).to.equal(404);
    });
});
describe('POST/', () => {
    it('should be status 200', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzIwNzYxMDJ9.-o2MkiO_SUdLSDi_7hIae7Y-wMuL6DS3DFG_8C4BGSE';
        const res = await request(server)
        .post('/api/genres')
        .set('Content-type', 'application/json')
        .set('x-auth-token',token)
        .send({name:'genre1'})

        expect(res.status).to.equal(200)
    });
    it('should be status 403', async () => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5YmFhMmFlOGI0OWI3NDViMjVlMzQiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjcyMDY3NzU5fQ.QM_vspcQqOmns_HDlvNeqp7_WWFAOgDGIpAzvA4KRK0"
        const res = await request(server)
        .post('/api/genres')
        .set('Content-type', 'application/json')
        .set('x-auth-token',token)
        .send({name:'genre1'})

        expect(res.status).to.equal(403)
    });
    it('should be status 400 - invalid token', async () => {
        const token = "eyJfaWQiOiI2M2E5YmFhMmFlOGI0OWI3NDViMjVlMzQiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjcyMDY3NzU5fQ.QM_vspcQqOmns_HDlvNeqp7_WWFAOgDGIpAzvA4KRK0"
        const res = await request(server)
        .post('/api/genres')
        .set('Content-type', 'application/json')
        .set('x-auth-token',token)
        .send({name:'genre1'})

        expect(res.status).to.equal(400)
    });
});
});