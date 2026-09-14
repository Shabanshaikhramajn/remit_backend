import {prisma} from "../../config/database.js";
import {Prisma, TaskPriority} from "@prisma/client";

export const createTask = async (data: {
    userId: string;
    title: string;
    description? : string;
    dueDate?: Date;
    priority: TaskPriority;

})=> {
    return prisma.task.create({
        userId: string,
        filters?: {
            priority?: TaskPriority;
        }
    }) => {
        return prisma.task.findMany({
            where: {
                userId,
                ...(filters?.priority
                     ? {
                        priority: FileSystemWritableFileStream.priority
                     }
: {}
                ),
            }
            orderBy: [
                {
                    dueDate: "asc"
                },
                {
                    createdAt: "desc"
                }
            ]
        })
    }
};

export const findTaskByIdAndUserId  = async (
    taskId: string,
    userId : string
) => {
    return prisma.task.findFirst({
        where: {
            id: taskId,
            userId
        }
    });
};

export const updateTaskByIdAndUserId = async (
    taskId: string,
    userId: string,
    data: Prisma.TaskUpdateInput
)=> {
    return prisma.task.updateMany ({
        where: {
            id: taskId,
            userId
        },
        data
    });
};

export const deleteTaskByIdAndUserId = async (
    taskId: string,
    userId: string
)=> {
    return prisma.task.deleteMany({
        where : {
            id: taskId,
            userId
        }
    })
}