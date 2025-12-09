import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["pending", "completed"])
});

export const ValidateUpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await statusSchema.parseAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
