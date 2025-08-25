const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Connect to the in-memory database before tests run
before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Disconnect and close the in-memory database after all tests are done
after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

module.exports = {
  // Test user data
  testUser: {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test123!',
  },
  
  // Test dog data
  testDog: {
    name: 'Buddy',
    description: 'A friendly golden retriever',
    breed: 'Golden Retriever',
    age: 3,
    size: 'large',
    gender: 'male',
  },
};
