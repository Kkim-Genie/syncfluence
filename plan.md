# InfluenSync MVP 개발 명세서 (Mock Data 기반)

**버전:** MVP 0.1
**기준:** 린캔버스
**특이사항:** 실제 기능 구현 최소화, 핵심 사용자 플로우 검증 목적, **Mock Data 사용**

## 1. MVP 목표 및 범위

- **목표:** 브랜드와 인플루언서 간의 **기본적인 매칭 및 캠페인 발견 플로우**를 검증한다. 사용자가 핵심 가치(AI 기반 매칭의 가능성, 플랫폼 사용성)를 인지하는지 확인한다.
- **핵심 기능:**
  - 사용자 가입/로그인 (브랜드/인플루언서 구분)
  - 브랜드: 간단 캠페인 생성 (핵심 정보만 입력)
  - 브랜드: 캠페인에 대한 **Mock 매칭 결과** (인플루언서 목록) 확인
  - 인플루언서: **Mock 캠페인 목록** 확인
  - 인플루언서/브랜드: 상대방 기본 프로필 조회
- **제외 범위 (MVP 이후):**
  - **실제 AI 매칭 알고리즘** (결과는 Mock Data로 대체)
  - **실제 계약/결제 기능 (에스크로 포함)**
  - **상세 성과 분석 및 리포팅**
  - 이커머스 연동
  - 메시징 기능
  - 복잡한 필터링/검색 기능
  - 관리자 기능
  - 외부 API 연동 (SNS 데이터 실시간 연동 등)

## 2. 개발 고려사항 (MVP)

- **Mock Data 활용:** 백엔드 개발 최소화를 위해 미리 정의된 Mock Data (JSON 형태)를 사용하여 프론트엔드에 표시한다.
- **단순화된 UI/UX:** 핵심 플로우에 집중한 최소한의 UI 구성.
- **사용자 역할 분리:** 브랜드/인플루언서 로그인 시 보이는 화면(대시보드, 메뉴 등)을 다르게 구성한다.
- **하드코딩:** 매칭 로직, 캠페인 목록 등은 Mock Data를 기반으로 하드코딩될 수 있다.
- **피드백 수집:** MVP 사용성 테스트 및 피드백 수집 방안 고려 (예: 간단한 설문 링크).

## 3. MVP 웹사이트 페이지 구성 및 명세

| 페이지명                        | 내용 및 기능 (MVP 기준)                                                                                                                                                       | Mock Data 연관   | 개발 참고사항                                  |
| :------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :--------------------------------------------- |
| **1. 랜딩 페이지 (간소화)**     | - 서비스 핵심 컨셉 소개 (AI 매칭 가능성) <br> - MVP임을 명시 <br> - 회원가입/로그인 CTA 버튼                                                                                  | -                | 복잡한 설명, 기능 나열 생략                    |
| **2. 회원가입/로그인**          | - 회원 유형 선택 (브랜드/인플루언서) <br> - 기본 정보 입력 (이메일, 비밀번호) <br> - 로그인 기능                                                                              | User Data        | 최소한의 폼, 복잡한 인증/프로필 설정 생략      |
| **3. 브랜드 대시보드**          | - **"캠페인 생성"** 버튼 <br> - 생성한 캠페인 목록 (간단히) <br> - 캠페인 선택 시 **"매칭된 인플루언서 목록"** 표시 (Mock Data 기반)                                          | Campaign, Match  | 실제 데이터 분석/차트 없음                     |
| **4. 캠페인 생성 (브랜드)**     | - 필수 정보 입력 폼: <br> _ 캠페인 이름 <br> _ 타겟 플랫폼 (틱톡/인스타 선택) <br> _ 간단 설명 <br> _ 희망 예산 범위 (선택형 또는 텍스트) <br> - "생성" 버튼 (실제 AI 매칭 X) | Campaign         | 최소 필드 구성, 생성 시 Mock Match 데이터 연결 |
| **5. 인플루언서 프로필 (조회)** | - (브랜드가 매칭 목록에서 선택 시) <br> - **Mock 인플루언서 정보** 표시: <br> _ 이름, 플랫폼, 팔로워 수, 니치 <br> _ 프로필 이미지 <br> \* 샘플 콘텐츠 이미지 (링크)          | Influencer       | 상세 활동 내역, 분석 데이터 없음               |
| **6. 인플루언서 대시보드**      | - **"참여 가능 캠페인 목록"** 표시 (Mock Data 기반) <br> - 캠페인 선택 시 상세 정보 조회                                                                                      | Campaign         | 필터링 기능 없음, 추천 로직 없음               |
| **7. 캠페인 상세 (인플루언서)** | - (인플루언서가 목록에서 선택 시) <br> - **Mock 캠페인 정보** 표시: <br> \* 캠페인 이름, 브랜드 이름, 설명, 플랫폼, 예산 범위 <br> - (선택) 간단 "지원하기" 버튼 (기능 X)     | Campaign, Brand  | 실제 지원/계약 프로세스 없음                   |
| **8. 기본 프로필 설정 (선택)**  | - (로그인 후 접근 가능) <br> - **(브랜드)** 회사명 <br> - **(인플루언서)** 활동명, 플랫폼, 팔로워 수, 니치 (Mock 데이터와 연동 또는 직접 입력 - MVP 범위 따라 결정)           | User, Influencer | 최소 정보만 표시/수정 가능                     |

## 4. Mock Data 예시 (JSON 형식)

**주의:** 실제 MVP 개발 시 필요한 모든 필드를 포함하도록 확장해야 합니다. 이미지 URL은 Placeholder 등을 사용합니다.

```json
{
  "users": [
    {
      "id": "brand001",
      "email": "brand1@example.com",
      "password": "password123", // 실제로는 해싱 처리
      "role": "brand",
      "profile": { "companyName": "뷰티코리아" }
    },
    {
      "id": "brand002",
      "email": "brand2@example.com",
      "password": "password123",
      "role": "brand",
      "profile": { "companyName": "푸드월드" }
    },
    {
      "id": "influencer001",
      "email": "influencer1@example.com",
      "password": "password123",
      "role": "influencer",
      "profileId": "infp001"
    },
    {
      "id": "influencer002",
      "email": "influencer2@example.com",
      "password": "password123",
      "role": "influencer",
      "profileId": "infp002"
    },
    {
      "id": "influencer003",
      "email": "influencer3@example.com",
      "password": "password123",
      "role": "influencer",
      "profileId": "infp003"
    }
  ],
  "influencerProfiles": [
    {
      "id": "infp001",
      "name": "뷰티스타☆",
      "platform": "Instagram",
      "followers": 55000,
      "niche": "Beauty",
      "profileImageUrl": "[https://via.placeholder.com/150/FF0000/FFFFFF?Text=Inf1](https://via.placeholder.com/150/FF0000/FFFFFF?Text=Inf1)",
      "sampleContentImageUrls": [
        "[https://via.placeholder.com/300/FF0000/FFFFFF?Text=Content1](https://via.placeholder.com/300/FF0000/FFFFFF?Text=Content1)",
        "[https://via.placeholder.com/300/FF0000/FFFFFF?Text=Content2](https://via.placeholder.com/300/FF0000/FFFFFF?Text=Content2)"
      ]
    },
    {
      "id": "infp002",
      "name": "먹방요정",
      "platform": "TikTok",
      "followers": 120000,
      "niche": "Food",
      "profileImageUrl": "[https://via.placeholder.com/150/00FF00/FFFFFF?Text=Inf2](https://via.placeholder.com/150/00FF00/FFFFFF?Text=Inf2)",
      "sampleContentImageUrls": [
        "[https://via.placeholder.com/300/00FF00/FFFFFF?Text=Content3](https://via.placeholder.com/300/00FF00/FFFFFF?Text=Content3)",
        "[https://via.placeholder.com/300/00FF00/FFFFFF?Text=Content4](https://via.placeholder.com/300/00FF00/FFFFFF?Text=Content4)"
      ]
    },
    {
      "id": "infp003",
      "name": "테크톡커",
      "platform": "TikTok",
      "followers": 80000,
      "niche": "Tech",
      "profileImageUrl": "[https://via.placeholder.com/150/0000FF/FFFFFF?Text=Inf3](https://via.placeholder.com/150/0000FF/FFFFFF?Text=Inf3)",
      "sampleContentImageUrls": [
        "[https://via.placeholder.com/300/0000FF/FFFFFF?Text=Content5](https://via.placeholder.com/300/0000FF/FFFFFF?Text=Content5)",
        "[https://via.placeholder.com/300/0000FF/FFFFFF?Text=Content6](https://via.placeholder.com/300/0000FF/FFFFFF?Text=Content6)"
      ]
    }
  ],
  "brands": [
    { "id": "brand001", "name": "뷰티코리아", "industry": "Beauty" },
    { "id": "brand002", "name": "푸드월드", "industry": "Food" }
  ],
  "campaigns": [
    {
      "id": "camp001",
      "brandId": "brand001",
      "brandName": "뷰티코리아",
      "campaignName": "신상 립스틱 홍보",
      "platform": "Instagram",
      "description": "새로 출시된 립스틱 라인의 인스타그램 피드 홍보",
      "budgetRange": "₩500,000 - ₩1,000,000",
      "status": "Open"
    },
    {
      "id": "camp002",
      "brandId": "brand002",
      "brandName": "푸드월드",
      "campaignName": "신제품 챌린지",
      "platform": "TikTok",
      "description": "신제품 과자를 활용한 틱톡 챌린지 영상 제작",
      "budgetRange": "₩1,000,000 - ₩2,000,000",
      "status": "Open"
    },
    {
      "id": "camp003",
      "brandId": "brand001",
      "brandName": "뷰티코리아",
      "campaignName": "여름 선크림 영상",
      "platform": "TikTok",
      "description": "여름 시즌 대비 선크림 사용법 틱톡 영상",
      "budgetRange": "₩700,000 - ₩1,500,000",
      "status": "Matching" // 브랜드가 생성 후 매칭 결과를 보는 단계 예시
    }
  ],
  "matches": {
    // 캠페인 ID : [매칭된 인플루언서 프로필 ID 배열] (Mock AI 결과)
    "camp003": ["infp001", "infp002"] // 예: 여름 선크림 캠페인에 뷰티/푸드 인플루언서 매칭 (임의)
  }
}
```
