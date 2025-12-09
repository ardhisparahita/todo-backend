import { Request, Response, NextFunction } from "express";
const db = require("./../db/models");

export interface Category {
  id: number;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      category?: Category;
    }
  }
}

export const categoryParams = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  console.log("categoryParams id:", id);
  const category = await db.Category.findByPk(Number(id));
  if (!category) return res.status(404).json({ message: "Category not found" });

  req.category = category;
  next();
};
