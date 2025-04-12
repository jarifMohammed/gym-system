"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const auth_model_1 = __importDefault(require("./auth.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield auth_model_1.default.findOne({ email: userData.email });
    if (existing)
        throw new Error("User already exists");
    const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
    const user = yield auth_model_1.default.create({
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
});
exports.registerUser = registerUser;
const loginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    const user = yield auth_model_1.default.findOne({ email });
    if (!user)
        throw new Error("Invalid credentials");
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match)
        throw new Error("Invalid credentials");
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.token || "", {
        expiresIn: "365d",
    });
    return { token, user };
});
exports.loginUser = loginUser;
exports.default = {
    registerUser: exports.registerUser,
    loginUser: exports.loginUser,
};
