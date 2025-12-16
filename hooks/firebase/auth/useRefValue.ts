import { useEffect, useRef } from "react";

const useRefValue = <T>(value: T) => {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref;
};

export default useRefValue;
