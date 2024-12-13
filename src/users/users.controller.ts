import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(private usersService: UsersService, private authService: AuthService) {}

    @Get("users")
    getUsers() {
        return this.usersService.findAll();
    }

    @Post("signup")
    createUser(@Body() body: createUserDto){ 
        return this.authService.signup(body.email, body.password);
    }

    @Post("signin")
    userLogin(@Body() body: createUserDto){ 
        return this.authService.signin(body.email, body.password);
    }

    @Get("users/:id")
    getUser(@Param("id") id: number) {
        return this.usersService.findUser(id);
    }

    @Get("users/email/:email")
    getUserByEmail(@Param("email") email: string) {
        return this.usersService.findByEmail(email);
    }

    @Put("users/:id")
    updateUser(@Body() body: UpdateUserDto, @Param("id") id: number) {
        const user = this.usersService.update(id, body);
        return user;
    }

    @Delete("users/:id")
    removeUser(@Param("id") id: number) {
        const user = this.usersService.remove(id);
        return user;
    }

    
}
