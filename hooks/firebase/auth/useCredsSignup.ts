import { auth } from "@/app/config/firebase";
import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";

type UseCredsSignupData = {
  email: string;
  password: string;
};

const useCredsSignup = () =>
  useMutation({
    mutationKey: ["creds-signup"],
    mutationFn: async (data: UseCredsSignupData) =>
      await createUserWithEmailAndPassword(auth, data.email, data.password),
    onSuccess: () => toast.success("Account created successfully!"),
    onError: (err) => {
      toast.error(
        err instanceof FirebaseError && err.code === "auth/email-already-in-use"
          ? "Email already in use!"
          : "Signup failed! Please try again."
      );
    },
  });
export default useCredsSignup;
