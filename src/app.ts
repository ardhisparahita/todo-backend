import express, {
  NextFunction,
  Request,
  Response,
  type Application,
} from "express";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes";
import CategoryRoutes from "./routes/CategoryRoutes";
import TaskRoutes from "./routes/TaskRoutes";
import { ZodError } from "zod";
import passport from "passport";
import "./config/passport";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.plugins();
    this.routes();
    this.errorHandler();
  }

  protected plugins(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(passport.initialize());
  }

  protected routes(): void {
    this.app.use("/api/auth", AuthRoutes);
    this.app.use("/api/categories", CategoryRoutes);
    this.app.use("/api/categories", TaskRoutes);
  }

  private errorHandler() {
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error(err);

        if (err instanceof ZodError) {
          const formattedErrors = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          }));
          return res.status(422).json({ errors: formattedErrors });
        }

        res.status(err.status || 500).json({
          message: err.message || "Internal server error",
        });
      }
    );
  }
}

const app = new App().app;

export default app;
