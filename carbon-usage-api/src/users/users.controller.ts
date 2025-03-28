import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get user information by ID
  @Get(':id')
  async getUserInfo(@Param('id') userId: string) {
    const user: User = await this.usersService.getUserInfoById(userId);
    return user;
  }
}
