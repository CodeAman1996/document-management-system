import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { RegisterDto } from '../dto/register.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SkipAuthGuard } from 'src/auth/skipauth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  async create(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create(registerDto);
      console.log('User created successfully:', user);
      return user;
    } catch (error) {
      console.error('Create User Error:', error.message);
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register')
  @SkipAuthGuard()
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create(registerDto);
      console.log('User registered successfully:', user);
      return user;
    } catch (error) {
      console.error('Register User Error:', error.message);
      throw new HttpException(
        'Failed to register user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @Roles('admin')
  async findAll() {
    try {
      const getAllUsers = await this.usersService.findAll();
      console.log('Getting All Users Data Succesfully:', getAllUsers);
      return getAllUsers;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @Roles('admin', 'editor', 'viewer')
  async findOne(@Param('id') id: string) {
    try {
      const userById = await this.usersService.findOne(id);
      console.log(`Getting Users Data for id: ${id}:`, userById);
      return userById;
    } catch (error) {
      throw new HttpException(
        error.message || 'User not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  @Roles('admin', 'editor', 'viewer')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      console.log();
      const putUser = await this.usersService.update(id, updateUserDto);
      console.log('User Details Updated succesfully:', putUser);
      return putUser;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    try {
      const deleteUser = await this.usersService.remove(id);
      console.log('User deleted Succesfully:', deleteUser);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
