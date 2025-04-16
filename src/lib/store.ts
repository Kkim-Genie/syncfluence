import { create } from "zustand";
import { User, mockData, Campaign } from "./mockData";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    role: "brand" | "influencer",
    companyName?: string
  ) => Promise<void>;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user in mock data
      const user = mockData.users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      set({ user, isLoading: false });

      // Store user in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem("user");
  },
  register: async (email, password, role, companyName) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = mockData.users.find((u) => u.email === email);

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create new user (in a real app, this would be an API call)
      const id = `${role}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;
      const newUser: User = {
        id,
        email,
        password,
        role,
        ...(role === "brand" && companyName
          ? { profile: { companyName } }
          : {}),
        ...(role === "influencer"
          ? {
              profileId: `infp${Math.floor(Math.random() * 1000)
                .toString()
                .padStart(3, "0")}`,
            }
          : {}),
      };

      // In a real app, we would save this to a database
      mockData.users.push(newUser);

      // Auto-login after registration
      set({ user: newUser, isLoading: false });
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  hydrate: () => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          set({ user });
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
        }
      }
    }
  },
}));

// Initialize user from localStorage if available
// This is moved to a hydrate function above for better Next.js compatibility
// and is called from components when needed

// Campaign store
interface CampaignState {
  campaigns: typeof mockData.campaigns;
  createCampaign: (
    campaign: Omit<(typeof mockData.campaigns)[0], "id">
  ) => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
  campaigns: mockData.campaigns,
  createCampaign: (campaignData) => {
    const newCampaign = {
      ...campaignData,
      id: `camp${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
    };

    set((state) => ({
      campaigns: [...state.campaigns, newCampaign],
    }));

    // In a real app, this would be saved to a database
    mockData.campaigns.push(newCampaign as Campaign);
  },
}));
