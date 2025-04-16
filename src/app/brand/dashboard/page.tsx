"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import { mockData } from "@/lib/mockData";
import { useAuthCheck } from "@/lib/authUtils";
import Image from "next/image";

export default function BrandDashboard() {
  const router = useRouter();
  // This will automatically check auth, hydrate from localStorage, and redirect if needed
  const user = useAuthCheck("brand");

  // Filter campaigns for the current brand
  const brandCampaigns = user
    ? mockData.campaigns.filter((campaign) => campaign.brandId === user.id)
    : [];

  // Get matches for campaigns
  const getMatches = (campaignId: string) => {
    const matches = mockData.matches[campaignId] || [];
    return matches
      .map((match) => {
        const profile = mockData.influencerProfiles.find(
          (profile) => profile.id === match.influencerId
        );
        return profile ? { ...match, profile } : null;
      })
      .filter(Boolean);
  };

  if (!user) {
    return null; // Will redirect via useAuthCheck
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Brand Dashboard
            </h1>
            <p className="mt-1 text-gray-600">
              Manage your campaigns and view matched influencers
            </p>
          </div>
          <Link href="/brand/campaigns/create">
            <Button>Create Campaign</Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-primary-50">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">
                Total Campaigns
              </p>
              <p className="mt-2 text-3xl font-bold text-primary-500">
                {brandCampaigns.length}
              </p>
            </div>
          </Card>

          <Card className="bg-primary-50">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">
                Active Campaigns
              </p>
              <p className="mt-2 text-3xl font-bold text-primary-500">
                {
                  brandCampaigns.filter(
                    (c) => c.status === "Open" || c.status === "Matching"
                  ).length
                }
              </p>
            </div>
          </Card>

          <Card className="bg-primary-50">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">
                Matched Influencers
              </p>
              <p className="mt-2 text-3xl font-bold text-primary-500">
                {Object.entries(mockData.matches)
                  .filter(([campaignId]) =>
                    brandCampaigns.some((c) => c.id === campaignId)
                  )
                  .reduce((count, [_, matches]) => count + matches.length, 0)}
              </p>
            </div>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Your Campaigns
          </h2>

          {brandCampaigns.length === 0 ? (
            <Card className="bg-gray-50 text-center">
              <p className="text-gray-600">
                You haven&apos;t created any campaigns yet.
              </p>
              <Link
                href="/brand/campaigns/create"
                className="mt-4 inline-block"
              >
                <Button>Create Your First Campaign</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {brandCampaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  hoverable
                  onClick={() => router.push(`/brand/campaigns/${campaign.id}`)}
                >
                  <CardHeader
                    title={campaign.campaignName}
                    subtitle={`Platform: ${campaign.platform} • Budget: ${campaign.budgetRange}`}
                  />
                  <p className="mb-4 text-gray-600 line-clamp-2">
                    {campaign.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        campaign.status === "Open"
                          ? "bg-green-100 text-green-800"
                          : campaign.status === "Matching"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getMatches(campaign.id).length} matches
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Matches */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            AI 추천 인플루언서
          </h2>

          {Object.keys(mockData.matches).length === 0 ||
          !Object.keys(mockData.matches).some((campaignId) =>
            brandCampaigns.some((campaign) => campaign.id === campaignId)
          ) ? (
            <Card className="bg-gray-50 text-center">
              <p className="text-gray-600">추천된 인플루언서가 없습니다.</p>
              <p className="mt-2 text-sm text-gray-500">
                캠페인을 생성하여 AI 추천 인플루언서를 확인하세요.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(mockData.matches)
                .filter(([campaignId]) =>
                  brandCampaigns.some((c) => c.id === campaignId)
                )
                .slice(0, 3)
                .flatMap(([campaignId, matches]) => {
                  const campaign = brandCampaigns.find(
                    (c) => c.id === campaignId
                  );

                  return matches.map((match) => {
                    const influencer = mockData.influencerProfiles.find(
                      (p) => p.id === match.influencerId
                    );
                    if (!influencer || !campaign) return null;

                    return (
                      <div
                        key={`${campaignId}-${match.influencerId}`}
                        className="relative group"
                      >
                        <Card
                          hoverable
                          onClick={() =>
                            router.push(`/influencers/${match.influencerId}`)
                          }
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-full">
                              <Image
                                src={influencer.profileImageUrl}
                                alt={influencer.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-900">
                                  {influencer.name}
                                </h3>
                                <div className="flex items-center">
                                  <div
                                    className={`h-2.5 w-2.5 rounded-full mr-2 ${
                                      match.compatibilityScore >= 90
                                        ? "bg-green-500"
                                        : match.compatibilityScore >= 70
                                        ? "bg-yellow-500"
                                        : "bg-orange-500"
                                    }`}
                                  ></div>
                                  <span
                                    className={`font-medium ${
                                      match.compatibilityScore >= 90
                                        ? "text-green-700"
                                        : match.compatibilityScore >= 70
                                        ? "text-yellow-700"
                                        : "text-orange-700"
                                    }`}
                                  >
                                    {match.compatibilityScore}%
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">
                                {influencer.platform} • {influencer.niche}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {influencer.followers.toLocaleString()}{" "}
                                followers
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 text-sm text-gray-600">
                            <span className="font-medium">캠페인:</span>{" "}
                            {campaign.campaignName}
                          </div>
                        </Card>

                        {/* Tooltip with recommendation reason */}
                        <div className="absolute left-0 right-0 top-0 z-10 mt-[-70px] hidden translate-y-0 transform rounded-md bg-gray-900 p-3 opacity-0 shadow-lg transition-all duration-200 group-hover:block group-hover:opacity-100">
                          <div className="text-sm text-white">
                            <p className="font-medium mb-1">추천 이유:</p>
                            <p>{match.recommendationReason}</p>
                          </div>
                          <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 transform bg-gray-900"></div>
                        </div>
                      </div>
                    );
                  });
                })
                .filter(Boolean)}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
