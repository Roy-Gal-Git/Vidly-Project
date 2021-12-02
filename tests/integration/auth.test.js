const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('auth middleware', () => {
  beforeAll(async () => { 
    server = require('../../index');
    await Genre.remove({});
    token = new User({ 
      name:'One',
      email: 'OneTwoThree@gmail.com',
      password: '123',
      isAdmin: true })
      .generateAuthToken();

  });
  afterEach(async () => {
  
    await Genre.remove({});
  });
  afterAll(async () => {
    await server.close(); 
    await mongoose.connection.close();
    await mongoose.disconnect();
  })
  
  let token;

  const exec = () => {
    return request(server).post('/api/genres/add_genre')
    .set('x-auth-token', token)
    .send({ name: 'genre1' });
  }

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 404 if an invalid token is provided', async () => {
    token = 'a';
    
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 200 if a valid token is provided', async () => {
    token = new User({ isAdmin: true }).generateAuthToken();
    const res = await exec();
    expect(res.status).toBe(200);
  });
});