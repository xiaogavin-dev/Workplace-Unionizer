"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, formState: { errors } } = methods;

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setError(null); // set prev error to null
      await sendPasswordResetEmail(auth, data.email);
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-lg p-4 border-2 shadow-lg">
        <h2 className="text-2xl text-center font-bold">Forgot Password</h2>
        <p className="text-center mb-4">Enter your email address and we will send you a link to reset your password.</p>

        {emailSent ? (
          <div className="text-green-600 text-center">
            <p>Success! Please check your email for password reset instructions.</p>
          </div>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-red-600 text-center">
                  <p>{error}</p>
                </div>
              )}

              <div className="flex justify-center mt-4">
                <Button type="submit" className="w-full">Send Reset Link</Button>
              </div>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  );
}
