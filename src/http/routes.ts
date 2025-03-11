import { FastifyInstance } from 'fastify'

import { RegisterController } from './controllers/register'
import { adaptRoute } from '@/adapters/route-adapter'

export async function appRoutes(app: FastifyInstance) {
    // app.post('/users', adaptRoute(new RegisterController()))
    app.post('/users', new RegisterController().handle)

}
