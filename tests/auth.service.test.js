// Unit tests for auth.service with models and helpers mocked.
jest.mock('../src/models/User.model');
jest.mock('../src/models/RefreshToken.model');
jest.mock('../src/services/email.service');
jest.mock('../src/services/token.service');
jest.mock('../src/utils/bcrypt');

const UserModel = require('../src/models/User.model');
const RefreshTokenModel = require('../src/models/RefreshToken.model');
const emailService = require('../src/services/email.service');
const tokenService = require('../src/services/token.service');
const bcryptUtil = require('../src/utils/bcrypt');
const authService = require('../src/services/auth.service');

beforeEach(() => jest.clearAllMocks());

describe('register', () => {
  test('creates user and sends verification email', async () => {
    UserModel.findByEmail.mockResolvedValue(null);
    bcryptUtil.hash.mockResolvedValue('hashed');
    UserModel.create.mockResolvedValue(42);
    UserModel.findById.mockResolvedValue({
      id: 42, email: 'a@b.com', full_name: 'A', is_email_verified: false, is_active: true,
    });
    const res = await authService.register({ email: 'a@b.com', password: 'password123', full_name: 'A' });
    expect(res.id).toBe(42);
    expect(UserModel.create).toHaveBeenCalled();
    expect(emailService.sendVerificationEmail).toHaveBeenCalledWith('a@b.com', expect.any(String));
  });

  test('rejects duplicate email', async () => {
    UserModel.findByEmail.mockResolvedValue({ id: 1 });
    await expect(
      authService.register({ email: 'a@b.com', password: 'pw12345678', full_name: 'A' })
    ).rejects.toThrow('Email already registered');
  });
});

describe('login', () => {
  test('returns tokens on valid credentials', async () => {
    UserModel.findByEmail.mockResolvedValue({
      id: 7, email: 'a@b.com', password_hash: 'h', is_active: true, full_name: 'A',
    });
    bcryptUtil.compare.mockResolvedValue(true);
    tokenService.generateAccessToken.mockReturnValue({ token: 'access', jti: 'j' });
    tokenService.generateRefreshToken.mockResolvedValue({ token: 'refresh', expiresAt: new Date() });
    UserModel.update.mockResolvedValue(1);
    const r = await authService.login({ email: 'a@b.com', password: 'pw' });
    expect(r.access_token).toBe('access');
    expect(r.refresh_token).toBe('refresh');
  });

  test('rejects invalid password', async () => {
    UserModel.findByEmail.mockResolvedValue({ id: 1, password_hash: 'h', is_active: true });
    bcryptUtil.compare.mockResolvedValue(false);
    await expect(authService.login({ email: 'a@b.com', password: 'bad' })).rejects.toThrow('Invalid credentials');
  });

  test('rejects inactive account', async () => {
    UserModel.findByEmail.mockResolvedValue({ id: 1, password_hash: 'h', is_active: false });
    await expect(authService.login({ email: 'a@b.com', password: 'pw' })).rejects.toThrow('Account disabled');
  });
});

describe('verifyEmail', () => {
  test('marks email verified', async () => {
    UserModel.findByVerificationToken.mockResolvedValue({
      id: 1, email_verification_expires: new Date(Date.now() + 60000),
    });
    UserModel.update.mockResolvedValue(1);
    const r = await authService.verifyEmail('tok');
    expect(r.verified).toBe(true);
    expect(UserModel.update).toHaveBeenCalledWith(1, expect.objectContaining({ is_email_verified: true }));
  });

  test('rejects expired token', async () => {
    UserModel.findByVerificationToken.mockResolvedValue({
      id: 1, email_verification_expires: new Date(Date.now() - 1000),
    });
    await expect(authService.verifyEmail('tok')).rejects.toThrow('expired');
  });
});

describe('forgotPassword', () => {
  test('does not reveal unknown emails', async () => {
    UserModel.findByEmail.mockResolvedValue(null);
    const r = await authService.forgotPassword({ email: 'x@y.com' });
    expect(r.sent).toBe(true);
    expect(emailService.sendResetEmail).not.toHaveBeenCalled();
  });
});

describe('resetPassword', () => {
  test('resets when token valid', async () => {
    UserModel.findByResetToken.mockResolvedValue({
      id: 9, password_reset_expires: new Date(Date.now() + 60000),
    });
    bcryptUtil.hash.mockResolvedValue('newhash');
    UserModel.update.mockResolvedValue(1);
    RefreshTokenModel.revokeAllForUser.mockResolvedValue(0);
    const r = await authService.resetPassword({ token: 't', new_password: 'newpass12' });
    expect(r.reset).toBe(true);
    expect(RefreshTokenModel.revokeAllForUser).toHaveBeenCalledWith(9);
  });
});
