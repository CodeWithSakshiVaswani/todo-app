import { auth, googleAAuthProvider } from "@/app/config/firebase";
import { useMutation } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { signInWithPopup } from "firebase/auth";
import { toast } from "sonner";

const useGoogleLoginOrSignup = () =>
  useMutation({
    mutationKey: ["google-login"],

    mutationFn: async () => await signInWithPopup(auth, googleAAuthProvider),
    onSuccess: () => toast.success("Logged in successfully!"),
    onError: (err) => {
      toast.error(
        err instanceof FirebaseError && err.code === "auth/popup-closed-by-user"
          ? "Login popup closed before completing the sign in."
          : "Failed to login with Google."
      );
    },
  });

export default useGoogleLoginOrSignup;
