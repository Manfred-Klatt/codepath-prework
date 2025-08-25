const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../app');
const User = require('../models/User');
const { testUser } = require('./testHelper');

chai.use(chaiHttp);

describe('Authentication API', () => {
  beforeEach(async () => {
    // Clear the users collection before each test
    await User.deleteMany({});
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('token');
    });

    it('should not register a user with duplicate email', async () => {
      // First register a user
      await chai.request(app).post('/api/v1/auth/register').send(testUser);

      // Try to register the same user again
      const res = await chai
        .request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('success', false);
    });

    it('should not register a user with missing required fields', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/register')
        .send({ username: 'test', password: 'test123' }); // Missing email

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('success', false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Register a user before testing login
      await chai.request(app).post('/api/v1/auth/register').send(testUser);
    });

    it('should login a registered user', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('token');
    });

    it('should not login with incorrect password', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('success', false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let token;

    beforeEach(async () => {
      // Register and login a user
      await chai.request(app).post('/api/v1/auth/register').send(testUser);
      const loginRes = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      token = loginRes.body.token;
    });

    it('should get current user profile with valid token', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('username', testUser.username);
      expect(res.body.data).to.have.property('email', testUser.email);
      expect(res.body.data).to.not.have.property('password');
    });

    it('should not get profile without token', async () => {
      const res = await chai.request(app).get('/api/v1/auth/me');

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('success', false);
    });
  });
});
