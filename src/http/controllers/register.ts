import { Controller, Request, Response } from '../protocols/'

import { z } from 'zod'
import { RegisterService } from '@/services/register-service'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists'
import { FastifyReply, FastifyRequest } from 'fastify'

const registerBodySchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
})

export class RegisterController {
    // constructor(private readonly registerService: RegisterService) {}

    async handle(request: FastifyRequest, response: FastifyReply) {
        const { firstName, lastName, email, password } =
            registerBodySchema.parse(request.body)

        try {
            const usersRepository = new PrismaUsersRepository()
            const registerService = new RegisterService(usersRepository)

            const user = await registerService.execute({
                firstName,
                lastName,
                email,
                password,
            })

            return {
                statusCode: 201,
                body: user,
            }
        } catch (err) {
            if (err instanceof UserAlreadyExistsError) {
                // throw new UserAlreadyExistsError()
                response.status(409).send({ message: 'E-mail already exists.'})
            }

            throw err
        }
    }
}
