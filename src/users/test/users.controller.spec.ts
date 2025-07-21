import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../service/users.service';
import { RegisterDto } from '../dto/register.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Reflector } from '@nestjs/core';
import { RoleEnum, User } from '../entities/user.entity';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        Reflector,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a viewer user', async () => {
      const dto: RegisterDto = {
        name: 'Aman',
        email: 'aman@mail.com',
        password: '123',
        place: '',
      };

      const result: User = {
        ...dto,
        id: 'abc123',
        role: RoleEnum.VIEWER,
        documents: [],
        createdAt:new Date(),
         updatedAt:new Date()
      };

      mockUsersService.create.mockResolvedValue(result);
      const res = await controller.register(dto);
      expect(res).toEqual(result);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });

    it('should throw error if registration fails', async () => {
      mockUsersService.create.mockRejectedValue(new Error('DB error'));
     await expect(controller.register({} as any)).rejects.toThrow('Failed to register user');
    });
  });

  describe('create (admin)', () => {
    it('should create a user', async () => {
      const dto: RegisterDto = {
        name: 'AdminUser',
        email: 'admin@mail.com',
        password: 'secure',
        place: '',
      };

      const result: User = {
        ...dto,
        id: 'user123',
        role: RoleEnum.ADMIN,
        documents: [],
        createdAt:new Date(),
         updatedAt:new Date()
      };

      mockUsersService.create.mockResolvedValue(result);
      const res = await controller.create(dto);
      expect(res).toEqual(result);
    });

    it('should throw if user creation fails', async () => {
      mockUsersService.create.mockRejectedValue(new Error('DB error'));
      await expect(controller.register({} as any)).rejects.toThrow('Failed to register user');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: User[] = [
        { id: '1', name: 'A', email: 'a@mail.com', password: '', role: RoleEnum.VIEWER, place: '', documents: [],createdAt:new Date(), updatedAt:new Date() },
        { id: '2', name: 'B', email: 'b@mail.com', password: '',  role: RoleEnum.EDITOR, place: '', documents: [],createdAt:new Date(), updatedAt:new Date() },
      ];
      mockUsersService.findAll.mockResolvedValue(users);
      const result = await controller.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const user: User = { id: '1', name: 'Aman', email: '', password: '', role: RoleEnum.ADMIN, place: '', documents: [],createdAt:new Date(), updatedAt:new Date() };
      mockUsersService.findOne.mockResolvedValue(user);
      const result = await controller.findOne('1');
      expect(result).toEqual(user);
    });

    it('should throw if user not found', async () => {
      mockUsersService.findOne.mockRejectedValue(new Error('User not found'));
      await expect(controller.findOne('99')).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const dto: UpdateUserDto = { name: 'Updated' };
      const result = { id: '1', name: 'Updated', email: '', password: '', role: 'viewer', place: '', documents: [] };
      mockUsersService.update.mockResolvedValue(result);
      const res = await controller.update('1', dto);
      expect(res).toEqual(result);
    });

    it('should throw error on failure', async () => {
      mockUsersService.update.mockRejectedValue(new Error('Update error'));
      await expect(controller.update('1', {} as any)).rejects.toThrow(
        'Update error',
      );
    });
  });

  describe('remove', () => {
    it('should delete the user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);
      const res = await controller.remove('1');
      expect(res).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw error if deletion fails', async () => {
      mockUsersService.remove.mockRejectedValue(new Error('Delete error'));
      await expect(controller.remove('1')).rejects.toThrow('Delete error');
    });
  });
});
