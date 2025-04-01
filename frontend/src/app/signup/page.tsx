"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@apollo/client";
import { SIGN_UP } from "@/lib/graphql/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Validation schema
const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    repeatPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const [signUp, { loading, error }] = useMutation(SIGN_UP);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      await signUp({
        variables: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
      router.push("/login"); // Redirect after signup
    } catch (err) {
      console.error("Signup error", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-6">
      <div className="bg-gray-500 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h2>

        {error && <p className="text-red-500 text-center mb-4">{error.message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("name")} className="w-full p-3 border rounded" placeholder="Name" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <input {...register("email")} className="w-full p-3 border rounded" placeholder="Email" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <input {...register("password")} type="password" className="w-full p-3 border rounded" placeholder="Password" />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <input
            {...register("repeatPassword")}
            type="password"
            className="w-full p-3 border rounded"
            placeholder="Confirm Password"
          />
          {errors.repeatPassword && <p className="text-red-500">{errors.repeatPassword.message}</p>}

          <button type="submit" className="w-full bg-blue-400 hover:bg-blue-300 text-white font-semibold p-3 rounded">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account? <Link href="/login" className="text-blue-400">Log in</Link>
        </p>
      </div>
    </div>
  );
}
