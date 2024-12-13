import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
    }

    findAll() {
        return this.repo.find();
    }

    async findUser(id: number) {
        if (!id) {
            return null;
        }
        const user = await this.repo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    findByEmail(email: string) {
        return this.repo.findBy({ email: email });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.repo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        const existingUser = await this.findByEmail(attrs.email);
        if (existingUser.length) {
            throw new BadRequestException('email in use');
        }

        Object.assign(user, attrs);
        return this.repo.save(user); 
    }

    async remove(id: number) {
        const user = await this.repo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return this.repo.remove(user);
    }
}
