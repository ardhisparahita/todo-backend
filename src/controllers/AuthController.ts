import { Request, Response } from "express";
const db = require("./../db/models");
import Authentication from "../utils/Authentication";
import { Op } from "sequelize";
import { RegisterUserSchema } from "./../middlewares/AuthValidator";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController {
  register = async (
    req: Request<{}, {}, RegisterUserSchema>,
    res: Response
  ) => {
    const { username, email, password } = req.body;
    const hashedPassword: string = await Authentication.passwordHash(password);

    const user = await db.User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const accessToken = Authentication.generateToken(user.id, user.username);

    return res.status(201).json({
      message: "Register Success",
      data: user,
      accessToken,
    });
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { usernameOrEmail, password } = req.body;

    const user = await db.User.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Username or Email not found",
      });
    }

    const compare = await Authentication.comparePassword(
      password,
      user.password
    );
    if (compare) {
      const token = Authentication.generateToken(user.id, user.username);
      return res.status(200).json({
        messages: "login success",
        token,
      });
    }
    return res.status(401).json({
      message: "wrong password",
    });
  };

  loginGoogle = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.redirect("http://localhost:5173/");
      }

      const user = req.user as any;

      const token = Authentication.generateToken(user.id, user.username);

      return res.redirect(`http://localhost:5173/login-success?token=${token}`);
    } catch (err) {
      console.error("login google error:", err);
      return res.redirect("http://localhost:5173/");
    }
  };

  loginGoogleFailure = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    return res.status(401).json({
      message: "login google failed",
    });
  };

  loginGoogleViaToken = async (req: Request, res: Response) => {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ message: "idToken is required" });
      }

      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(400).json({ message: "invalid token payload" });
      }

      const email = payload.email;
      const googleId = payload.sub;
      const displayName = payload.name;

      let user = await db.User.findOne({
        where: {
          [Op.or]: [{ googleId }, { email }],
        },
      });

      if (!user) {
        user = await db.User.create({
          username: displayName,
          email,
          googleId,
          provider: "google",
          password: null,
        });
      } else if (!user.googleId) {
        await db.User.update(
          {
            googleId,
            provider: "google",
          },
          {
            where: { id: user.id },
          }
        );
        user = await db.User.findByPk(user.id);
      }

      const token = Authentication.generateToken(user.id, user.username);

      return res.status(200).json({
        message: "login success",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Login via token error:", err);
      return res.status(401).json({
        message: "invalid google token or verification failed",
        error: err,
      });
    }
  };
}

export default new AuthController();
