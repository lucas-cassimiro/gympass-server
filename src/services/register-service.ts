import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

interface RegisterServiceRequest {
    firstName: string
    lastName: string
    email: string
    passwordHash: string
}

interface RegisterServiceResponse {
    id: string
    firstName: string
    lastName: string
    email: string
    passwordHash: string
    createdAt: Date
    updatedAt: Date
}

export class RegisterService {
    constructor(private readonly usersRepository: PrismaUsersRepository) {}

    async execute({ firstName, lastName, email, passwordHash }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        const user = this.usersRepository.create({ firstName, lastName, email, passwordHash })
        return user
    }
}
