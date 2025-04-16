"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useAuthStore } from "@/lib/store";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<"brand" | "influencer">("brand");
  const { register, isLoading, error } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(email, password, role, companyName);

    // If successfully registered, redirect based on role
    const user = useAuthStore.getState().user;
    if (user) {
      if (user.role === "brand") {
        router.push("/brand/dashboard");
      } else {
        router.push("/influencer/dashboard");
      }
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto flex min-h-[calc(100vh-64px-200px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="mx-auto w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Create your SyncFluence Account
            </h1>
            <p className="mt-2 text-gray-600">
              Join our platform to connect with brands or influencers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={role === "brand" ? "primary" : "outline"}
                  onClick={() => setRole("brand")}
                  className="w-full"
                >
                  Brand
                </Button>
                <Button
                  type="button"
                  variant={role === "influencer" ? "primary" : "outline"}
                  onClick={() => setRole("influencer")}
                  className="w-full"
                >
                  Influencer
                </Button>
              </div>
            </div>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              placeholder="youremail@example.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              placeholder="••••••••"
              minLength={8}
            />

            {role === "brand" && (
              <Input
                label="Company Name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                fullWidth
                placeholder="Your Brand Name"
              />
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} fullWidth>
              Create Account
            </Button>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary-500 hover:underline"
                >
                  Log In
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-center text-xs text-gray-500">
              By signing up, you agree to our Terms of Service and Privacy
              Policy.
              <br />
              <span className="mt-1 block">
                <strong>Note:</strong> This is an MVP version for testing
                purposes.
              </span>
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
