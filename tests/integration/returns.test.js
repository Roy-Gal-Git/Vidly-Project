const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const request = require('supertest');
let server;
let customerId;
let movieId;
let rental;
let token;

describe('/api/returns', () => {
  beforeAll(async () => {
    server = require('../../index');

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: 'movie title',
        dailyRentalRate: 2
      }
    });

    // token = new User({ 
    //   name:'One',
    //   email: 'OneTwoThree@gmail.com',
    //   password: '123',
    //   isAdmin: true })
    //   .generateAuthToken();

    await rental.save();

  });

  afterEach(async () => { 
    await rental.remove({});
  });
  
  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
    await mongoose.disconnect();
  });

  it('should return 401 if client is not logged in', async () => {
    const res = await request(server)
      .post('/api/returns')
      .send({ customerId, movieId });

    expect(res.status).toBe(401)
  });

  it('should return 400 if customerId is not provided', async () => {
    token = new User({}).generateAuthToken();
    
    const res = await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ movieId });

    expect(res.status).toBe(400)
  });

  it('should return 400 if movieId is not provided', async () => {
    token = new User({}).generateAuthToken();

    const res = await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId});

    expect(res.status).toBe(400)
  });

});