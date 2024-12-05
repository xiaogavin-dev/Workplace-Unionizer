"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import './forgotpassword.css';

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
      setError(null); // reset previous error
      await sendPasswordResetEmail(auth, data.email);
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2 className="forgot-password-title">Forgot Password</h2>
        <p className="forgot-password-description">
          Enter your email address to receive a link to reset your password.
        </p>

        {emailSent ? (
          <div className="success-message">
            <p>Success! Please check your email for password reset instructions.</p>
          </div>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="forgot-password-form">
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel className="form-label">Email</FormLabel>
                    <FormControl className="form-control">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="form-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="form-message">
                      {errors.email && <p>{errors.email.message}</p>}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}

              <div className="button-container">
                <Button type="submit" className="submit-button">Send Reset Link</Button>
              </div>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  );
}
