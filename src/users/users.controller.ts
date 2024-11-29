import { Body, Controller, Post } from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
    
    constructor(private usersService: UsersService) {}

    @Post("singup")
    createUser(@Body() body: createUserDto){ 
        return this.usersService.create(body.email, body.password);
    }

    
}
