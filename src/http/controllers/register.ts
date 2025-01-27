import { Controller, Request, Response } from '../protocols/'

import { z } from 'zod'
import { RegisterService } from '@/services/register-service'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists'

const registerBodySchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    passwordHash: z.string().min(6),
})

export class RegisterController implements Controller {
    // constructor(private readonly registerService: RegisterService) {}

    async handle(request: Request): Promise<Response> {
        const { firstName, lastName, email, passwordHash } =
            registerBodySchema.parse(request.body)

        try {
            const usersRepository = new PrismaUsersRepository()
            const registerService = new RegisterService(usersRepository)

            const user = await registerService.execute({
                firstName,
                lastName,
                email,
                passwordHash,
            })

            return {
                statusCode: 201,
                body: user,
            }
        } catch (err) {
            if (err instanceof UserAlreadyExistsError) {
                return {
                    statusCode: 409,
                    body: err,
                }
            }

            throw err
        }
    }
}
