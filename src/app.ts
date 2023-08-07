import fastify from 'fastify'
import { ZodError } from 'zod'
import { appRoutes } from './http/routes'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, request, replay) => {
  if (error instanceof ZodError) {
    return replay.status(400).send({
      message: 'validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: here-me-should-log-to-an-external-tool-like-dataDog/NewRelic/Sentry
  }

  return replay.status(500).send({ message: 'Internal server error.' })
})
