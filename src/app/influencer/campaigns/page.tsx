"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/store";
import { mockData } from "@/lib/mockData";

export default function InfluencerCampaigns() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);

  // Check if user is logged in and is an influencer
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "influencer") {
      router.push("/brand/dashboard");
    }
  }, [user, router]);

  // Get influencer profile
  const influencerProfile =
    user && user.profileId
      ? mockData.influencerProfiles.find(
          (profile) => profile.id === user.profileId
        )
      : null;

  // Initialize platform filter to the influencer's platform
  useEffect(() => {
    if (influencerProfile) {
      setPlatformFilter(influencerProfile.platform);
    }
  }, [influencerProfile]);

  // Get all available campaigns
  const allCampaigns = mockData.campaigns.filter(
    (campaign) => campaign.status === "Open"
  );

  // Filter campaigns based on selected platform
  const filteredCampaigns = platformFilter
    ? allCampaigns.filter((campaign) => campaign.platform === platformFilter)
    : allCampaigns;

  // Get campaigns where this influencer was matched
  const matchedCampaignIds = Object.entries(mockData.matches)
    .filter(
      ([_, matches]) =>
        influencerProfile &&
        matches.some((match) => match.influencerId === influencerProfile.id)
    )
    .map(([campaignId]) => campaignId);

  // Check if a campaign has been matched with the current influencer
  const isMatched = (campaignId: string) =>
    matchedCampaignIds.includes(campaignId);

  if (!user || user.role !== "influencer") {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/influencer/dashboard"
                className="mb-2 inline-flex items-center text-sm text-primary-500 hover:underline"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mr-1 h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Available Campaigns
              </h1>
              <p className="mt-1 text-gray-600">
                Browse and discover campaigns that match your profile
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card>
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Platform
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    type="button"
                    variant={platformFilter === null ? "primary" : "outline"}
                    onClick={() => setPlatformFilter(null)}
                    size="sm"
                  >
                    All Platforms
                  </Button>
                  <Button
                    type="button"
                    variant={
                      platformFilter === "Instagram" ? "primary" : "outline"
                    }
                    onClick={() => setPlatformFilter("Instagram")}
                    size="sm"
                  >
                    Instagram
                  </Button>
                  <Button
                    type="button"
                    variant={
                      platformFilter === "TikTok" ? "primary" : "outline"
                    }
                    onClick={() => setPlatformFilter("TikTok")}
                    size="sm"
                  >
                    TikTok
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Campaigns List */}
        <div>
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            {filteredCampaigns.length}{" "}
            {filteredCampaigns.length === 1 ? "Campaign" : "Campaigns"}{" "}
            Available
          </h2>

          {filteredCampaigns.length === 0 ? (
            <Card className="bg-gray-50 text-center">
              <p className="text-gray-600">
                No campaigns match your current filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setPlatformFilter(null)}
              >
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  hoverable
                  onClick={() =>
                    router.push(`/influencer/campaigns/${campaign.id}`)
                  }
                >
                  <CardHeader
                    title={campaign.campaignName}
                    subtitle={`By ${campaign.brandName} • ${campaign.platform}`}
                  />
                  <p className="mb-4 text-gray-600 line-clamp-2">
                    {campaign.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        isMatched(campaign.id)
                          ? "bg-secondary-500 text-white"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {isMatched(campaign.id) ? "Matched" : "Open"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {campaign.budgetRange}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* MVP Note */}
        <div className="mt-8 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
          <p>
            <strong>MVP Note:</strong> In the full version, you&apos;ll be able
            to apply to campaigns directly, and receive notifications when
            you&apos;re matched with new opportunities.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
