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

export const createUser = async (
    

)