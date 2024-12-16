import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { rmSync } from 'fs';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {

    rmSync('test.sqlite', { force: true });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'a@b1.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      })
  });

//   if('signup as a new user then get the currently logged in user', () => {
//     const email = 'a@b1.com';
//     return request(app.getHttpServer())
//       .post('/auth/signup')
//       .send({ email, password: 'password' })
//       .expect(201)
//       .then((res) => {
//         const { id, email } = res.body;
//         expect(id).toBeDefined();
//         expect(email).toEqual(email);
//       })
//   });

  it('signs up as a new user then get the currently logged in user', async () => {
    const email = 'a@b1.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201)

      const cookie = res.get('Set-Cookie');

      const { body } = await request(app.getHttpServer())
        .get('/auth/whoami')
        .set('Cookie', cookie)
        .expect(200);

      expect(body.email).toEqual(email);  
  });


});
