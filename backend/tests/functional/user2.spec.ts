import { test } from '@japa/runner'
import supertest from 'supertest'
import db from '@adonisjs/lucid/services/db'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User Authentication', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('should login with valid credentials', async ({ assert }) => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      phone: '123456789',
      email: `user${Math.floor(Math.random() * 10000)}@example.com`,
      password: 'password',
    }

    const registerResponse = await supertest(BASE_URL)
      .post('/auth/register')
      .send(userData)
      .expect(201)

    console.log('Register response:', registerResponse.body)

    const loginResponse = await supertest(BASE_URL)
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password })
      .expect(200)

    console.log('Login response:', loginResponse.body)
    assert.exists(loginResponse.body.token)
  })
})
