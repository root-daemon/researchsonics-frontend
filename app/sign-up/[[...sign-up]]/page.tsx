// app/sign-up/[[...sign-up]]/page.tsx
import React from "react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
        <SignUp afterSignUpUrl="/" signInUrl="/sign-in" />
      </div>
    </div>
  );
}
