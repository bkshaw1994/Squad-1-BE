const mongoose = require('mongoose');
const Staff = require('../../models/Staff');
const db = require('../testSetup');

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('Staff Model Test', () => {
  it('should create & save staff successfully', async () => {
    const validStaff = new Staff({
      name: 'Dr. Test',
      staffId: 'TEST001',
      role: 'Doctor',
      shift: 'Morning (8:00 AM - 4:00 PM)',
    });
    const savedStaff = await validStaff.save();
    
    expect(savedStaff._id).toBeDefined();
    expect(savedStaff.name).toBe('Dr. Test');
    expect(savedStaff.staffId).toBe('TEST001');
    expect(savedStaff.role).toBe('Doctor');
    expect(savedStaff.shift).toBe('Morning (8:00 AM - 4:00 PM)');
  });

  it('should fail to create staff without required fields', async () => {
    const staffWithoutRequired = new Staff({ name: 'Test' });
    let err;
    try {
      await staffWithoutRequired.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.staffId).toBeDefined();
    expect(err.errors.role).toBeDefined();
    expect(err.errors.shift).toBeDefined();
  });

  it('should enforce unique staffId', async () => {
    await Staff.create({
      name: 'First Staff',
      staffId: 'DUP001',
      role: 'Nurse',
      shift: 'Morning (8:00 AM - 4:00 PM)',
    });
    
    let err;
    try {
      await Staff.create({
        name: 'Second Staff',
        staffId: 'DUP001',
        role: 'Doctor',
        shift: 'Evening (4:00 PM - 12:00 AM)',
      });
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
  });

  it('should trim whitespace from fields', async () => {
    const staff = new Staff({
      name: '  Dr. Space  ',
      staffId: '  SPACE001  ',
      role: '  Doctor  ',
      shift: '  Morning (8:00 AM - 4:00 PM)  ',
    });
    await staff.save();
    
    expect(staff.name).toBe('Dr. Space');
    expect(staff.staffId).toBe('SPACE001');
    expect(staff.role).toBe('Doctor');
    expect(staff.shift).toBe('Morning (8:00 AM - 4:00 PM)');
  });

  it('should have createdAt timestamp', async () => {
    const staff = new Staff({
      name: 'Dr. Time',
      staffId: 'TIME001',
      role: 'Doctor',
      shift: 'Morning (8:00 AM - 4:00 PM)',
    });
    const savedStaff = await staff.save();
    
    expect(savedStaff.createdAt).toBeDefined();
    expect(savedStaff.createdAt).toBeInstanceOf(Date);
  });

  it('should validate role field exists', async () => {
    const staffNoRole = new Staff({
      name: 'No Role',
      staffId: 'NOROLE001',
      shift: 'Morning (8:00 AM - 4:00 PM)',
    });
    
    let err;
    try {
      await staffNoRole.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.role).toBeDefined();
  });
});
