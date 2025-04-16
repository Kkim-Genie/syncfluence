"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card, { CardHeader } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/store";
import { mockData } from "@/lib/mockData";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Get user profile data
  const influencerProfile =
    user && user.role === "influencer" && user.profileId
      ? mockData.influencerProfiles.find(
          (profile) => profile.id === user.profileId
        )
      : null;

  // Brand form state
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");

  // Influencer form state
  const [displayName, setDisplayName] = useState("");
  const [platform, setPlatform] = useState<"Instagram" | "TikTok">("Instagram");
  const [niche, setNiche] = useState("");
  const [followers, setFollowers] = useState("");

  // Initialize form values from profile data
  useEffect(() => {
    if (user) {
      if (user.role === "brand" && user.profile) {
        setCompanyName(user.profile.companyName || "");

        const brandData = mockData.brands.find((b) => b.id === user.id);
        if (brandData) {
          setIndustry(brandData.industry || "");
        }
      } else if (user.role === "influencer" && influencerProfile) {
        setDisplayName(influencerProfile.name);
        setPlatform(influencerProfile.platform as "Instagram" | "TikTok");
        setNiche(influencerProfile.niche);
        setFollowers(influencerProfile.followers.toString());
      }
    }
  }, [user, influencerProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the profile via API
    alert("Profile updates would be saved in the full version");
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Profile Settings
          </h1>
          <p className="mt-1 text-gray-600">Update your profile information</p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader
              title={
                user.role === "brand" ? "Brand Profile" : "Influencer Profile"
              }
              subtitle="This information will be visible to other users"
            />

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Brand Profile Form */}
              {user.role === "brand" && (
                <>
                  <Input
                    label="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    fullWidth
                    required
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select Industry</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Food">Food & Beverage</option>
                      <option value="Tech">Technology</option>
                      <option value="Travel">Travel</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </>
              )}

              {/* Influencer Profile Form */}
              {user.role === "influencer" && (
                <>
                  <Input
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    fullWidth
                    required
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Platform
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={
                          platform === "Instagram" ? "primary" : "outline"
                        }
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

                  <Input
                    label="Niche/Category"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g., Beauty, Food, Tech, Travel"
                    fullWidth
                    required
                  />

                  <Input
                    label="Followers Count"
                    type="number"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    fullWidth
                    required
                  />

                  {influencerProfile && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Profile Image
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-full">
                          <Image
                            src={influencerProfile.profileImageUrl}
                            alt={influencerProfile.name}
                            className="h-full w-full object-cover"
                            fill
                          />
                        </div>
                        <Button variant="outline" size="sm" type="button">
                          Change Image
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Image upload functionality will be available in the full
                        version
                      </p>
                    </div>
                  )}

                  {influencerProfile && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Content Samples
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {influencerProfile.sampleContentImageUrls.map(
                          (url, index) => (
                            <div
                              key={index}
                              className="relative h-24 w-full overflow-hidden rounded-md sm:h-32"
                            >
                              <Image
                                src={url}
                                alt={`Content sample ${index + 1}`}
                                className="h-full w-full object-cover"
                                fill
                              />
                            </div>
                          )
                        )}
                        <div className="flex h-24 w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 sm:h-32">
                          <Button variant="ghost" size="sm" type="button">
                            Add More
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Content upload functionality will be available in the
                        full version
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="mt-8 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>

          {/* Account Settings Section */}
          <div className="mt-8">
            <Card>
              <CardHeader
                title="Account Settings"
                subtitle="Manage your account information"
              />

              <div className="mt-6 space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  value={user.email}
                  disabled
                  fullWidth
                />

                <div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* MVP Note */}
          <div className="mt-8 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
            <p>
              <strong>MVP Note:</strong> In the full version, you&apos;ll be
              able to update your profile, upload content samples, and manage
              additional account settings.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
