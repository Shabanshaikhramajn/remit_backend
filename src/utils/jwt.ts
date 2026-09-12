import jwt, {JwtPayload} from "jsonwebtoken";
import {env} from "../config/env.js";

export interface TokenPayload extends JwtPayload {
  userId: string;
}

export const generateAccessToken = (
  userId: string
): string => {
  return jwt.sign(
    { userId },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    {userId},
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN
    }
  );
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  );

  if(typeof decoded === "string" || typeof decoded.userId !== "string") {
    throw new Error("Invalid access token");
  }

  return decoded as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  );

  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "string"
  ) {
    throw new Error("Invalid refresh token");
  }

  return decoded as TokenPayload;
};
