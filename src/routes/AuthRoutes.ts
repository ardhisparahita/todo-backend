import BaseRoute from "./BaseRouter";
import AuthController from "../controllers/AuthController";
import { validateAuth } from "./../middlewares/AuthValidator";
import CatchAsync from "../utils/CatchAsync";
import passport from "passport";
import { th } from "zod/v4/locales";

class AuthRoutes extends BaseRoute {
  public routes(): void {
    this.router.post(
      "/register",
      validateAuth,
      CatchAsync(AuthController.register)
    );
    this.router.post("/login", AuthController.login);

    // Login google
    this.router.get(
      "/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );
    this.router.get(
      "/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/google/failure",
        session: false,
      }),
      CatchAsync(AuthController.loginGoogle)
    );
    this.router.get("/google/failure", AuthController.loginGoogleFailure);
  }
}

export default new AuthRoutes().router;
