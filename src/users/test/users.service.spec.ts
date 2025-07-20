import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../service/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(dto => ({ id: Date.now(), ...dto })),
      findAll: jest.fn(() => [{ id: 1, name: 'John' }]),
    };

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

  it('should create a user', async () => {
    const dto = { name: 'Jane', email: 'jane@example.com', password: '123' };
    const result = await controller.create(dto as any);
    expect(result.name).toEqual('Jane');
    expect(service.create).toHaveBeenCalled();
  });

  it('should return all users', async () => {
    const result = await controller.findAll();
    expect(result.length).toBeGreaterThan(0);
  });
});
