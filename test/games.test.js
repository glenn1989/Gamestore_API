
const request = require('supertest');
const {Game} = require('../models/game');
const {Genre} = require('../models/genre');
const {User} = require('../models/user');
const {Library} = require('../models/library')
const {Studio} = require('../models/studio');
const expect = require('chai').expect;

let server;
const adtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzI5MTc1NTB9.CTOUmWs95HHnfo-l817vr_aXD_ZZ-syEXpTenDanC8g'

describe('api/games', () => {
    beforeEach( () => { server = require('../index');})
    afterEach( async () => {
        server.close();
        await Game.remove({});
        await Genre.remove({});
        await Studio.remove({});
        
    });
describe('GET/', () => {
    it('should return a game', async () => {

        await Studio.collection.insertOne({name:"Rockstar Games", location:"London"});
        const studio = await request(server).get('/api/studios');
        const studioRes = await request(server).get(`/api/studios/${studio.body[0]._id}`);

        await Genre.collection.insertOne({name:"RPG"});
        const genre = await request(server).get('/api/genres');
        const genreRes = await request(server).get(`/api/genres/${genre.body[0]._id}`);
        await Game.collection.insertOne(
            {title: 'game1',
            genre:{
                name:genre.body[0].name
            }, 
            studio:{
                name:studio.body[0].name,
                location:studio.body[0].location
            }
        });
        const response = await request(server).get('/api/games');
        expect(response.status).to.equal(200);
        });
    })
describe('GET/studio/:studio', () => {
    it('should return game from studio', async () => {
        await Studio.collection.insertOne({name:"Rockstar Games", location:"London"});
        const studio = await request(server).get('/api/studios');
        

        await Genre.collection.insertOne({name:"RPG"});
        const genre = await request(server).get('/api/genres');
        
        await Game.collection.insertMany([
            {title: 'game1',
            genre:{
                name:genre.body[0].name
            }, 
            studio:{
                name:studio.body[0].name,
                location:studio.body[0].location
            }},
            {title: 'game2',
            genre:{
                name:genre.body[0].name
            }, 
            studio:{
                name:studio.body[0].name,
                location:studio.body[0].location
            }}
        ]);  
        const response = await request(server).get('/api/games');
        const res = await request(server).get(`/api/games/studio/${response.body[0].studio.name}`);
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2)
        expect(res.body.some(g => g.name === 'game1'))
        expect(res.body.some(g => g.name === 'game2'))
    });
    it('should throw error 400', async () => {
        const studioTest = 'CD Project Red'
        
        const res = await request(server).get(`/api/games/studio/${studioTest}`);

        expect(res.status).to.equal(400);

    })   
    })

describe('POST/', () =>  {
    it('should return 200', async () => {
        

        await Studio.collection.insertOne({name:"Rockstar Games", location:"London"});
        const studio = await request(server).get('/api/studios'); 
        const studioId = studio.body[0]._id;

        await Genre.collection.insertOne({name:"RPG"});
        const genre = await request(server).get('/api/genres');
        const genreId = genre.body[0]._id;

        const res = await request(server)
        .post('/api/games')
        .set('Content-type', 'application/json')
        .set('x-auth-token', adtoken)
        .send({
            title: 'game1',
        genreId: genreId,
        studioId: studioId});

        expect(res.status).to.equal(200);
        
    });
    it('should return 400 - invalid token', async () => {
        await Studio.collection.insertOne({name:"Rockstar Games", location:"London"});
        const studio = await request(server).get('/api/studios');

        await Genre.collection.insertOne({name:"RPG"});
        const genre = await request(server).get('/api/genres');
        
        const res = await request(server)
        .post('/api/games')
        .set('Content-type', 'application/json')
        .set('x-auth-token',"123456.78901234.456789")
        .send({title: 'game1',
        genre: genre._id,
        studio:studio._id});

        expect(res.status).to.equal(400);
        
    });

    it('it should return 403 - no admin', async () => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2I2Yjc2ZGY2MGU0ZjlhMTBiMGNmMjEiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjcyOTE4ODkzfQ.ocHMVgB88qLyk9nV06p35IAtdkUFm-GDseQUp_KNe6E"
    
        await Studio.collection.insertOne({name:"Rockstar Games", location:"London"});
        const studio = await request(server).get('/api/studios');

        await Genre.collection.insertOne({name:"RPG"});
        const genre = await request(server).get('/api/genres');

        const res = await request(server)
        .post('/api/games')
        .set('Content-type', 'application/json')
        .set('x-auth-token',token)
        .send({title: 'game1',
        genre: genre._id,
        studio:studio._id});

        expect(res.status).to.equal(403)
    });
});
describe('DELETE/:id', () => {
    it('should delete game', async () => {

        
        await Studio.collection.insertOne({name:"Rockstar Games", location:"London"});
        const studio = await request(server).get('/api/studios');
        const studioRes = await request(server).get(`/api/studios/${studio.body[0]._id}`);

        await Genre.collection.insertOne({name:"RPG"});
        const genre = await request(server).get('/api/genres');
        const genreRes = await request(server).get(`/api/genres/${genre.body[0]._id}`);
        await Game.collection.insertOne(
            {title: 'game1',
            genre:{
                name:genre.body[0].name
            }, 
            studio:{
                name:studio.body[0].name,
                location:studio.body[0].location
            }
        });
        const response = await request(server).get('/api/games');
        const res = await request(server)
        .delete(`/api/games/${response.body[0]._id}`)
        .set('x-auth-token',adtoken);

        expect(res.status).to.equal(200);
        
    });

    it('should throw error 404: no game found', async () => {
        const gameId = "63a9b85ebf849e6a6806cec2"
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2E5ZGI0NjMzOGM0ODNkNDJhYmZiODQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NzIwNzYxMDJ9.-o2MkiO_SUdLSDi_7hIae7Y-wMuL6DS3DFG_8C4BGSE'

        const response = await request(server).get('/api/games');
        const res = await request(server)
        .delete(`/api/games/${gameId}`)
        .set('x-auth-token',adtoken);
        
        expect(res.status).to.equal(404);
    })
});
describe('GET/:id', () => {
    it('should be 200 - game found on ID', async () => {
        await Studio.collection.insertOne({name:"Rockstar Games", location:"London"});
        const studio = await request(server).get('/api/studios');
        const studioRes = await request(server).get(`/api/studios/${studio.body[0]._id}`);

        await Genre.collection.insertOne({name:"RPG"});
        const genre = await request(server).get('/api/genres');
        const genreRes = await request(server).get(`/api/genres/${genre.body[0]._id}`);
        await Game.collection.insertOne(
            {title: 'game1',
            genre:{
                name:genre.body[0].name
            }, 
            studio:{
                name:studio.body[0].name,
                location:studio.body[0].location
            }
        });
        const response = await request(server).get('/api/games');
        const res = await request(server).get(`/api/games/${response.body[0]._id}`);
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('game1');
    });
    it('should be error 404 - no game found on ID', async () => {
        const id = '63a9db46338c483d42abfb84';

        const res = await request(server).get(`/api/games/${id}`);
        expect(res.status).to.equal(404);
    })
})

});
