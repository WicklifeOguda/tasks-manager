"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@apollo/client";
import { LOGIN } from "@/lib/graphql/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [login, { loading, error }] = useMutation(LOGIN);

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login({ variables: data });
      router.push("/dashboard"); // Redirect to dashboard after login
    } catch (err) {
      console.error("Login error", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-6">
      <div className="bg-gray-400 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Log In</h2>

        {error && <p className="text-red-500 text-center mb-4">{error.message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("email")} className="w-full p-3 border rounded" placeholder="Email" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <input {...register("password")} type="password" className="w-full p-3 border rounded" placeholder="Password" />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <button type="submit" className="w-full bg-blue-400 hover:bg-blue-300 text-white font-semibold p-3 rounded">
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center mt-4">
          Don&apos;t have an account? <Link href="/signup" className="text-blue-400">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
