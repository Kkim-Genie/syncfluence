"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/store";
import { mockData } from "@/lib/mockData";
import Image from "next/image";

export default function InfluencerProfile() {
  // Use the id directly for now
  // For future Next.js versions, you'll need to use React.use(params) to unwrap the promise
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { user } = useAuthStore();
  const router = useRouter();

  // Find influencer profile by ID
  const influencer = mockData.influencerProfiles.find(
    (profile) => profile.id === id
  );

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (!influencer) {
      router.push(
        user.role === "brand" ? "/brand/dashboard" : "/influencer/dashboard"
      );
    }
  }, [user, router, influencer]);

  // Find campaigns where this influencer is matched
  const matchedCampaignIds = Object.entries(mockData.matches)
    .filter(([_, matches]) =>
      matches.some((match) => match.influencerId === id)
    )
    .map(([campaignId]) => campaignId);

  // Get user's own campaigns that this influencer is matched with
  const userMatchedCampaigns =
    user && user.role === "brand"
      ? mockData.campaigns.filter(
          (campaign) =>
            matchedCampaignIds.includes(campaign.id) &&
            campaign.brandId === user.id
        )
      : [];

  if (!influencer) {
    return null;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={
                  user.role === "brand"
                    ? "/brand/dashboard"
                    : "/influencer/dashboard"
                }
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
                {influencer.name}
              </h1>
              <p className="mt-1 text-gray-600">
                {influencer.platform} • {influencer.niche} •{" "}
                {influencer.followers.toLocaleString()} Followers
              </p>
            </div>
            {user.role === "brand" && (
              <Link href={`/influencers/${id}/chat`}>
                <Button>Contact Influencer</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Influencer Profile */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
                <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full sm:mb-0">
                  <Image
                    src={influencer.profileImageUrl}
                    alt={influencer.name}
                    className="h-full w-full object-cover"
                    width={64}
                    height={64}
                  />
                </div>
                <div className="w-full text-center sm:text-left">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {influencer.name}
                  </h2>
                  <p className="text-gray-600">
                    {influencer.platform} • {influencer.niche}
                  </p>
                  <p className="mt-1 text-gray-600">
                    {influencer.followers.toLocaleString()} Followers
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
                    <div>
                      <span className="text-sm text-gray-500">Platform</span>
                      <p className="font-medium text-gray-900">
                        {influencer.platform}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Specializes in
                      </span>
                      <p className="font-medium text-gray-900">
                        {influencer.niche}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Content Samples */}
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Content Samples
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {influencer.sampleContentImageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg"
                  >
                    <Image
                      src={url}
                      alt={`Content sample ${index + 1}`}
                      className="h-full w-full object-cover"
                      width={64}
                      height={64}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">
                View more content on {influencer.platform}
              </p>
            </div>
          </div>

          <div>
            {/* Match Status */}
            {user.role === "brand" && userMatchedCampaigns.length > 0 && (
              <div className="mb-8">
                <Card className="bg-green-50">
                  <CardHeader title="Match Status" />
                  <p className="text-gray-700">
                    This influencer is matched with your campaign:
                  </p>
                  <div className="mt-4">
                    {userMatchedCampaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="mb-2 rounded-md bg-white p-3 shadow-sm"
                      >
                        <Link
                          href={`/brand/campaigns/${campaign.id}`}
                          className="font-medium text-primary-500 hover:underline"
                        >
                          {campaign.campaignName}
                        </Link>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Profile Stats */}
            <Card>
              <CardHeader title="Profile Stats" />
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Followers
                  </h3>
                  <p className="mt-1 text-2xl font-bold text-primary-500">
                    {influencer.followers.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Platform
                  </h3>
                  <p className="mt-1 text-gray-900">{influencer.platform}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Category
                  </h3>
                  <p className="mt-1 text-gray-900">{influencer.niche}</p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            {user.role === "brand" && (
              <div className="mt-8">
                <Card>
                  <CardHeader title="Actions" />
                  <div className="space-y-4">
                    <Link href={`/influencers/${id}/chat`}>
                      <Button fullWidth>Contact Influencer</Button>
                    </Link>
                    <Button variant="outline" fullWidth>
                      Invite to Campaign
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* MVP Note */}
        <div className="mt-8 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
          <p>
            <strong>MVP Note:</strong> In the full version, you&apos;ll see
            detailed analytics, performance metrics, and more information about
            the influencer&apos;s content and audience.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
