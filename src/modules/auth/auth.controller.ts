import { Request, Response } from "express";
import authService from "./auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, user } = await authService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: { user, token },
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
