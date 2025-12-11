const jwt = require('jsonwebtoken');
const { protect } = require('../../middleware/auth');
const User = require('../../models/User');
const db = require('../testSetup');

process.env.JWT_SECRET = 'test_secret_key';

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('Auth Middleware Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('protect middleware', () => {
    it('should authenticate with valid token', async () => {
      const user = await User.create({
        name: 'Test User',
        userName: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      mockReq.headers.authorization = `Bearer ${token}`;

      await protect(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user._id.toString()).toBe(user._id.toString());
      expect(mockReq.user.password).toBeUndefined();
    });

    it('should fail without authorization header', async () => {
      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Not authorized, no token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail with invalid token format', async () => {
      mockReq.headers.authorization = 'InvalidFormat token';

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail with invalid token', async () => {
      mockReq.headers.authorization = 'Bearer invalidtoken123';

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Not authorized, token failed',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail with expired token', async () => {
      const user = await User.create({
        name: 'Expired User',
        userName: 'expireduser',
        email: 'expired@example.com',
        password: 'password123',
      });

      const expiredToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '0s' });
      mockReq.headers.authorization = `Bearer ${expiredToken}`;

      // Wait a bit to ensure token expires
      await new Promise(resolve => setTimeout(resolve, 100));

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail when user not found', async () => {
      const fakeUserId = '507f1f77bcf86cd799439011';
      const token = jwt.sign({ id: fakeUserId }, process.env.JWT_SECRET, { expiresIn: '30d' });
      mockReq.headers.authorization = `Bearer ${token}`;

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Not authorized, user not found',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should not return password in req.user', async () => {
      const user = await User.create({
        name: 'Password Test',
        userName: 'passtest',
        email: 'pass@example.com',
        password: 'secret123',
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      mockReq.headers.authorization = `Bearer ${token}`;

      await protect(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.password).toBeUndefined();
    });

    it('should work with different authorization formats', async () => {
      const user = await User.create({
        name: 'Format Test',
        userName: 'formattest',
        email: 'format@example.com',
        password: 'password123',
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      
      // Test with Bearer (capital B)
      mockReq.headers.authorization = `Bearer ${token}`;
      await protect(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
