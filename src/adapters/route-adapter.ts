import { FastifyRequest, FastifyReply } from 'fastify'

import { Controller, Request, Response } from '../http/protocols'

export const adaptRoute = (controller: Controller) => {
    return async (req: FastifyRequest, res: FastifyReply) => {
        const request: Request = {
            body: req.body,
        }

        const response: Response = await controller.handle(request)

        const successStatusCode = [200, 201, 202, 204, 205, 206]

        if (successStatusCode.includes(response.statusCode)) {
            return res.status(response.statusCode).send(response.body)
        }

        return res.status(response.statusCode).send({ error: response.body.message })
    }
}
