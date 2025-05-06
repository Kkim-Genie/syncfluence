"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/store";
import { mockData, InfluencerMatch } from "@/lib/mockData";
import Image from "next/image";

export default function CampaignDetails() {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const { user } = useAuthStore();
  const router = useRouter();

  // Find campaign by ID
  const campaign = mockData.campaigns.find((c) => c.id === id);

  // Check if campaign exists and belongs to the user
  const isOwner = user && campaign && campaign.brandId === user.id;

  // Check if user is logged in and is a brand
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "brand") {
      router.push("/influencer/dashboard");
    } else if (!campaign || !isOwner) {
      router.push("/brand/dashboard");
    }
  }, [user, router, campaign, isOwner]);

  // Get matches for this campaign
  const matches = mockData.matches[id] || [];
  const matchedInfluencers = matches
    .map((match) => {
      const influencer = mockData.influencerProfiles.find(
        (inf) => inf.id === match.influencerId
      );
      return influencer ? { ...match, influencer } : null;
    })
    .filter(
      (
        match
      ): match is InfluencerMatch & {
        influencer: (typeof mockData.influencerProfiles)[0];
      } => match !== null
    );

  // If campaign doesn't exist or user doesn't own it
  if (!campaign || !isOwner) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/brand/dashboard"
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
                {campaign.campaignName}
              </h1>
              <p className="mt-1 text-gray-600">
                Campaign Details and Matched Influencers
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline">Edit Campaign</Button>
            </div>
          </div>
        </div>

        {/* Campaign details */}
        <div className="mb-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader title="Campaign Details" />
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Description
                  </h3>
                  <p className="mt-1 text-gray-900">{campaign.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Platform
                    </h3>
                    <p className="mt-1 text-gray-900">{campaign.platform}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Budget
                    </h3>
                    <p className="mt-1 text-gray-900">{campaign.budgetRange}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      campaign.status === "Open"
                        ? "bg-green-100 text-green-800"
                        : campaign.status === "Matching"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="bg-primary-50">
              <CardHeader title="Campaign Stats" />
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    추천 인플루언서
                  </p>
                  <p className="mt-2 text-2xl font-bold text-primary-500">
                    {matchedInfluencers.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    잠재적 도달 범위
                  </p>
                  <p className="mt-2 text-2xl font-bold text-primary-500">
                    {matchedInfluencers
                      .reduce(
                        (total, match) => total + match.influencer.followers,
                        0
                      )
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* AI Recommended Influencers */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            AI 추천 인플루언서
          </h2>

          {matchedInfluencers.length === 0 ? (
            <Card className="bg-gray-50 text-center">
              <p className="text-gray-600">추천된 인플루언서가 없습니다.</p>
              <p className="mt-2 text-sm text-gray-500">
                AI가 캠페인에 적합한 인플루언서를 찾으면 여기에 표시됩니다.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matchedInfluencers.map((match) => (
                <div key={match.influencer.id} className="relative group">
                  <Card
                    hoverable
                    onClick={() =>
                      router.push(`/influencers/${match.influencer.id}`)
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full">
                        <Image
                          src={match.influencer.profileImageUrl}
                          alt={match.influencer.name}
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">
                            {match.influencer.name}
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
                          {match.influencer.platform} • {match.influencer.niche}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {match.influencer.followers.toLocaleString()}{" "}
                          followers
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button size="sm" variant="outline">
                        프로필 보기
                      </Button>
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
              ))}
            </div>
          )}
        </div>

        {/* MVP Note */}
        <div className="mt-8 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
          <p>
            <strong>MVP Note:</strong> In the full version, you&apos;ll be able
            to contact influencers, negotiate terms, and manage campaigns from
            this dashboard.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
