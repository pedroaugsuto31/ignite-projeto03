import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Java Gym',
      description: null,
      phone: null,
      latitude: -3.747990,
      longitude: -38.518870
    })

    await gymsRepository.create({
      title: 'Other Gym',
      description: null,
      phone: null,
      latitude: -3.747990,
      longitude: -38.518870
    })

    const { gyms } = await sut.execute({
      query: 'Java',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Java Gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Java Gym ${i}`,
        description: null,
        phone: null,
        latitude: -3.747990,
        longitude: -38.518870
      })
    }

    const { gyms } = await sut.execute({
      query: 'Java',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Java Gym 21' }),
      expect.objectContaining({ title: 'Java Gym 22' }),
    ])
  })
})
