import { Controller, Request, Response } from '../protocols/'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const registerBodySchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    passwordHash: z.string().min(6),
})

export class RegisterController implements Controller {
    async handle(request: Request): Promise<Response> {
        const { firstName, lastName, email, passwordHash } = registerBodySchema.parse(request.body)

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash,
            },
        })

        return {
            statusCode: 201,
            body: user
        }
    }
}
