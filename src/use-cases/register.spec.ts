import { compare } from 'bcryptjs'
import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('Should be possible to register a user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('Should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    })
    const isPasswordCorrectlyHashed = await compare(
      '123123',
      user.password_hash
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should not de able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123123',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123123',
      })
    ).rejects.toBeInstanceOf(Error)
  })
})
