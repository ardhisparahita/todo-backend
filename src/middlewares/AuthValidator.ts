import { Request, Response, NextFunction } from 'express';
import { z } from 'zod'
const db = require("./../db/models")

const registerUserSchema = z.object({
  username: z
  .string({message: "Username harus string!"})
  .nonempty({ message: "Username harus diisi!" })
  .min(3, {message: "username minimal 3 karakter!"})
  .refine(
    async (username) => {
      if (!username) return true; 
      const existingUsername = await db.User.findOne({
        where: {username}
      })
      return !existingUsername
    }, {message: "username sudah tersedia!"}
  ),
  email: z
  .email({ message: "Email tidak valid!" })
  .refine(
    async (email) => {
      if (!email) return true
      const existingEmail = await db.User.findOne({
        where: {email}
      })
      return !existingEmail
    }, {message: "Email sudah tersedia!"}
  ),
  password: z
  .string()
  .min(8, { message: "Password minimal 8 karakter" }),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>

const validateAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await registerUserSchema.parseAsync(req.body)
    next()
  } catch (err) {
    next(err)
  }

}

export {registerUserSchema, validateAuth}