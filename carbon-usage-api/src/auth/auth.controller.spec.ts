/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: Partial<AuthService>;
  let mockResponse: any;

  beforeEach(async () => {
    authServiceMock = {
      validateUser: jest.fn(),
      verifyToken: jest.fn(),
    };

    mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should successfully login and set jwt cookie', async () => {
      const loginDto = { email: 'test@example.com', name: 'Test User' };
      const mockAuthResult = {
        user: { id: '1', email: loginDto.email, name: loginDto.name },
        token: 'mock-jwt-token',
      };

      (authServiceMock.validateUser as jest.Mock).mockResolvedValue(
        mockAuthResult,
      );

      await controller.login(loginDto, mockResponse);

      expect(authServiceMock.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.name,
        expect.anything(),
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'jwt',
        'mock-jwt-token',
        expect.objectContaining({
          httpOnly: true,
          path: '/',
        }),
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockAuthResult.user,
      });
    });

    it('should throw UnauthorizedException on login failure', async () => {
      const loginDto = { email: 'test@example.com', name: 'Test User' };

      (authServiceMock.validateUser as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(controller.login(loginDto, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile when token is valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };
      const mockRequest = {
        cookies: {
          jwt: 'valid-token',
        },
      };

      (authServiceMock.verifyToken as jest.Mock).mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockRequest as any);

      expect(authServiceMock.verifyToken).toHaveBeenCalledWith('valid-token');

      expect(result).toEqual({ user: mockUser });
    });

    it('should throw UnauthorizedException when no token is present', async () => {
      const mockRequest = {
        cookies: {},
      };

      await expect(controller.getProfile(mockRequest as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when token verification fails', async () => {
      const mockRequest = {
        cookies: {
          jwt: 'invalid-token',
        },
      };

      (authServiceMock.verifyToken as jest.Mock).mockRejectedValue(
        new Error('Invalid token'),
      );

      await expect(controller.getProfile(mockRequest as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should clear jwt cookie and return success message', () => {
      controller.logout(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'jwt',
        expect.objectContaining({
          httpOnly: true,
          path: '/',
        }),
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });
  });
});
