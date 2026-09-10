import { Prisma } from "@prisma/client";
import {
  createUser,
  findUserByEmail,
} from "./auth_repository.js";
import {
  comparePassword,
  hashPassword,
} from "../../utils/password.js";
import { generateAccessToken } from "../../utils/jwt.js";

export class AuthError extends Error {
    constructor(
        public readonly code: "EMAIL_IN_USE" | "INVALID_CREDENTIALS",
    ) {
        super(code);
    }
}

export const register = async (input: {
    email: string;
    password : string;
    name?: string;
})=> {
    const email = input.email.trim().toLowerCase();

    const existingUser = await findUserByEmail(email);

    if(existingUser){
        throw new AuthError("EMAIL_IN_USE");
    }
   const password = await hashPassword(input.password);

   try {
    const user = await createUser({
        email,
        password,
        name: input.name?.trim() || undefined,
    });
    return {
        user,
        accessToken: generateAccessToken(user.id)
    }
   }catch (error){
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"){
        throw new AuthError("EMAIL_IN_USE");
    }
    throw error;
   }

};

export const login = async (input: {
    email: string;
    password: string;

})=> {
 const email = input.email.trim().toLowerCase();
 const user = await findUserByEmail(email);

    if(!user || !(await comparePassword(input.password, user.password))){
    throw new AuthError("INVALID_CREDENTIALS");
  }

  return {
    user: {
        id: user.id,
        email: user.email,
        name : user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    },
    accessToken: generateAccessToken(user.id)
  }





}

