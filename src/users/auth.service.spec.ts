import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { sign } from "crypto";


describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;
    const users: User[] = [];

    beforeEach( async() => {
        fakeUsersService = {
            findByEmail: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {
                    id: users.length + 1,
                    email,  
                    password,
                } as User;
                users.push(user);
                return Promise.resolve(user);
            },
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
            ],
        }).compile();

        service = module.get(AuthService);
    })

    it('can create an instance of auth service', async () => {   
        expect(service).toBeDefined();
    });

    it('creates a new user with salted and hashed password', async () => {
        const user = await service.signup('test@gmail.com', 'test');
        expect(user.password).not.toEqual('test');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.findByEmail = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await expect(service.signup('asdf@asdf.com', '12345')).rejects.toThrow(
          BadRequestException,
        );
    });    

    it('throws if signin is called with an unused email', async () => {
        await expect(service.signin('asdflkj@asdlfkj.com', 'passdflkj')).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
        fakeUsersService.findByEmail = () => Promise.resolve([{ email: 'asdf@asdf.com', password: 'laskdjf' } as User]);
        await expect(service.signin('laskdjf@alskdfj.com', 'passowrd')).rejects.toThrow(BadRequestException);
    });

    it('returns user if correct password is provided', async () => {
        await service.signup('asdf@asdf.com', '12345');

        const user = await service.signin('asdf@asdf.com', '12345');
        expect(user).toBeDefined();
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(
            service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException);
    });
    
    it('throws if an invalid password is provided', async () => {
        await service.signup('laskdjf@alskdfj.com', 'password');
        await expect(
            service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
        ).rejects.toThrow(BadRequestException);
    });



});

