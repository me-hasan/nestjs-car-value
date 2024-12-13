import { Body, Controller, Delete, Get, Param, Post, Put, Session, UseGuards } from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from './decotators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(private usersService: UsersService, private authService: AuthService) {}

    @Get("users")
    getUsers() {
        return this.usersService.findAll();
    }

    @Get('colors/:color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color;
    }

    @Get('colors')
    getColor(@Session() session: any) {
      return session.color;
    }

    // @Get("whoami")
    // whoAmI(@Session() session: any) {
    //     return this.usersService.findUser(session.userId);
    // }

    @Get("whoami")
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post("signup")
    async createUser(@Body() body: createUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post("signin")
    async userLogin(@Body() body: createUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post("signout")
    signOut(@Session() session: any) {
        session.userId = null;
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
