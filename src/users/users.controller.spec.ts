import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeAuthService = {
      // signup: (email: string, password: string) => {
      //   return Promise.resolve({ id: 1, email, password } as User);
      // },

      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      }
    }

    fakeUsersService = {
      findByEmail: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },

      findAll: () => {
        return Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
      },

      findUser: (id: number) => {
        return Promise.resolve({ id, email: 'a', password: '1' } as User);
      },

      remove: (id: number) => {
        return Promise.resolve({ id, email: 'a', password: '1' } as User);
      },

      update: (id: number, attrs: Partial<User>) => {
        return Promise.resolve({ id, email: 'a', password: '1' } as User);
      }

    } 

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await controller.getUserByEmail('a');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('a');
  });

  it('findUser returns a single user with given id', async () => {
    const user = await controller.getUser(1);
    expect(user).toBeDefined();
  });

  it('UpdateUser updates a user with provided attributes', async () => {
    const user = await controller.updateUser({ email: 'a' } as User, 1);
    expect(user.email).toEqual('a');
  });

  it('RemoveUser removes a user with given id', async () => {
    const user = await controller.removeUser(1);
    expect(user.id).toEqual(1);
  });

  it('Signup creates a new user with salted and hashed password', async () => {
    const session = { userId: null };
    const user = await controller.userLogin({ email: 'a', password: '1' } as User, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });



});
