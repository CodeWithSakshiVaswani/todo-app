"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useCredsLogin from "@/hooks/firebase/auth/useCredsLogin";
import useCredsSignup from "@/hooks/firebase/auth/useCredsSignup";
import useGoogleLoginOrSignup from "@/hooks/firebase/auth/useGoogleLogin";
import Link from "next/link";
import { useState } from "react";

type LoginOrSignupFormProps = {
  type: "login" | "signup";
};

const LoginOrSignupForm = ({ type }: LoginOrSignupFormProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { mutateAsync: signup, isPending: isSignupPending } = useCredsSignup();
  const { mutateAsync: login, isPending: isLoginPending } = useCredsLogin();
  const {
    mutateAsync: googleLoginOrSignup,
    isPending: isGoogleLoginOrSignupPending,
  } = useGoogleLoginOrSignup();

  const keyword = type === "login" ? "Login" : "Signup";

  return (
    <div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{keyword} to your account</CardTitle>
            <CardDescription>
              {type === "login"
                ? "Enter your credentials below to login to your account"
                : "Create a new account by filling in the details below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field>
                  <Button
                    isLoading={
                      isSignupPending ||
                      isLoginPending ||
                      isGoogleLoginOrSignupPending
                    }
                    type="submit"
                    onClick={async (e) => {
                      e.preventDefault();
                      const res = await (type === "login" ? login : signup)(
                        formData
                      );
                      console.log(res);
                    }}
                  >
                    {keyword}
                  </Button>
                  <Button
                    isLoading={
                      isSignupPending ||
                      isLoginPending ||
                      isGoogleLoginOrSignupPending
                    }
                    variant="outline"
                    type="button"
                    onClick={async () => {
                      await googleLoginOrSignup();
                    }}
                  >
                    {keyword} with Google
                  </Button>
                  <FieldDescription className="text-center">
                    {type === "login" ? (
                      <>
                        Don&apos;t have an account?{" "}
                        <Link href="/signup">Sign up</Link>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <Link href="/login">Login</Link>
                      </>
                    )}
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginOrSignupForm;
