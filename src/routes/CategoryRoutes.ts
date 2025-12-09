import BaseRoute from "./BaseRouter";
import CategoryController from "../controllers/CategoryController";
import CatchAsync from "../utils/CatchAsync";
import { Auth } from "../middlewares/AuthMiddleware";
import { ValidateCreateCategory } from "../middlewares/CategoryValidator";

class CategoryRoutes extends BaseRoute {
  public routes(): void {
    this.router.get("/", Auth ,CatchAsync(CategoryController.index))
    this.router.post("/", Auth , ValidateCreateCategory, CatchAsync(CategoryController.create))
    this.router.get("/:id", Auth, CatchAsync(CategoryController.show))
    this.router.patch("/:id", Auth, ValidateCreateCategory, CatchAsync(CategoryController.update))
    this.router.delete("/:id", Auth, CatchAsync(CategoryController.delete))
  }
}

export default new CategoryRoutes().router;