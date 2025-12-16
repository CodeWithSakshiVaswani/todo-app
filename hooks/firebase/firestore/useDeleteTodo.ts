import { db } from "@/app/config/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc } from "firebase/firestore";

const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: async (id: string) => await deleteDoc(doc(db, "todos", id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

export default useDeleteTodo;
