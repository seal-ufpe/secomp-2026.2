import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

type CreateUserBody = {
  name: string;
  email: string;
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list() {
    return this.usersService.list();
  }

  @Post()
  create(@Body() body: CreateUserBody) {
    return this.usersService.create(body);
  }
}
