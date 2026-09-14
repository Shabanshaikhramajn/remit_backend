import type {Prisma, TaskPriority} from "@prisma/client";

import {
    createTask,
    deleteTaskByIdAndUserId,
    findTaskByIdAndUserId,
    findTaskByUserId,
    updateTaskByIdAndUserId
} from "./task_repository.js";

export class TaskError extends Errro {
    constructor(
        public readonly code:
        | "TASK_NOT_FOUND"
        | "INVALID_DUE_DATE"
    ){
        super(code);
    }
}

const normalizeTitle = (title: string) : string => {
    return title.trim();
};


const normalizeDescription = (
  description: string | undefined
): string | undefined => {
  const normalizedDescription = description?.trim();

  return normalizedDescription || undefined;
};


const parseDueDate = (
    dueDate: string | undefined
): Date | undefined => {
    if(!dueDate){
        return undefined;
    }
    const parsedDate = new Date(dueDate);

    if(Number.isNaN(parsedDate.getTime())){
        throw new TaskError("INVALID_DUE_DATE")
    }
    return parsedDate;
};

export const createUserTask = async (input: {
    userId: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority: TaskPriority;
})=> {
    const title = normalizeTitle(input.title);
     
    if(!title){
        throw new Error("TITLE_REQUIRED")
    }

    return createTask({
        userId : input.userId,
        title,
        description: normalizeDescription(input.description),
        dueDate: parseDueDate(input.dueDate),
        priority: input.priority
    });
};

