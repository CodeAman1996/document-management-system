import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { RoleEnum } from 'src/users/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    name: 'Aman',
    email: 'test@example.com',
    password: '',
    place: 'Indore',
    role: RoleEnum.VIEWER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockImplementation(() => Promise.resolve('mocked-jwt-token')),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return a token when valid user is provided', async () => {
    const hashedPassword = await bcrypt.hash('testpass', 10);
    mockUser.password = hashedPassword;

    (usersService.findByEmail as jest.Mock).mockImplementationOnce(() => Promise.resolve(mockUser));

    const loginDto = {
      email: 'test@example.com',
      password: 'testpass',
    };

    const token = await authService.login(loginDto);
    expect(token).toEqual({ access_token: 'mocked-jwt-token' });
  });

  it('should throw UnauthorizedException for invalid password', async () => {
    const hashedPassword = await bcrypt.hash('correctpass', 10);
    mockUser.password = hashedPassword;

    (usersService.findByEmail as jest.Mock).mockImplementationOnce(() => Promise.resolve(mockUser));

    const loginDto = {
      email: 'test@example.com',
      password: 'wrongpass',
    };

    await expect(authService.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if user not found', async () => {
    (usersService.findByEmail as jest.Mock).mockImplementationOnce(() => Promise.resolve(null));

    const loginDto = {
      email: 'unknown@example.com',
      password: 'testpass',
    };

    await expect(authService.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});