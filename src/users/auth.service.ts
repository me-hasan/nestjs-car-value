import { Injectable, BadRequestException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}


    async signup (email: string, password: string) {
        // see if email is in use

        const user = await this.usersService.findByEmail(email);
        if (user.length) {
            throw new BadRequestException('email in use');
        }
        
        // if it is, throw an error


        // hash password
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const hashedPassword = hash.toString('hex') + '.' + salt;

        // create and save user with email and hashed password

        // return the user
    }

    signin (email: string, password: string) {
        return this.usersService.findByEmail(email);
    }
}
