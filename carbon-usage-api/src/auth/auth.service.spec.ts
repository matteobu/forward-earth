/**
 * Unit tests for AuthService
 *
 * This comprehensive test suite covers the AuthService functionality:
 * - User validation process (existing and new users)
 * - JWT token generation and validation
 * - Error handling scenarios
 *
 * Key test scenarios include:
 * 1. Handling existing users
 * 2. Creating new users when not found
 * 3. Generating JWT tokens
 * 4. Setting HTTP-only cookies
 * 5. Verifying valid tokens
 * 6. Handling token expiration and invalid tokens
 */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('AuthService', () => {
  let service: AuthService;
  let supabaseServiceMock: Partial<SupabaseService>;
  let jwtServiceMock: Partial<JwtService>;
  let mockResponse: any;

  beforeEach(async () => {
    supabaseServiceMock = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    mockResponse = {
      cookie: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: SupabaseService,
          useValue: supabaseServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const testEmail = 'test@example.com';
    const testName = 'Test User';

    it('should validate existing user', async () => {
      const existingUser = {
        id: '1',
        email: testEmail,
        name: testName,
      };

      (supabaseServiceMock.getUserByEmail as jest.Mock).mockResolvedValue(
        existingUser,
      );

      (jwtServiceMock.sign as jest.Mock).mockReturnValue('mock-jwt-token');

      const result = await service.validateUser(
        testEmail,
        testName,
        mockResponse,
      );

      expect(supabaseServiceMock.getUserByEmail).toHaveBeenCalledWith(
        testEmail,
      );

      expect(supabaseServiceMock.createUser).not.toHaveBeenCalled();

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        email: testEmail,
        sub: existingUser.id,
        name: testName,
      });

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'jwt',
        'mock-jwt-token',
        expect.objectContaining({
          httpOnly: true,
          path: '/',
        }),
      );

      expect(result).toEqual({
        user: existingUser,
        token: 'mock-jwt-token',
      });
    });

    it('should create new user when not found', async () => {
      const newUser = {
        id: '2',
        email: testEmail,
        name: testName,
      };

      (supabaseServiceMock.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (supabaseServiceMock.createUser as jest.Mock).mockResolvedValue(newUser);
      (jwtServiceMock.sign as jest.Mock).mockReturnValue('mock-jwt-token');

      const result = await service.validateUser(
        testEmail,
        testName,
        mockResponse,
      );

      expect(supabaseServiceMock.getUserByEmail).toHaveBeenCalledWith(
        testEmail,
      );

      expect(supabaseServiceMock.createUser).toHaveBeenCalledWith(
        testName,
        testEmail,
      );

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        email: testEmail,
        sub: newUser.id,
        name: testName,
      });

      expect(result).toEqual({
        user: newUser,
        token: 'mock-jwt-token',
      });
    });
  });

  describe('verifyToken', () => {
    it('should successfully verify a valid token', async () => {
      const mockPayload = {
        sub: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      (jwtServiceMock.verify as jest.Mock).mockReturnValue(mockPayload);

      const result = await service.verifyToken('valid-token');

      expect(jwtServiceMock.verify).toHaveBeenCalledWith('valid-token');

      expect(result).toEqual({
        userId: mockPayload.sub,
        email: mockPayload.email,
        name: mockPayload.name,
      });
    });

    it('should throw UnauthorizedException for expired token', async () => {
      (jwtServiceMock.verify as jest.Mock).mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await expect(service.verifyToken('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );

      await expect(service.verifyToken('expired-token')).rejects.toThrow(
        'Token expired',
      );
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      (jwtServiceMock.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(
        'Invalid token',
      );
    });
  });
});
