import { db } from "@/app/config/firebase";
import { CreateTodoData, Todo } from "@/types/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const useAddTodo = () => {
  const queryClient = useQueryClient();
  const addTodo = useMutation({
    mutationKey: ["addTodo"],
    mutationFn: async (newTodo: CreateTodoData) =>
      await addDoc(collection(db, "todos"), {
        userId: newTodo.userId,
        text: newTodo.text,
        status: newTodo.status,
        createdAt: serverTimestamp(),
      }),
    onSuccess: (data, newTodo) => {
      queryClient.setQueryData<Todo[]>(["todos"], (oldData) => {
        return [
          ...(oldData || []),
          {
            id: data.id,
            ...newTodo,
            createdAt: new Date(),
            autoScrollToBottom: true,
          },
        ];
      });
    },
  });

  return { addTodo };
};

export default useAddTodo;
