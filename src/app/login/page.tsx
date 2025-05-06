"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();

  // Check if the user is already logged in
  // This will automatically redirect to the appropriate dashboard
  useEffect(() => {
    const user = useAuthStore.getState().user;
    if (user) {
      if (user.role === "brand") {
        router.push("/brand/dashboard");
      } else {
        router.push("/influencer/dashboard");
      }
    }
  }, [router]);

  // Ensure we hydrate the auth store on page load
  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);

    // If successfully logged in, redirect based on role
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
              Log In to InfluenSync
            </h1>
            <p className="mt-2 text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
            />

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} fullWidth>
              Log In
            </Button>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-primary-500 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>

          {/* Demo account shortcuts for convenience */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="mb-4 text-center text-sm text-gray-500">
              Demo Accounts (MVP)
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmail("brand1@example.com");
                  setPassword("password123");
                }}
              >
                Brand Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmail("influencer1@example.com");
                  setPassword("password123");
                }}
              >
                Influencer Demo
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
