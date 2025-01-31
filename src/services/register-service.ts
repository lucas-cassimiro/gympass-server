import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'
import { User } from '@prisma/client'
import bcrypt from 'bcryptjs'

interface RegisterServiceRequest {
    firstName: string
    lastName: string
    email: string
    password: string
}

interface RegisterServiceResponse {
    user: User
}

export class RegisterService {
    constructor(private readonly usersRepository: PrismaUsersRepository) {}

    async execute({
        firstName,
        lastName,
        email,
        password,
    }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await this.usersRepository.create({
            firstName,
            lastName,
            email,
            passwordHash,
        })

        return { 
            user
        }
    }
}
