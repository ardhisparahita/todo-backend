import { Request, Response, NextFunction } from "express";
import { z } from 'zod'

const categorySchema = z.object({
  name: z
  .string({message: "nama category harus string!"})
  .nonempty({message: "nama category tidak boleh kosong"})
  .min(2, {message: "nama category minimal 1 huruf"})
})

export type CategorySchema = z.infer<typeof categorySchema>

const ValidateCreateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await categorySchema.parseAsync(req.body)
    next()
  } catch (err) {
    next(err)
  }
}

export { ValidateCreateCategory }