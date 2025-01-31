import { User, Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
    public users: User[] = []

    async findById(id: string): Promise<User | null> {
        const user = this.users.find((user) => user.id === id)

        if (!user) {
            return null
        }

        return user
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find((user) => user.email === email)

        if (!user) {
            return null
        }

        return user
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const user = {
            id: 'user-1',
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            passwordHash: data.passwordHash,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        this.users.push(user)

        return user
    }
}
