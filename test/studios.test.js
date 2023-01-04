const request = require('supertest');
const {Studio} = require('../models/studio');
const expect = require('chai').expect;

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzI3NzA4ODJ9.O7Jc8Gwk_GAxqfgCPAbivPy1kb-3G56ZuA5C1RgkIik';

describe('api/studios', () => {
    beforeEach( () => { server = require('../index');})
    afterEach( async () => {
        server.close();
        await Studio.remove({});
        
    });

describe('POST/', () => {
    it('should be status 200', async () => {
        
        const res = await request(server)
        .post('/api/studios')
        .set('Content-type', 'application/json')
        .set('x-auth-token',token)
        .send({name:'studio1',location:'testloc1'})

        expect(res.status).to.equal(200)
    });
    it('should be status 403: access denied', async () => {
        const invalidtoken = "eyJfaWQiOiI2M2E5YmFhMmFlOGI0OWI3NDViMjVlMzQiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjcyMDY3NzU5fQ.QM_vspcQqOmns_HDlvNeqp7_WWFAOgDGIpAzvA4KRK0";
        const res = await request(server)
        .post('/api/studios')
        .set('Content-type', 'application/json')
        .set('x-auth-token',invalidtoken)
        .send({name:'studio1',location:'testloc1'})

        expect(res.status).to.equal(403)
    });
    it('should be status 400: invalid token', async () => {
        const invalidtoken = "eyJfaWQiOiI2M2E5YmFhMmFlOGI0OWI3NDViMjVlMzQiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjcyMDY3NzU5fQ.QM_vspcQqOmns_HDlvNeqp7_WWFAOgDGIpAzvA4KRK0";
        const res = await request(server)
        .post('/api/studios')
        .set('Content-type', 'application/json')
        .set('x-auth-token',invalidtoken)
        .send({name:'studio1',location:'testloc1'})

        expect(res.status).to.equal(400)
    });
});
describe('DELETE/:id', () => {
    it('should be status 200', async () => {
       
        await Studio.collection.insertOne({name:"test studio 1", location:'location studio 1'});
        const studio = await request(server).get('/api/studios')
        const res = await request(server)
        .delete(`/api/studios/${studio.body[0]._id}`)
        .set('x-auth-token',token)

        expect(res.status).to.equal(200);
    });
    it('should be status 404: genre not found', async () => {
        
        const id = '63a9db46338c483d42abfb84';
        
        const res = await request(server)
        .delete(`/api/studios/${id}`)
        .set('x-auth-token',token);

        expect(res.status).to.equal(404);
    });
});
describe('PUT/:id', () => {
    it('should be status 200: update record', async () => {
        
        await Studio.collection.insertOne({name:"test studio 1", location:'location studio 1'});
        const studio = await request(server).get('/api/studios')
        const res = await request(server)
        .put(`/api/studios/${studio.body[0]._id}`)
        .set('x-auth-token', token)
        .send({name:"test studio 2", location:'location studio 2'});

        const studio2 = await request(server).get('/api/studios')

        expect(studio2.body[0].name).to.equal('test studio 2');
        expect(res.status).to.equal(200)
    });
    it('should be status 404: genre not found', async () => {
        
        const id = '63a9db46338c483d42abfb84';

        const res = await request(server)
        .put(`/api/studios/${id}`)
        .set('x-auth-token', token)
        .send({name:'test studios', location:'location studio 2'});

        expect(res.status).to.equal(404);
    });
});
describe('GET/:id', () => {
    it('find studio by id: should be status 200', async () => {
        await Studio.collection.insertOne({name:"test studio 1", location: "location studio 1"});
        const studio = await request(server).get('/api/studios');
        const studioRes = await request(server).get(`/api/studios/${studio.body[0]._id}`);

        expect(studioRes.status).to.equal(200)
    });
    it('find studio by id: should be error 404', async () => {
        const id = '63a9db46338c483d42abfb84'
        const res = await request(server).get(`/api/studios/${id}`);

        expect(res.status).to.equal(404);

    });
});
describe('GET/', () => {
    it('should be status 200', async () => {
        await Studio.collection.insertOne({name:"test studio 1", location:"test location 1"});
        const studio = await request(server).get('/api/studios');

        expect(studio.body[0].name).to.equal('test studio 1')
        expect(studio.status).to.equal(200)
    });
})
});