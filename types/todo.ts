import TodoStatuses from "@/enums/todostatuses";
import { Timestamp } from "firebase/firestore";

type BaseTodoData = {
  userId: string | undefined;
  text: string;
  status: TodoStatuses;
};

export type FirebaseTodoDoc = BaseTodoData & {
  createdAt: Timestamp;
};

export type Todo = BaseTodoData & {
  createdAt: Date;
  autoScrollToBottom?: true;
};

export type CreateTodoData = {
  userId: string | undefined;
  text: string;
  status: TodoStatuses;
};
