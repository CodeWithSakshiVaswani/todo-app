import { auth } from "@/app/config/firebase";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

const useSignout = () =>
  useMutation({
    mutationKey: ["signout"],
    mutationFn: async () => await signOut(auth),
    onSuccess: () => toast.success("Signed out successfully!"),
    onError: (err) => {
      console.log(err);
    },
  });

export default useSignout;
