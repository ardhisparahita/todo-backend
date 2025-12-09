import BaseRoute from "./BaseRouter";
import AuthController from "../controllers/AuthController";
import { validateAuth } from "./../middlewares/AuthValidator";
import CatchAsync from "../utils/CatchAsync";
import { th } from "zod/v4/locales";
import passport from "passport";

class AuthRoutes extends BaseRoute {
  public routes(): void {
    this.router.post(
      "/register",
      validateAuth,
      CatchAsync(AuthController.register)
    );
    this.router.post("/login", AuthController.login);
    this.router.get(
      "/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );
    this.router.get(
      "/google/callback",
      passport.authenticate("google", {
        successRedirect: "/api/auth/protected",
        failureFlash: "/google/failure",
      })
    );
  }
}

export default new AuthRoutes().router;
