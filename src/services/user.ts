import { prismaClient } from "../lib/db";
import JWT from "jsonwebtoken";
import { createHmac, randomBytes } from "node:crypto";

const JWT_SECRET = "$uperM@n123";

export interface createUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    return hashedPassword;
  }

  public static createUser(payload: createUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString();
    const hashedPassword = UserService.generateHash(salt, password);

    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        salt,
      },
    });
  }

  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({
      where: { email },
    });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await UserService.getUserByEmail(email);

    if (!user) throw new Error("user not found");

    const userSalt = user.salt;
    const userHashPassword = UserService.generateHash(userSalt, password);

    if (userHashPassword != user.password)
      throw new Error("Incorrect Password");

    // Gen token
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }
}

export default UserService;
