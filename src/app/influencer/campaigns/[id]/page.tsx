"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/store";
import { mockData } from "@/lib/mockData";

export default function CampaignDetails() {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const { user } = useAuthStore();
  const router = useRouter();

  // Find campaign by ID
  const campaign = mockData.campaigns.find((c) => c.id === id);

  // Check if user is logged in and is an influencer
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "influencer") {
      router.push("/brand/dashboard");
    } else if (!campaign) {
      router.push("/influencer/campaigns");
    }
  }, [user, router, campaign]);

  // Get influencer profile
  const influencerProfile =
    user && user.profileId
      ? mockData.influencerProfiles.find(
          (profile) => profile.id === user.profileId
        )
      : null;

  // Check if the influencer is matched with this campaign
  const isMatched =
    influencerProfile &&
    mockData.matches[id]?.some(
      (match) => match.influencerId === influencerProfile.id
    );

  // Find brand info
  const brand = campaign
    ? mockData.brands.find((b) => b.id === campaign.brandId)
    : null;

  if (!campaign) {
    return null;
  }

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
                href="/influencer/campaigns"
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
                Back to Campaigns
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {campaign.campaignName}
              </h1>
              <p className="mt-1 text-gray-600">by {campaign.brandName}</p>
            </div>
            <div>
              {isMatched ? (
                <span className="rounded-md bg-secondary-500 px-3 py-1.5 text-sm font-medium text-white">
                  You&apos;re Matched!
                </span>
              ) : (
                <Button>Apply for Campaign</Button>
              )}
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
                      Budget Range
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
            <Card>
              <CardHeader title="Brand Information" />
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Company Name
                  </h3>
                  <p className="mt-1 text-gray-900">
                    {brand?.name || campaign.brandName}
                  </p>
                </div>
                {brand?.industry && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Industry
                    </h3>
                    <p className="mt-1 text-gray-900">{brand.industry}</p>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Button variant="outline" size="sm" fullWidth>
                  View Brand Profile
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Apply Section */}
        {!isMatched && (
          <div className="mb-8">
            <Card className="bg-primary-50">
              <CardHeader title="Interested in this campaign?" />
              <p className="text-gray-600">
                Apply to express your interest in collaborating on this
                campaign.
              </p>
              <div className="mt-4">
                <Button>Apply Now</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Match Information */}
        {isMatched && (
          <div className="mb-8">
            <Card className="bg-green-50">
              <CardHeader title="Match Information" />
              <p className="text-gray-700">
                You have been matched with this campaign by our AI algorithm!
                This means your profile is a good fit for what the brand is
                looking for.
              </p>
              <div className="mt-4 rounded-md bg-white p-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Next Steps:
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  In the full version of the platform, you would be able to:
                </p>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
                  <li>Chat with the brand</li>
                  <li>Negotiate terms</li>
                  <li>Sign a digital contract</li>
                  <li>Submit your content for approval</li>
                </ul>
              </div>
            </Card>
          </div>
        )}

        {/* Similar Campaigns */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Similar Campaigns
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockData.campaigns
              .filter(
                (c) =>
                  c.id !== id &&
                  c.status === "Open" &&
                  c.platform === campaign.platform
              )
              .slice(0, 3)
              .map((similarCampaign) => (
                <Card
                  key={similarCampaign.id}
                  hoverable
                  onClick={() =>
                    router.push(`/influencer/campaigns/${similarCampaign.id}`)
                  }
                >
                  <CardHeader
                    title={similarCampaign.campaignName}
                    subtitle={`By ${similarCampaign.brandName}`}
                  />
                  <p className="mb-4 text-gray-600 line-clamp-2">
                    {similarCampaign.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {similarCampaign.platform}
                    </span>
                    <span className="text-sm text-gray-500">
                      {similarCampaign.budgetRange}
                    </span>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* MVP Note */}
        <div className="mt-8 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
          <p>
            <strong>MVP Note:</strong> This is a simplified view of the campaign
            details. In the full version, you&apos;ll see more information and
            functionality.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
