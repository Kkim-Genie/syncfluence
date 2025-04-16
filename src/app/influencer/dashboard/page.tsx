"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/store";
import { mockData } from "@/lib/mockData";
import Image from "next/image";

// Brand with compatibility information
interface RecommendedBrand {
  id: string;
  name: string;
  industry: string;
  compatibilityScore: number;
  recommendationReason: string;
  campaignName: string;
  campaignId: string;
}

export default function InfluencerDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

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

  // Get campaigns that match this influencer's platform
  const availableCampaigns = influencerProfile
    ? mockData.campaigns.filter(
        (campaign) =>
          campaign.status === "Open" &&
          campaign.platform === influencerProfile.platform
      )
    : [];

  // Get campaigns where this influencer was matched
  const matchedCampaignIds = Object.entries(mockData.matches)
    .filter(
      ([_, matches]) =>
        influencerProfile &&
        matches.some((match) => match.influencerId === influencerProfile.id)
    )
    .map(([campaignId]) => campaignId);

  const matchedCampaigns = matchedCampaignIds
    .map((id) => mockData.campaigns.find((campaign) => campaign.id === id))
    .filter(Boolean);

  // Get recommended brands with compatibility scores
  const getRecommendedBrands = (): RecommendedBrand[] => {
    if (!influencerProfile) return [];

    // Get unique brands from matched campaigns
    const recommendedBrands = matchedCampaignIds
      .map((campaignId) => {
        const campaign = mockData.campaigns.find((c) => c.id === campaignId);
        if (!campaign) return null;

        const brand = mockData.brands.find((b) => b.id === campaign.brandId);
        if (!brand) return null;

        // Find the match object for this influencer
        const matchInfo = mockData.matches[campaignId]?.find(
          (match) => match.influencerId === influencerProfile.id
        );

        if (!matchInfo) return null;

        return {
          ...brand,
          compatibilityScore: matchInfo.compatibilityScore,
          recommendationReason: matchInfo.recommendationReason,
          campaignName: campaign.campaignName,
          campaignId: campaign.id,
        };
      })
      .filter((brand): brand is RecommendedBrand => brand !== null);

    // Remove duplicates (in case the same brand has multiple matching campaigns)
    const uniqueBrands = Array.from(
      new Map(recommendedBrands.map((brand) => [brand.id, brand])).values()
    );

    // Sort by compatibility score
    return uniqueBrands.sort(
      (a, b) => b.compatibilityScore - a.compatibilityScore
    );
  };

  const recommendedBrands = getRecommendedBrands();

  if (!user || user.role !== "influencer") {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Influencer Dashboard
          </h1>
          <p className="mt-1 text-gray-600">
            Find campaigns and manage your influencer profile
          </p>
        </div>

        {/* Profile Overview */}
        <div className="mb-8">
          <Card className="bg-primary-50">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-6 sm:space-y-0">
              <div className="relative h-24 w-24 overflow-hidden rounded-full sm:h-32 sm:w-32">
                <Image
                  src={
                    influencerProfile?.profileImageUrl ||
                    "https://via.placeholder.com/150?text=Profile"
                  }
                  alt={influencerProfile?.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-gray-900">
                  {influencerProfile?.name || "New Influencer"}
                </h2>
                <p className="text-gray-600">
                  {influencerProfile?.platform || "Platform"} •{" "}
                  {influencerProfile?.niche || "Niche"}
                </p>
                <p className="mt-1 text-gray-600">
                  {influencerProfile?.followers?.toLocaleString() || "0"}{" "}
                  Followers
                </p>
                <div className="mt-4">
                  <Link href="/profile">
                    <Button variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-6 flex flex-1 justify-end sm:mt-0">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-gray-600">
                    Matched Campaigns
                  </p>
                  <p className="mt-1 text-2xl font-bold text-primary-500">
                    {matchedCampaigns.length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* AI 추천 브랜드 (Recommended Brands) */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            AI 추천 브랜드
          </h2>

          {recommendedBrands.length === 0 ? (
            <Card className="bg-gray-50 text-center">
              <p className="text-gray-600">추천된 브랜드가 없습니다.</p>
              <p className="mt-2 text-sm text-gray-500">
                아직 적합한 브랜드를 찾지 못했습니다. 나중에 다시 확인해주세요.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedBrands.map((brand) => (
                <div key={brand.id} className="relative group">
                  <Card
                    hoverable
                    onClick={() =>
                      router.push(`/influencer/campaigns/${brand.campaignId}`)
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative h-16 w-16 flex items-center justify-center overflow-hidden rounded-full bg-primary-100">
                        <span className="text-xl font-semibold text-primary-600">
                          {brand.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">
                            {brand.name}
                          </h3>
                          <div className="flex items-center">
                            <div
                              className={`h-2.5 w-2.5 rounded-full mr-2 ${
                                brand.compatibilityScore >= 90
                                  ? "bg-green-500"
                                  : brand.compatibilityScore >= 70
                                  ? "bg-yellow-500"
                                  : "bg-orange-500"
                              }`}
                            ></div>
                            <span
                              className={`font-medium ${
                                brand.compatibilityScore >= 90
                                  ? "text-green-700"
                                  : brand.compatibilityScore >= 70
                                  ? "text-yellow-700"
                                  : "text-orange-700"
                              }`}
                            >
                              {brand.compatibilityScore}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {brand.industry}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          캠페인: {brand.campaignName}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Tooltip with recommendation reason */}
                  <div className="absolute left-0 right-0 top-0 z-10 mt-[-70px] hidden translate-y-0 transform rounded-md bg-gray-900 p-3 opacity-0 shadow-lg transition-all duration-200 group-hover:block group-hover:opacity-100">
                    <div className="text-sm text-white">
                      <p className="font-medium mb-1">추천 이유:</p>
                      <p>{brand.recommendationReason}</p>
                    </div>
                    <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 transform bg-gray-900"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Matched Campaigns */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Your Matched Campaigns
          </h2>

          {matchedCampaigns.length === 0 ? (
            <Card className="bg-gray-50 text-center">
              <p className="text-gray-600">
                You haven&apos;t been matched with any campaigns yet.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Check the available campaigns section below to see what&apos;s
                available.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matchedCampaigns.map((campaign) => (
                <Card
                  key={campaign?.id}
                  hoverable
                  onClick={() =>
                    router.push(`/influencer/campaigns/${campaign?.id}`)
                  }
                >
                  <CardHeader
                    title={campaign?.campaignName || ""}
                    subtitle={`By ${campaign?.brandName || ""} • ${
                      campaign?.platform || ""
                    }`}
                  />
                  <p className="mb-4 text-gray-600 line-clamp-2">
                    {campaign?.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-secondary-500 px-2 py-1 text-xs font-medium text-white">
                      Matched
                    </span>
                    <span className="text-sm text-gray-500">
                      {campaign?.budgetRange}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Available Campaigns */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Available Campaigns
            </h2>
            <Link href="/influencer/campaigns">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {availableCampaigns.length === 0 ? (
            <Card className="bg-gray-50 text-center">
              <p className="text-gray-600">
                No campaigns available for your platform right now.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Check back later for new opportunities.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {availableCampaigns.slice(0, 3).map((campaign) => (
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
                      className={`rounded-full px-2 py-1 text-xs font-medium
                      bg-green-100 text-green-800`}
                    >
                      Open
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
            to see performance analytics, manage contracts, and much more.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
