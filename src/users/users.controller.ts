import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get("users")
    getUsers() {
        return this.usersService.findAll();
    }

    @Post("singup")
    createUser(@Body() body: createUserDto){ 
        return this.usersService.create(body.email, body.password);
    }

    @Get("users/:id")
    getUser(@Body() body: createUserDto, @Param("id") id: number) {
        if (!id) {
            return null;           
        } 
        return this.usersService.findOne(id);
    }

    @Get("users/email/:email")
    getUserByEmail(@Param("email") email: string) {
        return this.usersService.findByEmail(email);
    }

    @Put("users/:id")
    updateUser(@Body() body: createUserDto, @Param("id") id: number) {
        const user = this.usersService.update(id, body);
        return user;
    }

    @Delete("users/:id")
    removeUser(@Param("id") id: number) {
        const user = this.usersService.remove(id);
        return user;
    }

    
}
