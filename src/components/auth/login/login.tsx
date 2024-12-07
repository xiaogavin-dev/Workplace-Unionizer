"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignInValidation } from "@/lib/validate";
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
import { useRouter, useSearchParams } from "next/navigation";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useAppDispatch } from "@/lib/redux/hooks/redux";
import { setAuthState } from "@/lib/redux/features/auth/authSlice";
import { setUserUnions } from "@/lib/redux/features/user_unions/userUnionsSlice";
import "./signin.css";

const Login = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); // To get query parameters
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const redirectUri = searchParams?.get("redirect_uri") || "/search"; // Default redirect to /search if none provided

    const form = useForm<z.infer<typeof SignInValidation>>({
        resolver: zodResolver(SignInValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                console.log("Persistence set successfully");
            })
            .catch((error) => {
                console.error("Error setting persistence:", error);
            });
    }, []);

    async function onSubmit(values: z.infer<typeof SignInValidation>) {
        setLoading(true);
        setError(false);
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password).catch((e) => {
                console.log(e);
                setError(true);
            });

            if (auth.currentUser) {
                try {
                    const token = await auth.currentUser.getIdToken();
                    await fetch("http://localhost:5000/users/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token }),
                    });

                    dispatch(
                        setAuthState({
                            isAuthenticated: true,
                            user: {
                                displayName: auth.currentUser.displayName,
                                uid: auth.currentUser.uid,
                                email: values.email,
                            },
                        })
                    );
                } catch (error) {
                    console.log("Error logging in", error);
                }

                try {
                    const userUnionsRes = await fetch(
                        `http://localhost:5000/union/getUserUnions?userId=${auth.currentUser.uid}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (!userUnionsRes.ok) {
                        throw new Error("Response error");
                    }

                    const data = await userUnionsRes.json();
                    dispatch(
                        setUserUnions({
                            unions: data.data,
                        })
                    );
                } catch (e) {
                    console.error("There was an error receiving user unions", e);
                }
            }

            // Redirect to the redirectUri after login
            if (auth.currentUser) {
                router.push(redirectUri);
            }
        } catch (e) {
            console.error("There was an error with logging in: ", e);
        }

        setLoading(false);
    }

    return (
        <div className="login-container">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">
                    <div className="login-header">
                        <h2 className="title">Login</h2>
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="form-item">
                                <FormLabel className="form-label">Email</FormLabel>
                                <FormControl className="form-control">
                                    <Input
                                        className="form-input"
                                        placeholder="Enter your email"
                                        {...field}
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
                                        className="form-input"
                                        placeholder="Enter your password"
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="form-message" />
                            </FormItem>
                        )}
                    />

                    <h3 className="forgot-password">
                        <a href="/auth/forgotpassword">Forgot Password?</a>
                    </h3>
                    <div className="button-container">
                        {loading ? (
                            <div className="submit-button">
                                <PropagateLoader className="relative right-2 bottom-2" />
                            </div>
                        ) : (
                            <div className="text-red-600 font-semibold mb-4">
                                {error ? "Incorrect Email or Password" : null}
                                <Button className="submit-button" type="submit">
                                    Login
                                </Button>
                            </div>
                        )}
                    </div>
                    <h3 className="signup-link">
                        New to Unionizer?{" "}
                        <Link
                            href={{
                                pathname: "/auth/signup",
                                query: { redirect_uri: searchParams?.get("redirect_uri") || "/search" },
                            }}
                        >
                            Join now
                        </Link>
                    </h3>

                </form>
            </Form>
        </div>
    );
};

export default Login;

