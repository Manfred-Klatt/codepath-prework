const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../app');
const User = require('../models/User');
const Dog = require('../models/Dog');
const { testUser, testDog } = require('./testHelper');

chai.use(chaiHttp);

describe('Dogs API', () => {
  let token;
  let userId;
  let testDogId;

  before(async () => {
    // Clear all collections
    await User.deleteMany({});
    await Dog.deleteMany({});

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
    userId = loginRes.body.data._id;
  });

  describe('POST /api/v1/dogs', () => {
    it('should register a new dog', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send(testDog);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('name', testDog.name);
      expect(res.body.data).to.have.property('status', 'available');
      
      // Save the dog ID for future tests
      testDogId = res.body.data._id;
    });

    it('should not register a dog without required fields', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Incomplete Dog' }); // Missing required fields

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('success', false);
    });
  });

  describe('GET /api/v1/dogs/registered', () => {
    it('should get all dogs registered by the current user', async () => {
      // Register another dog
      await chai
        .request(app)
        .post('/api/v1/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testDog,
          name: 'Another Dog',
        });

      const res = await chai
        .request(app)
        .get('/api/v1/dogs/registered')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.be.an('array').that.has.lengthOf.at.least(1);
      expect(res.body).to.have.property('count').that.is.at.least(1);
    });
  });

  describe('GET /api/v1/dogs/available', () => {
    it('should get all available dogs', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/dogs/available')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.be.an('array');
    });
  });

  describe('GET /api/v1/dogs/:id', () => {
    it('should get a single dog by ID', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/dogs/${testDogId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('_id', testDogId);
    });

    it('should return 404 for non-existent dog', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const res = await chai
        .request(app)
        .get(`/api/v1/dogs/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('success', false);
    });
  });

  describe('PUT /api/v1/dogs/:id', () => {
    it('should update a dog', async () => {
      const updatedName = 'Updated Dog Name';
      const res = await chai
        .request(app)
        .put(`/api/v1/dogs/${testDogId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: updatedName });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('name', updatedName);
    });

    it('should not allow updating another user\'s dog', async () => {
      // Create a second user
      const secondUser = {
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'Test123!',
      };
      
      await chai.request(app).post('/api/v1/auth/register').send(secondUser);
      const loginRes = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          email: secondUser.email,
          password: secondUser.password,
        });
      
      const secondUserToken = loginRes.body.token;
      
      // Try to update the first user's dog with the second user's token
      const res = await chai
        .request(app)
        .put(`/api/v1/dogs/${testDogId}`)
        .set('Authorization', `Bearer ${secondUserToken}`)
        .send({ name: 'Unauthorized Update' });

      expect(res).to.have.status(403);
      expect(res.body).to.have.property('success', false);
    });
  });

  describe('DELETE /api/v1/dogs/:id', () => {
    it('should delete a dog', async () => {
      // First create a dog to delete
      const dogRes = await chai
        .request(app)
        .post('/api/v1/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testDog,
          name: 'Dog to delete',
        });
      
      const dogToDeleteId = dogRes.body.data._id;
      
      // Now delete it
      const res = await chai
        .request(app)
        .delete(`/api/v1/dogs/${dogToDeleteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      
      // Verify it's gone
      const getRes = await chai
        .request(app)
        .get(`/api/v1/dogs/${dogToDeleteId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(getRes).to.have.status(404);
    });
  });
});
