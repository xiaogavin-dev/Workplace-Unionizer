"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpValidation } from "@/lib/validate";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/lib/redux/hooks/redux";
import { setAuthState } from "@/lib/redux/features/auth/authSlice";
import { generateKeyPair } from "@/lib/util/encryptionCalls";
import { storePrivateKey } from "@/lib/util/IndexedDBCalls";
import "./signup.css";

const SignUpSchema = SignUpValidation.extend({
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z.string(),
});

const signup = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // To get query parameters
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const redirectUri = searchParams?.get("redirect_uri") || "/search"; // Default redirect to /search if none provided

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: values.username,
        });

        dispatch(
          setAuthState({
            isAuthenticated: true,
            user: {
              displayName: values.username,
              uid: auth.currentUser.uid,
              email: values.email,
            },
          })
        );

        const data = await generateKeyPair(auth.currentUser.uid);
        if (data) {
          const { publicKey, privateKey } = data;
          await storePrivateKey(auth.currentUser.uid, privateKey);
          const token = await auth.currentUser.getIdToken();
          await fetch(`http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/users/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, publicKey }),
          });
        }

        // Redirect to the provided redirectUri after successful signup
        router.push(redirectUri);
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);

      if (error.code === "auth/email-already-in-use") {
        setError("The email address is already in use by another account.");
      } else {
        setError(error.message);
      }
    }
  }

  return (
    <div className="signup-container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="signup-form">
          <div className="signup-header">
            <h1 className="signup-title">Create an Account</h1>
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="form-label">Username</FormLabel>
                <FormControl className="form-control">
                  <Input
                    placeholder="Enter your username"
                    className="form-input"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="form-label">Email</FormLabel>
                <FormControl className="form-control">
                  <Input
                    placeholder="Enter your email"
                    className="form-input"
                    {...form.register("email")}
                  />
                </FormControl>
                <FormMessage className="form-message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="form-label">Password</FormLabel>
                <FormControl className="form-control">
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    className="form-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="form-message" />
              </FormItem>
            )}
          />
          <FormItem className="form-item">
            <FormLabel className="form-label">Confirm Password</FormLabel>
            <FormControl className="form-control">
              <Input
                placeholder="Confirm your password"
                type="password"
                className="form-input"
                {...form.register("confirmPassword")}
              />
            </FormControl>
            <FormMessage className="form-message" />
          </FormItem>

          <div className="button-container">
            {loading ? (
              <div className="submit-button">
                <PropagateLoader className="relative right-2 bottom-2" />
              </div>
            ) : (
              <div>
                {error && <p className="error-message">{error}</p>}
                <Button type="submit" className="submit-button">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
          <h3 className="signup-login-link">
            Already have an account? <Link href="/auth/login">Login</Link>
          </h3>
        </form>
      </Form>
    </div>
  );
};

export default signup;
