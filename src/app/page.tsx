import React from "react";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background via-primary-50 to-white">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="max-w-2xl">
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary-800 sm:text-5xl md:text-6xl">
                <span className="block">Connecting</span>
                <span className="block text-primary-600">
                  Brands & Influencers
                </span>
              </h1>
              <p className="mb-8 text-xl font-medium text-primary-700">
                InfluenSync is an AI-powered platform that helps brands find the
                perfect influencer match for their campaigns. Try our MVP today!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-primary-600">
                <span className="font-medium">MVP Version 0.1</span> - Testing
                core functionality
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative h-80 w-80 lg:h-96 lg:w-96">
                <Image
                  src="/logo.png"
                  alt="InfluenSync"
                  fill
                  style={{ objectFit: "contain" }}
                  className="animate-pulse"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-primary-700 sm:text-4xl">
              Key Features
            </h2>
            <p className="mt-4 text-xl text-primary-600">
              Our platform offers a streamlined way to connect and create
              successful campaigns
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-primary-200 bg-white p-8 shadow-md hover:border-primary-300 hover:shadow-lg transition-all">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-7 w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-700">
                AI-Powered Matching
              </h3>
              <p className="text-primary-600">
                Our advanced algorithms help brands find the perfect influencers
                for their campaigns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-primary-200 bg-white p-8 shadow-md hover:border-primary-300 hover:shadow-lg transition-all">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-7 w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-700">
                Simple Campaign Creation
              </h3>
              <p className="text-primary-600">
                Create a campaign in minutes with our streamlined process and
                find matches quickly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-primary-200 bg-white p-8 shadow-md hover:border-primary-300 hover:shadow-lg transition-all">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-7 w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-700">
                Influencer Discovery
              </h3>
              <p className="text-primary-600">
                Influencers can discover relevant campaigns that match their
                audience and content style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-primary-50 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold text-primary-700 sm:text-4xl">
                About InfluenSync
              </h2>
              <p className="mt-6 text-lg text-primary-600">
                InfluenSync is an innovative MVP platform designed to streamline
                the process of connecting brands with the right influencers. Our
                AI-based technology analyzes various factors to create optimal
                matches.
              </p>
              <p className="mt-4 text-lg text-primary-600">
                This MVP version focuses on core functionality to validate our
                approach. We&apos;re collecting feedback to improve and expand
                our platform.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-lg bg-white p-8 shadow-md border border-primary-200">
                <h3 className="mb-4 text-xl font-bold text-primary-700">
                  MVP Version 0.1
                </h3>
                <ul className="space-y-3 text-primary-600">
                  <li className="flex items-start">
                    <svg
                      className="mr-2 h-5 w-5 flex-shrink-0 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      ></path>
                    </svg>
                    Basic user registration (brand/influencer)
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="mr-2 h-5 w-5 flex-shrink-0 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      ></path>
                    </svg>
                    Campaign creation for brands
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="mr-2 h-5 w-5 flex-shrink-0 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      ></path>
                    </svg>
                    Viewing recommended influencers
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="mr-2 h-5 w-5 flex-shrink-0 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      ></path>
                    </svg>
                    Viewing available campaigns for influencers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-t from-background to-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-primary-700 sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-xl text-primary-600">
              Join our MVP program and help shape the future of influencer
              marketing.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/signup">
                <Button size="lg">Sign Up Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
