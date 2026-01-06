import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const taskSchema = z.object({
  title: z
    .string({ message: "title harus string!" })
    .nonempty({ message: "title tidak boleh kosong" })
    .min(2, { message: "title minimal 2 huruf" }),
  description: z
    .string({ message: "description harus string!" })
    .nonempty({ message: "description tidak boleh kosong" })
    .min(2, { message: "description minimal 2 huruf" }),
  status: z.enum(["pending", "completed"]).optional(),
});

export type TaskSchema = z.infer<typeof taskSchema>;

const ValidateCreateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await taskSchema.parseAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};

export { ValidateCreateTask };
