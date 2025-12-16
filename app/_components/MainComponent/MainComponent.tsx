"use client";

import TodoStatuses from "@/enums/todostatuses";
import TodosStack from "./TodoStack";
import useTodos from "@/hooks/firebase/firestore/useTodos";
import { useMemo } from "react";

const MainComponent = () => {
  const { todos } = useTodos();
  const { data: todosData = [] } = todos;

  const categorizedData = useMemo(() => {
    const todosTodo = [];
    const todosInpending = [];
    const todosDone = [];

    for (const todo of todosData) {
      if (todo.status === TodoStatuses.TODO) todosTodo.push(todo);
      else if (todo.status === TodoStatuses.IN_PENDING)
        todosInpending.push(todo);
      else if (todo.status === TodoStatuses.DONE) todosDone.push(todo);
    }

    return {
      [TodoStatuses.TODO]: todosTodo,
      [TodoStatuses.IN_PENDING]: todosInpending,
      [TodoStatuses.DONE]: todosDone,
    };
  }, [todosData]);

  return (
    <div className="xs:max-md:py-6 xs:max-md:px-7 pt-12 pb-6 px-14 flex-1 flex flex-col overflow-hidden">
      <h1 className="font-bold text-4xl xs:max-md:text-3xl mb-12 xs:max-md:mb-10">
        Organize your day with clarity and focus 😊
      </h1>
      <div className="flex justify-between  gap-10 flex-1 p-6 border rounded-xl overflow-x-auto shrink-0 scrollbar-thin scrollbar-thumb-gray-300">
        {[TodoStatuses.TODO, TodoStatuses.IN_PENDING, TodoStatuses.DONE].map(
          (status) => (
            <TodosStack
              key={status}
              status={status}
              filteredTodosData={categorizedData[status]}
            />
          )
        )}
      </div>
    </div>
  );
};

export default MainComponent;
