import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { MakeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-Error'

export async function register(request: FastifyRequest, replay: FastifyReply) {
  const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerSchema.parse(request.body)

  try {
    const registerUseCase = MakeRegisterUseCase()
    await registerUseCase.execute({ name, email, password })
    return replay.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return replay.status(409).send({ message: error.message })
    }
    throw error
  }
}
