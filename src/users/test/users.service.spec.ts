import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../service/users.service';
import { RegisterDto } from '../dto/register.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn((dto: RegisterDto) => ({ id: '1', ...dto })),
    findAll: jest.fn(() => [
      { id: '1', name: 'John', email: 'john@example.com' },
    ]),
    findOne: jest.fn((id: string) => ({
      id,
      name: 'Mock User',
      email: 'mock@example.com',
    })),
    update: jest.fn((id: string, dto: any) => ({
      id,
      ...dto,
    })),
    remove: jest.fn(() => undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: RegisterDto = {
      name: 'Jane',
      email: 'jane@example.com',
      password: '123',
      place: '',
    };
    const result = await controller.create(dto);
    expect(result.name).toEqual('Jane');
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all users', async () => {
    const result = await controller.findAll();
    expect(result.length).toBeGreaterThan(0);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find a user by ID', async () => {
    const result = await controller.findOne('1');
    expect(result.id).toEqual('1');
    expect(result.name).toBe('Mock User');
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a user', async () => {
    const updateDto = { name: 'Updated User' };
    const result = await controller.update('1', updateDto as any);
    expect(result.name).toEqual('Updated User');
    expect(service.update).toHaveBeenCalledWith('1', updateDto);
  });

  it('should remove a user', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual({ message: 'User deleted successfully' });
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
