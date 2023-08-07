import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { MakeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

export async function authenticate(request: FastifyRequest, replay: FastifyReply) {
  const authenticateSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateSchema.parse(request.body)

  try {
    const authenticateUseCase = MakeAuthenticateUseCase()
    await authenticateUseCase.execute({
      email,
      password,
    })
    return replay.status(200).send()
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return replay.status(400).send({ message: error.message })
    }
    throw error
  }
}
