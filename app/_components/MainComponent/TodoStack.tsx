import {
  Calendar1,
  Circle,
  Ellipsis,
  PenLine,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import TodoStatuses from "@/enums/todostatuses";
import useAddTodo from "@/hooks/firebase/firestore/useAddTodo";
import useDeleteTodo from "@/hooks/firebase/firestore/useDeleteTodo";
import { Button } from "@/components/ui/button";
import useUpdateTodo from "@/hooks/firebase/firestore/useUpdateTodo";
import { useUserContext } from "../context/UserContext";
import { Todo as TodoType } from "@/types/todo";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type FetchedTodoItem = TodoType & {
  id: string;
};

type TodoStackProps = {
  status: TodoStatuses;
  filteredTodosData: FetchedTodoItem[];
};

type TodoProps = FetchedTodoItem & {
  stackScrollerRef: React.RefObject<HTMLDivElement | null>;
};

const Todo = ({ stackScrollerRef, ...todo }: TodoProps) => {
  const queryClient = useQueryClient();
  const queryClientRef = useRef(queryClient);
  const { mutateAsync: deleteTodo } = useDeleteTodo();
  const { mutateAsync: updateTodo } = useUpdateTodo();

  const handleDeleteTodo = async (id: string) => await deleteTodo(id);

  const handleUpdateTodo = async (id: string, status: TodoStatuses) => {
    let nextStatus: TodoStatuses;

    if (status === TodoStatuses.TODO) {
      nextStatus = TodoStatuses.IN_PENDING;
    } else if (status === TodoStatuses.IN_PENDING) {
      nextStatus = TodoStatuses.DONE;
    } else {
      nextStatus = TodoStatuses.DONE;
    }

    await updateTodo({
      id: id,
      newStatus: nextStatus,
    });
  };

  useEffect(() => {
    if (todo.autoScrollToBottom) {
      const stackScrollerElement = stackScrollerRef.current;
      if (stackScrollerElement) {
        stackScrollerElement.scroll({
          top:
            stackScrollerElement.scrollHeight -
            stackScrollerElement.clientHeight,
          behavior: "smooth",
        });
      }
      queryClientRef.current.setQueryData<FetchedTodoItem[]>(
        ["todos"],
        (oldData) =>
          oldData?.map((oldTodo) =>
            oldTodo.id === todo.id
              ? {
                  ...oldTodo,
                  autoScrollToBottom: undefined,
                }
              : oldTodo
          )
      );
    }
  }, [todo.id, todo.autoScrollToBottom, stackScrollerRef]);

  return (
    <Card key={todo.id} className="gap-0">
      <CardHeader>
        <CardTitle className="font-medium text-lg flex gap-3 items-center flex-1 overflow-hidden">
          <Circle
            className={cn(
              "shrink-0",
              todo.status === "todo"
                ? "fill-amber-200"
                : todo.status === "in_pending"
                ? "fill-red-600"
                : "fill-green-500"
            )}
            onClick={() => handleUpdateTodo(todo.id, todo.status)}
          />
          <div className="text-ellipsis overflow-hidden">{todo.text}</div>
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            <Trash2 size={20} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardFooter className="text-gray-500 font-normal text-sm ml-8">
        <Calendar1 className="mr-1.5 text-gray-500" size={15} />
        {new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "short",
        }).format(todo.createdAt)}
      </CardFooter>
    </Card>
  );
};

const TodosStack = ({ status, filteredTodosData }: TodoStackProps) => {
  const stackScrollerRef = useRef<HTMLDivElement>(null);
  const {
    addTodo: { mutateAsync: add },
  } = useAddTodo();
  const [text, setText] = useState<string>("");
  const [showInputCard, setShowInputCard] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { user } = useUserContext();

  const handleAddTodo = async () => {
    if (!text.trim()) return;
    const uid = user?.uid;
    const newTodoData = {
      userId: uid,
      text: text.trim(),
      status: status,
    };
    await add(newTodoData);
    setText("");
    setShowInputCard(false);
  };

  const handleToggleInput = () => setShowInputCard(true);

  const handleOpenStatus = () => setIsOpen((prev) => !prev);

  return (
    <div className="max-w-md w-full flex flex-col min-w-75">
      <div className="flex justify-between items-center">
        <h5 className="font-semibold text-2xl mb-3.5">
          {status === "todo"
            ? "To Do"
            : status === "in_pending"
            ? "In Pending"
            : "Done"}
        </h5>
        <Ellipsis onClick={handleOpenStatus} />
      </div>
      {isOpen ? (
        <>
          <div
            ref={stackScrollerRef}
            className="flex flex-col gap-3.5 pr-3.5 scrollbar-thin scrollbar-thumb-gray-300 overflow-y-auto"
          >
            {filteredTodosData.map((todo) => (
              <Todo
                key={todo.id}
                stackScrollerRef={stackScrollerRef}
                {...todo}
              />
            ))}
          </div>
          {showInputCard ? (
            <Card className="mt-3.5 mr-3.5">
              <CardHeader>
                <CardTitle className="flex-1">
                  <input
                    type="text"
                    value={text}
                    placeholder="Add task"
                    onChange={(e) => setText(e.target.value)}
                    className="placeholder: outline-0 text-md p-1.5 flex-1 w-full"
                  />
                </CardTitle>
                <CardAction className="flex items-center">
                  <button className="cursor-pointer" onClick={handleAddTodo}>
                    <Plus />
                  </button>
                  <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => setShowInputCard(false)}
                  >
                    <Trash2 size={20} />
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
          ) : (
            <div className="flex items-center p-3 border-t gap-3 mt-4.5">
              <button onClick={handleToggleInput}>
                <PenLine />
              </button>
              <input
                type="text"
                placeholder="Add task"
                className="placeholder: outline-0 text-md p-1.5 flex-1"
                disabled
              />
            </div>
          )}
        </>
      ) : (
        <div className="border-t mt-4.5"></div>
      )}
    </div>
  );
};

export default TodosStack;
