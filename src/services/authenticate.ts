import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error'
import { UsersRepository } from '../repositories/users-repository'
import { compare, compareSync } from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticateRequest {
    email: string
    password: string
}

interface AuthenticateResponse {
    user: User
}

export class AuthenticateService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async execute({
        email,
        password,
    }: AuthenticateRequest): Promise<AuthenticateResponse> {
        const user = await this.usersRepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const passwordMatch = await compare(password, user.passwordHash)

        if (!passwordMatch) {
            throw new InvalidCredentialsError()
        }

        return {
            user
        }
    }
}
