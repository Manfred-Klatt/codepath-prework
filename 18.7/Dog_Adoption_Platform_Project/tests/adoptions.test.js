const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../app');
const User = require('../models/User');
const Dog = require('../models/Dog');
const Adoption = require('../models/Adoption');
const { testUser, testDog } = require('./testHelper');

chai.use(chaiHttp);

describe('Adoptions API', () => {
  let ownerToken, adopterToken, dogId, ownerId, adopterId;
  const adopterUser = {
    username: 'adopter',
    email: 'adopter@example.com',
    password: 'Test123!',
  };

  before(async () => {
    // Clear all collections
    await User.deleteMany({});
    await Dog.deleteMany({});
    await Adoption.deleteMany({});

    // Register and login the owner
    await chai.request(app).post('/api/v1/auth/register').send(testUser);
    const ownerLoginRes = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    
    ownerToken = ownerLoginRes.body.token;
    ownerId = ownerLoginRes.body.data._id;

    // Register and login the adopter
    await chai.request(app).post('/api/v1/auth/register').send(adopterUser);
    const adopterLoginRes = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: adopterUser.email,
        password: adopterUser.password,
      });
    
    adopterToken = adopterLoginRes.body.token;
    adopterId = adopterLoginRes.body.data._id;

    // Create a dog for adoption
    const dogRes = await chai
      .request(app)
      .post('/api/v1/dogs')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(testDog);
    
    dogId = dogRes.body.data._id;
  });

  describe('POST /api/v1/dogs/:id/adopt', () => {
    it('should allow a user to adopt a dog', async () => {
      const message = 'I promise to take good care of this dog!';
      const res = await chai
        .request(app)
        .post(`/api/v1/dogs/${dogId}/adopt`)
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ message });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body.data).to.have.property('adopter', adopterId);
      expect(res.body.data).to.have.property('previousOwner', ownerId);
      expect(res.body.data).to.have.property('message', message);
      expect(res.body.data).to.have.property('status', 'completed');

      // Verify the dog status was updated
      const dogRes = await chai
        .request(app)
        .get(`/api/v1/dogs/${dogId}`)
        .set('Authorization', `Bearer ${ownerToken}`);
      
      expect(dogRes.body.data).to.have.property('status', 'adopted');
    });

    it('should not allow adopting the same dog twice', async () => {
      // First adoption
      await chai
        .request(app)
        .post(`/api/v1/dogs/${dogId}/adopt`)
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ message: 'First adoption' });

      // Second adoption attempt
      const res = await chai
        .request(app)
        .post(`/api/v1/dogs/${dogId}/adopt`)
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ message: 'Second adoption attempt' });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('success', false);
    });

    it('should not allow adopting your own dog', async () => {
      // Create another dog owned by the adopter
      const dogRes = await chai
        .request(app)
        .post('/api/v1/dogs')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({
          ...testDog,
          name: 'My Own Dog',
        });
      
      const ownDogId = dogRes.body.data._id;
      
      // Try to adopt own dog
      const res = await chai
        .request(app)
        .post(`/api/v1/dogs/${ownDogId}/adopt`)
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ message: 'Trying to adopt my own dog' });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('success', false);
    });
  });

  describe('GET /api/v1/adoptions', () => {
    beforeEach(async () => {
      // Clear previous adoptions
      await Adoption.deleteMany({});
      
      // Create a few adoptions
      const dog1 = await Dog.create({
        ...testDog,
        name: 'Dog 1',
        registeredBy: ownerId,
      });
      
      const dog2 = await Dog.create({
        ...testDog,
        name: 'Dog 2',
        registeredBy: ownerId,
      });
      
      await Adoption.create([
        {
          dog: dog1._id,
          adopter: adopterId,
          previousOwner: ownerId,
          message: 'Adoption 1',
        },
        {
          dog: dog2._id,
          adopter: adopterId,
          previousOwner: ownerId,
          message: 'Adoption 2',
        },
      ]);
    });

    it('should get all adoptions for the current user', async () => {
      // Test for adopter
      const adopterRes = await chai
        .request(app)
        .get('/api/v1/adoptions')
        .set('Authorization', `Bearer ${adopterToken}`);
      
      expect(adopterRes).to.have.status(200);
      expect(adopterRes.body).to.have.property('success', true);
      expect(adopterRes.body.data).to.be.an('array').that.has.lengthOf(2);
      
      // Test for owner
      const ownerRes = await chai
        .request(app)
        .get('/api/v1/adoptions')
        .set('Authorization', `Bearer ${ownerToken}`);
      
      expect(ownerRes).to.have.status(200);
      expect(ownerRes.body).to.have.property('success', true);
      expect(ownerRes.body.data).to.be.an('array').that.has.lengthOf(2);
    });

    it('should support pagination', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/adoptions?page=1&limit=1')
        .set('Authorization', `Bearer ${adopterToken}`);
      
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array').that.has.lengthOf(1);
      expect(res.body).to.have.property('page', 1);
      expect(res.body).to.have.property('limit', 1);
      expect(res.body).to.have.property('total', 2);
      expect(res.body).to.have.property('pages', 2);
    });
  });

  describe('GET /api/v1/adoptions/:id', () => {
    let adoptionId;

    beforeEach(async () => {
      // Create an adoption
      const adoption = await Adoption.create({
        dog: dogId,
        adopter: adopterId,
        previousOwner: ownerId,
        message: 'Test adoption',
      });
      
      adoptionId = adoption._id;
    });

    it('should get a single adoption by ID', async () => {
      // Test for adopter
      const adopterRes = await chai
        .request(app)
        .get(`/api/v1/adoptions/${adoptionId}`)
        .set('Authorization', `Bearer ${adopterToken}`);
      
      expect(adopterRes).to.have.status(200);
      expect(adopterRes.body).to.have.property('success', true);
      expect(adopterRes.body.data).to.have.property('_id', adoptionId.toString());
      
      // Test for owner
      const ownerRes = await chai
        .request(app)
        .get(`/api/v1/adoptions/${adoptionId}`)
        .set('Authorization', `Bearer ${ownerToken}`);
      
      expect(ownerRes).to.have.status(200);
      expect(ownerRes.body).to.have.property('success', true);
    });

    it('should not allow viewing someone else\'s adoption', async () => {
      // Create a third user
      const thirdUser = {
        username: 'thirduser',
        email: 'third@example.com',
        password: 'Test123!',
      };
      
      await chai.request(app).post('/api/v1/auth/register').send(thirdUser);
      const loginRes = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          email: thirdUser.email,
          password: thirdUser.password,
        });
      
      const thirdUserToken = loginRes.body.token;
      
      // Try to view the adoption with the third user's token
      const res = await chai
        .request(app)
        .get(`/api/v1/adoptions/${adoptionId}`)
        .set('Authorization', `Bearer ${thirdUserToken}`);
      
      expect(res).to.have.status(403);
      expect(res.body).to.have.property('success', false);
    });
  });
});
