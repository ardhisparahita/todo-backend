import BaseRoute from "./BaseRouter";
import TaskController from "../controllers/TaskController";
import { Auth } from "../middlewares/AuthMiddleware";
import CatchAsync from "../utils/CatchAsync";
import { categoryParams } from "../middlewares/CategoryParams";
import { ValidateCreateTask } from "../middlewares/TaskValidator";
import { ValidateUpdateStatus } from "../middlewares/TaskUpdateStatusValidator";

class TodoRoutes extends BaseRoute {
  public routes(): void {
    this.router.param("categoryId", categoryParams);

    // TASK ROUTES
    this.router.get(
      "/:categoryId/tasks",
      Auth,
      CatchAsync(TaskController.index)
    );

    this.router.post(
      "/:categoryId/tasks",
      Auth,
      ValidateCreateTask,
      CatchAsync(TaskController.create)
    );

    this.router.get(
      "/:categoryId/tasks/:id",
      Auth,
      CatchAsync(TaskController.show)
    );

    this.router.patch(
      "/:categoryId/tasks/:id",
      Auth,
      ValidateCreateTask,
      CatchAsync(TaskController.update)
    );

    this.router.patch(
      "/:categoryId/tasks/:id/status",
      Auth,
      ValidateUpdateStatus,
      CatchAsync(TaskController.updateStatus)
    );

    this.router.delete(
      "/:categoryId/tasks/:id",
      Auth,
      CatchAsync(TaskController.delete)
    );
  }
}

export default new TodoRoutes().router;
