import { expect, describe, it } from 'vitest'
import { compare } from 'bcryptjs'

import { RegisterService } from './register-service'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

describe('Register Service', () => {
    it('should be able to register', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerService = new RegisterService(usersRepository)

        const { user } = await registerService.execute({
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerService = new RegisterService(usersRepository)

        const { user } = await registerService.execute({
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.passwordHash
        )

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerService = new RegisterService(usersRepository)

        const email = 'johndoe@example.com'

        await registerService.execute({
            firstName: 'John',
            lastName: 'Doe',
            email,
            password: '123456',
        })

        await expect(() =>
            registerService.execute({
                firstName: 'John',
                lastName: 'Doe',
                email,
                password: '123456',
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})
