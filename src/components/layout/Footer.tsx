import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-primary-100 bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-extrabold text-primary-600">
              SyncFluence
            </h3>
            <p className="mt-2 text-sm text-primary-800">
              Connecting brands and influencers through intelligent matchmaking.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-800">
              Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-primary-600 hover:text-primary-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-primary-600 hover:text-primary-500"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-primary-600 hover:text-primary-500"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-800">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-primary-600 hover:text-primary-500"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-primary-600 hover:text-primary-500"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-100 pt-8 text-center text-sm text-primary-700">
          <p>
            &copy; {new Date().getFullYear()} SyncFluence. All rights reserved.
            MVP Version 0.1
          </p>
        </div>
      </div>
    </footer>
  );
}
