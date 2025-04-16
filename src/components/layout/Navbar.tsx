"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import {
  MdMenu,
  MdAccountCircle,
  MdDashboard,
  MdLogout,
  MdPerson,
} from "react-icons/md";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    router.push("/");
  };

  const getDashboardLink = () => {
    return user?.role === "brand"
      ? "/brand/dashboard"
      : "/influencer/dashboard";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary-200 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="SyncFluence" width={40} height={40} />
            <span className="text-2xl font-bold text-primary-600">
              SyncFluence
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/features"
              className="font-medium text-primary-700 hover:text-primary-800 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="font-medium text-primary-700 hover:text-primary-800 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="font-medium text-primary-700 hover:text-primary-800 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="font-medium text-primary-700 hover:text-primary-800 transition-colors"
            >
              Contact
            </Link>
            {user && (
              <Link
                href={getDashboardLink()}
                className="font-medium text-primary-700 hover:text-primary-800 transition-colors flex items-center"
              >
                <MdDashboard className="mr-1" />
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-primary-700 hover:text-primary-800 transition-colors"
                >
                  <MdAccountCircle className="h-8 w-8" />
                  <span>{user.email}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-primary-100">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 flex items-center"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <MdPerson className="mr-2" /> Profile
                    </Link>
                    <Link
                      href={getDashboardLink()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 flex items-center"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <MdDashboard className="mr-2" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 flex items-center"
                    >
                      <MdLogout className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="text-primary-600 border-primary-600 hover:bg-primary-50"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-primary-700 hover:bg-primary-50"
            >
              <MdMenu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 bg-white border-t border-primary-100">
            <div className="flex flex-col space-y-3">
              <Link
                href="/features"
                className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md"
              >
                Contact
              </Link>
              {user && (
                <Link
                  href={getDashboardLink()}
                  className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md flex items-center"
                >
                  <MdDashboard className="mr-2" /> Dashboard
                </Link>
              )}
              <div className="pt-2 border-t border-primary-100 flex flex-col space-y-3 px-4">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md flex items-center"
                    >
                      <MdPerson className="mr-2" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-md flex items-center w-full text-left"
                    >
                      <MdLogout className="mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full text-primary-600 border-primary-600 hover:bg-primary-50"
                      >
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="w-full">Sign up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
