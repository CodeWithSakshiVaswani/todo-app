import { auth } from "@/app/config/firebase";
import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";

type UseCredsLoginData = {
  email: string;
  password: string;
};

const useCredsLogin = () =>
  useMutation({
    mutationKey: ["creds-login"],
    mutationFn: async (data: UseCredsLoginData) =>
      await signInWithEmailAndPassword(auth, data.email, data.password),
    onSuccess: () => toast.success("Login successfull!"),
    onError: (err) => {
      console.log(err);
      toast.error(
        err instanceof FirebaseError && err.code === "auth/invalid-credential"
          ? "Invalid credentials!"
          : err instanceof FirebaseError && err.code === "auth/invalid-email"
          ? "Invalid email!"
          : "Login failed! Please try again."
      );
    },
  });
export default useCredsLogin;
