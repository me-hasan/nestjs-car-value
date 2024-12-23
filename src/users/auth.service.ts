import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}


    async signup (email: string, password: string) {
        // see if email is in use

        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser.length) {
            throw new BadRequestException('email in use');
        }
        
        // if it is, throw an error


        // hash password
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const hashedPassword = salt + '.' + hash.toString('hex');

        const user = await this.usersService.create(email, hashedPassword);

        return user;
    }

    async signin (email: string, password: string) {
        const [user] = await this.usersService.findByEmail(email);
        if(!user) { 
            throw new NotFoundException('user not found');
        }
        const [salt, storedHash] = user.password.split('.');

        const hash = await (scrypt(password, salt, 32)) as Buffer;
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }
        return user;
    }
}
