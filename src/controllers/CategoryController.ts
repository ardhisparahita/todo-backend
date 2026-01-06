import { Request, Response } from "express";
import IController from "./ControllerInterface";
const db = require("./../db/models");

class CategoryController implements IController {
  async index(req: Request, res: Response): Promise<Response> {
    console.log("test first log");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const categories = await db.Category.findAll({
      where: { userId },
      include: [
        {
          model: db.Task,
          as: "tasks",
          attributes: ["title", "description"],
        },
      ],
    });

    return res.status(200).json({
      message: "All categories",
      data: categories,
    });
  }

  async create(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name } = req.body;
    const userId = req.user.id;
    const categoryId = req.category;

    const category = await db.Category.create({ name, userId, categoryId });

    return res.status(201).json({
      message: "Create category success!",
      data: category,
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    const [updated] = await db.Category.update(
      { name },
      { where: { id, userId } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    const category = await db.Category.findOne({ where: { id, userId } });

    return res.status(200).json({
      message: "Category updated",
      data: category,
    });
  }

  async show(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const userId = req.user.id;

    const category = await db.Category.findOne({ where: { id, userId } });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Find one category",
      data: category,
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await db.Category.destroy({ where: { id, userId } });

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Delete category success",
    });
  }
}

export default new CategoryController();
