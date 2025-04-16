"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useAuthStore, useCampaignStore } from "@/lib/store";

export default function CreateCampaign() {
  const { user } = useAuthStore();
  const { createCampaign } = useCampaignStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [campaignName, setCampaignName] = useState("");
  const [platform, setPlatform] = useState<"Instagram" | "TikTok">("Instagram");
  const [description, setDescription] = useState("");
  const [budgetRange, setBudgetRange] = useState<string>(
    "₩500,000 - ₩1,000,000"
  );

  // Check if user is logged in and is a brand
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "brand") {
      router.push("/influencer/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create campaign with mock data
      createCampaign({
        brandId: user.id,
        brandName: user.profile?.companyName || "Unknown Brand",
        campaignName,
        platform,
        description,
        budgetRange,
        status: "Matching", // Start in matching state to show mock results immediately
      });

      // Redirect to dashboard
      router.push("/brand/dashboard");
    } catch (error) {
      console.error("Failed to create campaign", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== "brand") {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Create a New Campaign
          </h1>
          <p className="mt-1 text-gray-600">
            Fill out the form below to create a campaign and get matched with
            influencers
          </p>
        </div>

        <Card className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Campaign Name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              required
              fullWidth
              placeholder="e.g., Summer Collection Promotion"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Target Platform
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={platform === "Instagram" ? "primary" : "outline"}
                  onClick={() => setPlatform("Instagram")}
                  className="w-full"
                >
                  Instagram
                </Button>
                <Button
                  type="button"
                  variant={platform === "TikTok" ? "primary" : "outline"}
                  onClick={() => setPlatform("TikTok")}
                  className="w-full"
                >
                  TikTok
                </Button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Campaign Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder="Describe your campaign goals, content requirements, etc."
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Budget Range
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value="₩100,000 - ₩500,000">₩100,000 - ₩500,000</option>
                <option value="₩500,000 - ₩1,000,000">
                  ₩500,000 - ₩1,000,000
                </option>
                <option value="₩1,000,000 - ₩2,000,000">
                  ₩1,000,000 - ₩2,000,000
                </option>
                <option value="₩2,000,000+">₩2,000,000+</option>
              </select>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/brand/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Create Campaign
              </Button>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              <p>
                <strong>Note:</strong> This is an MVP version. In the full
                version, you&apos;ll be able to set more detailed campaign
                parameters.
              </p>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
