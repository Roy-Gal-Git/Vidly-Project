const request = require('supertest');
const { Genre } = require('../../models/genre');
const mongoose = require('mongoose');
const { User } = require('../../models/user');
let server;

describe('/api/genres', () => {
  beforeEach(() => { server = require('../../index'); });
  afterEach(async () => { 
    server.close();
    await Genre.remove({});
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' }
      ]);

      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some( g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some( g => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });

    it('should return a genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
    });
  });

  describe('POST /add_genre', () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post('/api/genres/add_genre')
        .set('x-auth-token', token)
        .send({ name: name });
    };

    beforeEach(() => {
      token = new User({ 
        name:'One',
        email: 'OneTwoThree@gmail.com',
        password: '123',
        isAdmin: true })
        .generateAuthToken();
      
      name = 'genre1';
    });


    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await request(server)
        .post('/api/genres/add_genre')
        .send({ name: 'genre1' });

      expect(res.status).toBe(401);
    });
    
    it('should return 400 if genre is less than 3 characters', async () => {
      name = '12';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 20 characters', async () => {
      name = new Array(22).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {
      await exec();

      const genre = await Genre.find({ name: 'genre1' });
      expect(genre).not.toBeNull();
    });

    it('should return the genre if it is valid', async () => {
      const res = await exec();
      
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
});