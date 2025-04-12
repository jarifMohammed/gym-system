import User from "./auth.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface UserData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (userData: UserData) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await User.create({
    fullName: userData.fullName,
    email: userData.email,
    password: hashedPassword,
    role: userData.role,
    age: userData.age,
    gender: userData.gender,
    phone: userData.phone,
    address: userData.address,
  });
  return user;
};

export const loginUser = async ({ email, password }: LoginData) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.token || "",
    {
      expiresIn: "365d",
    }
  );
  return { token, user };
};

export default {
  registerUser,
  loginUser,
};
