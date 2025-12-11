const mongoose = require('mongoose');
const User = require('../../models/User');
const db = require('../testSetup');

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('User Model Test', () => {
  it('should create & save user successfully', async () => {
    const validUser = new User({
      name: 'Test User',
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    const savedUser = await validUser.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe('Test User');
    expect(savedUser.userName).toBe('testuser');
    expect(savedUser.email).toBe('test@example.com');
    expect(savedUser.password).not.toBe('password123'); // Should be hashed
  });

  it('should fail to create user without required fields', async () => {
    const userWithoutRequired = new User({ name: 'Test' });
    let err;
    try {
      await userWithoutRequired.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should hash password before saving', async () => {
    const user = new User({
      name: 'Hash Test',
      userName: 'hashtest',
      email: 'hash@example.com',
      password: 'plainPassword',
    });
    await user.save();
    
    expect(user.password).not.toBe('plainPassword');
    expect(user.password.length).toBeGreaterThan(20);
  });

  it('should not return password by default', async () => {
    await User.create({
      name: 'No Password',
      userName: 'nopass',
      email: 'nopass@example.com',
      password: 'secret',
    });
    
    const user = await User.findOne({ userName: 'nopass' });
    expect(user.password).toBeUndefined();
  });

  it('should match password correctly', async () => {
    const user = new User({
      name: 'Match Test',
      userName: 'matchtest',
      email: 'match@example.com',
      password: 'testPassword123',
    });
    await user.save();
    
    const foundUser = await User.findOne({ userName: 'matchtest' }).select('+password');
    const isMatch = await foundUser.matchPassword('testPassword123');
    const isNotMatch = await foundUser.matchPassword('wrongPassword');
    
    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  it('should enforce unique userName', async () => {
    await User.create({
      name: 'First',
      userName: 'duplicate',
      email: 'first@example.com',
      password: 'password',
    });
    
    let err;
    try {
      await User.create({
        name: 'Second',
        userName: 'duplicate',
        email: 'second@example.com',
        password: 'password',
      });
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
  });

  it('should enforce unique email', async () => {
    await User.create({
      name: 'First',
      userName: 'first',
      email: 'same@example.com',
      password: 'password',
    });
    
    let err;
    try {
      await User.create({
        name: 'Second',
        userName: 'second',
        email: 'same@example.com',
        password: 'password',
      });
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
  });
});
