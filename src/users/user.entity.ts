import { Exclude } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()   
    email: string;  

    @Exclude()
    @Column()   
    password: string;  

    @AfterInsert()
    logInsert() {
        console.log(`Inserted user with id ${this.id}`);
    }
}   