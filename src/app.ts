import fastify from 'fastify'

import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _request, response) => {
    if (error instanceof ZodError) {
        return response.status(400).send({ message: error.errors })
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    } else {
        // TODO: Here we should log to an external tool like Datadog/New Relic/Sentry
    }

    return response.status(500).send({ message: 'Internal server error. ' })
})
