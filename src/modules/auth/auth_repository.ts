import {prisma} from "../../config/database.js";

export const findUserByEmail = async (
    email: string
)=> {
    return prisma.user.findUnique({
        where: {
            email
        }
    });
};

export const findUserById = async (
    id: string

)=> {
    return prisma.user.findUnique({
        where : {
            id
        }
    });
};

export const createUser = async (data: {
  email: string;
  password: string;
  name?: string;
}) => {
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};