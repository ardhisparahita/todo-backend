import { Request, Response } from "express";
const db = require("./../db/models");
import Authentication from "../utils/Authentication";
import { Op, where } from "sequelize";
import { RegisterUserSchema } from "./../middlewares/AuthValidator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticate } from "passport";
import { password } from "bun";

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
      accessToken, // kirim token ke frontend
    });
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { usernameOrEmail, password } = req.body;

    // Gunakan satu query dengan kondisi OR untuk mencari berdasarkan username atau email
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
      // Perbaiki: gunakan user.username bukan user.name (karena field di database adalah username)
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

      // ✅ LANGSUNG REDIRECT KE HOME
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
}

export default new AuthController();
