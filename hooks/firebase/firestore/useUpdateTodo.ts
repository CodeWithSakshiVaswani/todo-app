import { db } from "@/app/config/firebase";
import TodoStatuses from "@/enums/todostatuses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";

type UpdateTodoParams = {
  id: string;
  newStatus: TodoStatuses;
};

const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async ({ id, newStatus }: UpdateTodoParams) =>
      await updateDoc(doc(db, "todos", id), {
        status: newStatus,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
};

export default useUpdateTodo;
