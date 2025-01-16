import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/teste/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Check-In (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -3.747990,
        longitude: -38.518870
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-in`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -3.747990,
        longitude: -38.518870
      })

    expect(response.statusCode).toEqual(200)
  })
})
