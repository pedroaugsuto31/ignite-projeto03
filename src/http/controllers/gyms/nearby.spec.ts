import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/teste/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'C# Gym',
        description: 'Some description.',
        phone: '8596661437',
        latitude: -3.747990,
        longitude: -38.518870
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Java Gym',
        description: 'Some description.',
        phone: '8596661437',
        latitude: -4.5622588,
        longitude: -37.7738048
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -3.747990,
        longitude: -38.518870
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'C# Gym',
      }),
    ])
  })
})
