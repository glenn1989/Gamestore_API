const request = require('supertest');
const {Game} = require('../models/game');
const {Genre} = require('../models/genre');
const {User} = require('../models/user');
const {Library} = require('../models/library')
const {Studio} = require('../models/studio');
const expect = require('chai').expect;


describe('api/libraries', () => {
    beforeEach( () => { server = require('../index');})
    afterEach( async () => {
        server.close();
        await Library.remove({});
        await Game.remove({});
        await Genre.remove({});
        await Studio.remove({});
    });

describe('POST/', () => {
    it('should be status 200', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzIxNjc2MjV9._Takc0zOrRng-v5MC5xeE16k_eAE40K6KvhU6kQPl0U';
        const user = await request(server).get('/api/users/me').set('x-auth-token',token)
        const res = await request(server)
        .post('/api/libraries')
        .set('Content-type', 'application/json')
        .set('x-auth-token',token)
        .send({user:user.body._id})

        expect(res.status).to.equal(200)
    });
    it('should be status 400: invalid user', async () => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzIxNjc2MjV9._Takc0zOrRng-v5MC5xeE16k_eAE40K6KvhU6kQPl0U";
        const userId = 'd568462668'
        const res = await request(server)
        .post('/api/libraries')
        .set('Content-type', 'application/json')
        .set('x-auth-token',token)
        .send({user:userId})

        expect(res.status).to.equal(400)
    });
    it('should be status 401: no token provided', async () => {
        const userId = 'd568462668'
        const res = await request(server)
        .post('/api/libraries')
        .set('Content-type', 'application/json')
        .send({user:userId})

        expect(res.status).to.equal(401)
    });

});
describe('PUT/:id', () => {
    it('should return status 200', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzIxNjc2MjV9._Takc0zOrRng-v5MC5xeE16k_eAE40K6KvhU6kQPl0U';
        const userId = '63a9db46338c483d42abfb84'
        
        await Genre.collection.insertOne({name:'RPG'});
        const genreRes = await request(server).get('/api/genres');

        await Studio.collection.insertOne({name:'lib stud 1', location:'lib loc 1'});
        const studioRes = await request(server).get('/api/studios');

        await Game.collection.insertOne({
            title:'game1',
            genre: {name: genreRes.body[0].name},
            studio:{name: studioRes.body[0].name, location: studioRes.body[0].location}
        });
    
        const game = await request(server).get('/api/games');

        await Library.collection.insertOne({user:userId});

        const library = await request(server).get('/api/libraries');

        const res = await request(server)
        .put(`/api/libraries/${library.body[0]._id}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token',token)
        .send({user: userId, game: game.body[0]._id});

        expect(res.status).to.equal(200);
    });
    it('should return status 400: game already bought', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzIxNjc2MjV9._Takc0zOrRng-v5MC5xeE16k_eAE40K6KvhU6kQPl0U';
        const userId = '63a9db46338c483d42abfb84'
        
        await Genre.collection.insertOne({name:'RPG'});
        const genreRes = await request(server).get('/api/genres');

        await Studio.collection.insertOne({name:'lib stud 1', location:'lib loc 1'});
        const studioRes = await request(server).get('/api/studios');

        await Game.collection.insertOne({
            title:'game1',
            genre: {name: genreRes.body[0].name},
            studio:{name: studioRes.body[0].name, location: studioRes.body[0].location}
        });
    
        const game = await request(server).get('/api/games');

        const gameList = []

        gameList.push(game.body[0]);

        await Library.collection.insertOne({user:userId, games: gameList});

        const library = await request(server).get('/api/libraries');

        const res = await request(server)
        .put(`/api/libraries/${library.body[0]._id}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token',token)
        .send({user: userId, game: game.body[0]._id});

        expect(res.status).to.equal(400);
        expect(res.text).to.equal('Game already bought.');
    });

});
describe('DELETE/:id', () => {
    it('should be status 200', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzIxNjc2MjV9._Takc0zOrRng-v5MC5xeE16k_eAE40K6KvhU6kQPl0U';
        const user = await request(server).get('/api/users/me')
        .set('x-auth-token',token);
        
        await Library.collection.insertOne({user: user.body._id});
        const library = await request(server).get('/api/libraries')


        const res = await request(server)
        .delete(`/api/libraries/${library.body[0]._id}`)
        .set('x-auth-token',token);

        expect(res.status).to.equal(200);
    });
    it('should be status 404: library is not found', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzIxNjc2MjV9._Takc0zOrRng-v5MC5xeE16k_eAE40K6KvhU6kQPl0U';

        const libraryId = '63a9db46338c483d42abfb84'

        const res = await request(server).delete(`/api/libraries/${libraryId}`).set('x-auth-token',token);

        expect(res.status).to.equal(404);

    });
})
})
