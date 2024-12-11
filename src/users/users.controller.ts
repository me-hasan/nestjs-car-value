import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';

@Controller('auth')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("users")
    getUsers() {
        return this.usersService.findAll();
    }

    @Post("singup")
    createUser(@Body() body: createUserDto){ 
        return this.usersService.create(body.email, body.password);
    }

    @UseInterceptors(ClassSerializerInterceptor)
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
