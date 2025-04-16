// Types for our mock data
export interface User {
  id: string;
  email: string;
  password: string; // In a real app, you'd never store plain text passwords
  role: "brand" | "influencer";
  profile?: { companyName: string };
  profileId?: string;
}

export interface InfluencerProfile {
  id: string;
  name: string;
  platform: string;
  followers: number;
  niche: string;
  profileImageUrl: string;
  sampleContentImageUrls: string[];
}

export interface Brand {
  id: string;
  name: string;
  industry: string;
}

export interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  campaignName: string;
  platform: string;
  description: string;
  budgetRange: string;
  status: "Open" | "Matching" | "Closed";
}

// New interface for matches that includes compatibility score and reason
export interface InfluencerMatch {
  influencerId: string;
  compatibilityScore: number;
  recommendationReason: string;
}

// Escrow service interfaces
export interface Milestone {
  id: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed" | "approved" | "rejected";
  evidence?: string; // URL or description of evidence provided by influencer
}

export interface EscrowTransaction {
  id: string;
  campaignId: string;
  contractId: string;
  influencerId: string;
  brandId: string;
  amount: string;
  status:
    | "pending"
    | "in_progress"
    | "completed"
    | "released"
    | "refunded"
    | "disputed";
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
  disputeReason?: string;
  releaseDate?: string;
}

export interface Contract {
  id: string;
  campaignId: string;
  influencerId: string;
  brandId: string;
  campaignName: string;
  startDate: string;
  endDate: string;
  compensation: string;
  deliverables: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
}

export interface MockData {
  users: User[];
  influencerProfiles: InfluencerProfile[];
  brands: Brand[];
  campaigns: Campaign[];
  matches: Record<string, InfluencerMatch[]>;
  escrowTransactions: EscrowTransaction[];
  contracts: Contract[];
}

// Mock data based on plan.md
export const mockData: MockData = {
  users: [
    {
      id: "brand001",
      email: "brand1@example.com",
      password: "password123", // In a real app, you'd never store plain text passwords
      role: "brand",
      profile: { companyName: "뷰티코리아" },
    },
    {
      id: "brand002",
      email: "brand2@example.com",
      password: "password123",
      role: "brand",
      profile: { companyName: "푸드월드" },
    },
    {
      id: "influencer001",
      email: "influencer1@example.com",
      password: "password123",
      role: "influencer",
      profileId: "infp001",
    },
    {
      id: "influencer002",
      email: "influencer2@example.com",
      password: "password123",
      role: "influencer",
      profileId: "infp002",
    },
    {
      id: "influencer003",
      email: "influencer3@example.com",
      password: "password123",
      role: "influencer",
      profileId: "infp003",
    },
  ],
  influencerProfiles: [
    {
      id: "infp001",
      name: "뷰티스타☆",
      platform: "Instagram",
      followers: 55000,
      niche: "Beauty",
      profileImageUrl: "/mockImages/infp001_profile.jpeg",
      sampleContentImageUrls: [
        "/mockImages/infp001_content_1.jpeg",
        "/mockImages/infp001_content_2.jpeg",
      ],
    },
    {
      id: "infp002",
      name: "먹방요정",
      platform: "TikTok",
      followers: 120000,
      niche: "Food",
      profileImageUrl: "/mockImages/infp002_profile.jpeg",
      sampleContentImageUrls: [
        "/mockImages/infp002_content_1.jpeg",
        "/mockImages/infp002_content_2.jpeg",
      ],
    },
    {
      id: "infp003",
      name: "테크톡커",
      platform: "TikTok",
      followers: 80000,
      niche: "Tech",
      profileImageUrl: "/mockImages/infp003_profile.jpeg",
      sampleContentImageUrls: [
        "/mockImages/infp003_content_1.jpeg",
        "/mockImages/infp003_content_2.jpeg",
      ],
    },
  ],
  brands: [
    { id: "brand001", name: "뷰티코리아", industry: "Beauty" },
    { id: "brand002", name: "푸드월드", industry: "Food" },
  ],
  campaigns: [
    {
      id: "camp001",
      brandId: "brand001",
      brandName: "뷰티코리아",
      campaignName: "신상 립스틱 홍보",
      platform: "Instagram",
      description: "새로 출시된 립스틱 라인의 인스타그램 피드 홍보",
      budgetRange: "₩500,000 - ₩1,000,000",
      status: "Open",
    },
    {
      id: "camp002",
      brandId: "brand002",
      brandName: "푸드월드",
      campaignName: "신제품 챌린지",
      platform: "TikTok",
      description: "신제품 과자를 활용한 틱톡 챌린지 영상 제작",
      budgetRange: "₩1,000,000 - ₩2,000,000",
      status: "Open",
    },
    {
      id: "camp003",
      brandId: "brand001",
      brandName: "뷰티코리아",
      campaignName: "여름 선크림 영상",
      platform: "TikTok",
      description: "여름 시즌 대비 선크림 사용법 틱톡 영상",
      budgetRange: "₩700,000 - ₩1,500,000",
      status: "Matching", // 브랜드가 생성 후 매칭 결과를 보는 단계 예시
    },
  ],
  matches: {
    // Updated to use the new InfluencerMatch interface with scores and reasons
    camp003: [
      {
        influencerId: "infp001",
        compatibilityScore: 92,
        recommendationReason:
          "뷰티 분야 전문 인플루언서로, 화장품 관련 콘텐츠 경험이 풍부하며 타겟 오디언스와 높은 일치도를 보임",
      },
      {
        influencerId: "infp002",
        compatibilityScore: 78,
        recommendationReason:
          "높은 팔로워 수와 참여율을 가지고 있으며, 다양한 제품 리뷰 경험이 있어 선크림 콘텐츠도 효과적으로 제작 가능",
      },
      {
        influencerId: "infp003",
        compatibilityScore: 65,
        recommendationReason:
          "틱톡 플랫폼에서 높은 인지도와 창의적인 콘텐츠 제작 스타일을 보유하고 있어 캠페인 확산에 도움이 될 것",
      },
    ],
    camp001: [
      {
        influencerId: "infp001",
        compatibilityScore: 96,
        recommendationReason:
          "뷰티 전문 인플루언서로 립스틱 관련 콘텐츠가 많고, 인스타그램 사용자 중 화장품에 관심있는 팔로워 비율이 높음",
      },
      {
        influencerId: "infp003",
        compatibilityScore: 70,
        recommendationReason:
          "다양한 제품 리뷰 스타일과 넓은 연령대의 팔로워를 보유하여 립스틱 제품 홍보에 새로운 시각 제공 가능",
      },
    ],
    camp002: [
      {
        influencerId: "infp002",
        compatibilityScore: 94,
        recommendationReason:
          "푸드 콘텐츠 전문 인플루언서로, 챌린지 바이럴 콘텐츠 제작 경험이 많고 틱톡에서 높은 참여율을 유지함",
      },
      {
        influencerId: "infp003",
        compatibilityScore: 85,
        recommendationReason:
          "트렌디한 콘텐츠로 젊은 층에 영향력이 높고, 챌린지 콘텐츠 제작에 뛰어난 창의성을 보임",
      },
    ],
  },
  // Mock data for contracts
  contracts: [
    {
      id: "contract001",
      campaignId: "camp001",
      influencerId: "infp001",
      brandId: "brand001",
      campaignName: "신상 립스틱 홍보",
      startDate: "2023-06-15",
      endDate: "2023-07-15",
      compensation: "₩800,000",
      deliverables: "인스타그램 피드 포스트 2개, 스토리 3개",
      status: "accepted",
      createdAt: "2023-06-10",
    },
    {
      id: "contract002",
      campaignId: "camp002",
      influencerId: "infp002",
      brandId: "brand002",
      campaignName: "신제품 챌린지",
      startDate: "2023-06-20",
      endDate: "2023-07-20",
      compensation: "₩1,500,000",
      deliverables: "틱톡 챌린지 영상 1개, 리액션 영상 2개",
      status: "pending",
      createdAt: "2023-06-12",
    },
    {
      id: "contract003",
      campaignId: "camp003",
      influencerId: "infp001",
      brandId: "brand001",
      campaignName: "여름 선크림 영상",
      startDate: "2023-07-01",
      endDate: "2023-08-01",
      compensation: "₩1,200,000",
      deliverables: "틱톡 사용법 영상 2개, 리뷰 영상 1개",
      status: "completed",
      createdAt: "2023-06-25",
    },
  ],
  // Mock data for escrow transactions
  escrowTransactions: [
    {
      id: "escrow001",
      campaignId: "camp001",
      contractId: "contract001",
      influencerId: "infp001",
      brandId: "brand001",
      amount: "₩800,000",
      status: "in_progress",
      milestones: [
        {
          id: "milestone001",
          description: "첫 번째 인스타그램 피드 포스트",
          dueDate: "2023-06-25",
          status: "completed",
          evidence: "https://instagram.com/p/example1",
        },
        {
          id: "milestone002",
          description: "두 번째 인스타그램 피드 포스트",
          dueDate: "2023-07-05",
          status: "approved",
        },
        {
          id: "milestone003",
          description: "인스타그램 스토리 3개",
          dueDate: "2023-07-15",
          status: "pending",
        },
      ],
      createdAt: "2023-06-15",
      updatedAt: "2023-06-26",
    },
    {
      id: "escrow002",
      campaignId: "camp003",
      contractId: "contract003",
      influencerId: "infp001",
      brandId: "brand001",
      amount: "₩1,200,000",
      status: "completed",
      milestones: [
        {
          id: "milestone004",
          description: "첫 번째 틱톡 사용법 영상",
          dueDate: "2023-07-15",
          status: "completed",
          evidence: "https://tiktok.com/v/example1",
        },
        {
          id: "milestone005",
          description: "두 번째 틱톡 사용법 영상",
          dueDate: "2023-07-25",
          status: "completed",
          evidence: "https://tiktok.com/v/example2",
        },
        {
          id: "milestone006",
          description: "리뷰 영상",
          dueDate: "2023-08-01",
          status: "completed",
          evidence: "https://tiktok.com/v/example3",
        },
      ],
      createdAt: "2023-07-01",
      updatedAt: "2023-08-05",
      releaseDate: "2023-08-05",
    },
    {
      id: "escrow003",
      campaignId: "camp002",
      contractId: "contract002",
      influencerId: "infp002",
      brandId: "brand002",
      amount: "₩1,500,000",
      status: "pending",
      milestones: [
        {
          id: "milestone007",
          description: "틱톡 챌린지 영상",
          dueDate: "2023-07-05",
          status: "pending",
        },
        {
          id: "milestone008",
          description: "첫 번째 리액션 영상",
          dueDate: "2023-07-15",
          status: "pending",
        },
        {
          id: "milestone009",
          description: "두 번째 리액션 영상",
          dueDate: "2023-07-20",
          status: "pending",
        },
      ],
      createdAt: "2023-06-20",
      updatedAt: "2023-06-20",
    },
    {
      id: "escrow004",
      campaignId: "camp001",
      contractId: "contract001",
      influencerId: "infp003",
      brandId: "brand001",
      amount: "₩600,000",
      status: "disputed",
      milestones: [
        {
          id: "milestone010",
          description: "인스타그램 스토리 3개",
          dueDate: "2023-06-20",
          status: "completed",
          evidence: "https://instagram.com/stories/example",
        },
        {
          id: "milestone011",
          description: "인스타그램 피드 포스트 1개",
          dueDate: "2023-06-30",
          status: "rejected",
          evidence: "https://instagram.com/p/example2",
        },
      ],
      createdAt: "2023-06-10",
      updatedAt: "2023-07-02",
      disputeReason: "브랜드 가이드라인을 준수하지 않은 콘텐츠",
    },
  ],
};
