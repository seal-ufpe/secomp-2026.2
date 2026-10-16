import { Body, Controller, Get, Inject, Post } from '@nestjs/common';

import { UsersService } from './users.service';

interface CreateUserBody {
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly usersService: Pick<UsersService, 'list' | 'create'>,
  ) {}

  @Get()
  list(): Promise<unknown[]> {
    return this.usersService.list();
  }

  @Post()
  create(@Body() body: CreateUserBody): Promise<unknown[]> {
    return this.usersService.create(body);
  }
}
