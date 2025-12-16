import { useUserContext } from "@/app/_components/context/UserContext";
import { db } from "@/app/config/firebase";
import { FirebaseTodoDoc } from "@/types/todo";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";

const useTodos = () => {
  const { user } = useUserContext();
  const uid = user?.uid;
  const todos = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const q = query(collection(db, "todos"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const todosData = querySnapshot.docs.map((doc) => {
        const data = doc.data() as FirebaseTodoDoc;
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
        };
      });
      return todosData;
    },
  });
  return { todos };
};

export default useTodos;
