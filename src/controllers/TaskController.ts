import { Request, Response } from "express";
import IController from "./ControllerInterface";
const db = require("./../db/models");

class TaskController implements IController {
  async index(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const categoryId = req.category!.id;

    const tasks = await db.Task.findAll({
      where: { categoryId },
      include: [
        {
          model: db.Category,
          as: "category",
          attributes: ["id", "name"], // << ambil id + nama category
        },
      ],
      attributes: ["id", "title", "description", "status", "categoryId"],
    });

    return res.status(200).json({
      message: "All Tasks",
      data: tasks,
    });
  }

  async create(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description } = req.body;
    const categoryId = req.category!.id;

    // Pastikan category ada
    const category = await db.Category.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(400).json({ message: "Category does not exist." });
    }

    // Create task
    const task = await db.Task.create({
      name: req.category?.name,
      title,
      description,
      categoryId: categoryId,
      status: "pending",
      userId: req.user.id,
    });

    // Reload task dengan include category
    await task.reload({
      include: [
        {
          model: db.Category,
          as: "category", // alias harus sama dengan model Task
          attributes: ["id", "name"],
        },
      ],
    });

    return res.status(201).json({
      message: "Create task success!",
      data: task,
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { title, description, categoryId, dueDate, status } = req.body;

    const [updated] = await db.Task.update(
      { title, description, categoryId, dueDate, status },
      { where: { id, userId: req.user.id } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = await db.Task.findOne({
      where: { id, userId: req.user.id },
      include: [{ model: db.Category, as: "category" }],
    });

    return res.status(200).json({
      message: "Task updated",
      data: task,
    });
  }

  async updateStatus(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { categoryId, id } = req.params;
    const { status } = req.body;

    // Validasi input status
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Cari task berdasarkan user, category, dan id
    const task = await db.Task.findOne({
      where: {
        id,
        categoryId,
        userId: req.user.id,
      },
      include: [
        {
          model: db.Category,
          as: "category",
          attributes: ["id", "name"], // ambil nama category
        },
      ],
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update status
    task.status = status;
    await task.save();

    return res.status(200).json({
      message: "Task status updated successfully",
      data: task,
    });
  }

  async show(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await db.Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        {
          model: db.Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Find one task",
      data: task,
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deleted = await db.Task.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Delete task success",
    });
  }
}

export default new TaskController();
