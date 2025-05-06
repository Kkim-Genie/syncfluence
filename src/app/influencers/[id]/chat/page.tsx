"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuthStore } from "@/lib/store";
import { mockData } from "@/lib/mockData";
import { Milestone } from "@/lib/mockData";
import Image from "next/image";

// Extend the EscrowTransaction type to include 'paid' status
type EscrowTransactionStatus =
  | "pending"
  | "completed"
  | "in_progress"
  | "released"
  | "refunded"
  | "disputed"
  | "paid";

type EscrowTransaction = {
  id: string;
  campaignId: string;
  contractId: string;
  influencerId: string;
  brandId: string;
  amount: string;
  status: EscrowTransactionStatus;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
};

export default function InfluencerChat() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { user } = useAuthStore();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{
      sender: "user" | "influencer";
      text: string;
      timestamp: Date;
      isContract?: boolean;
      contractDetails?: {
        campaignName: string;
        startDate: string;
        endDate: string;
        compensation: string;
        deliverables: string;
      };
      isContractAccepted?: boolean;
      contractId?: string;
    }>
  >([]);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [showEscrowStatusModal, setShowEscrowStatusModal] = useState(false);
  const [contractDetails, setContractDetails] = useState({
    campaignName: "",
    startDate: "",
    endDate: "",
    compensation: "",
    deliverables: "",
  });
  const [currentContractId, setCurrentContractId] = useState<string | null>(
    null
  );
  const [milestones, setMilestones] = useState<Array<Omit<Milestone, "id">>>([
    { description: "", dueDate: "", status: "pending" },
  ]);
  const [activeEscrowTransactions, setActiveEscrowTransactions] = useState<
    EscrowTransaction[]
  >([]);

  // Find influencer profile by ID
  const influencer = mockData.influencerProfiles.find(
    (profile) => profile.id === id
  );

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }

    // Simulate fetching escrow transactions
    // In a real app, you would fetch this from your API
    const mockEscrowTransactions: EscrowTransaction[] =
      mockData.escrowTransactions.filter(
        (transaction) =>
          transaction.influencerId === id && transaction.brandId === user?.id
      );

    // Add a completed escrow transaction
    const completedEscrow: EscrowTransaction = {
      id: "escrow003",
      campaignId: "camp003",
      contractId: "contract003",
      influencerId: id,
      brandId: user?.id || "",
      amount: "₩2,500,000",
      status: "paid",
      milestones: [
        {
          id: "milestone007",
          description: "인스타그램 포스트 1개 업로드",
          dueDate: "2023-11-15",
          status: "completed",
        },
        {
          id: "milestone008",
          description: "유튜브 쇼츠 영상 2개 업로드",
          dueDate: "2023-11-30",
          status: "completed",
        },
      ],
      createdAt: "2023-11-01T09:00:00Z",
      updatedAt: "2023-12-05T14:30:00Z",
    };

    // Add another escrow transaction with 'completed' status

    setActiveEscrowTransactions([...mockEscrowTransactions, completedEscrow]);
  }, [user, router, id]);

  // Scroll to bottom on new messages - this runs after browser paint
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // This runs synchronously after DOM mutations but before browser paint
  useLayoutEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });

      // Fallback scrolling for some browsers
      setTimeout(() => {
        const chatContainer = document.getElementById(
          "chat-messages-container"
        );
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      sender: "user" as const,
      text: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Prepare messages array for API
      const apiMessages = messages.map((msg) => {
        // For contract messages, add special formatting so AI understands it's a contract
        if (msg.isContract) {
          return {
            role: msg.sender === "user" ? "user" : "assistant",
            content: `[계약서 전송] 다음은 캠페인 계약서입니다:\n캠페인: ${msg.contractDetails?.campaignName}\n기간: ${msg.contractDetails?.startDate} ~ ${msg.contractDetails?.endDate}\n보상: ${msg.contractDetails?.compensation}\n결과물: ${msg.contractDetails?.deliverables}`,
          };
        }

        return {
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        };
      });

      // Make API call to OpenAI
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are ${influencer?.name}, a ${
                influencer?.platform
              } influencer specializing in ${
                influencer?.niche
              } with ${influencer?.followers.toLocaleString()} followers. Respond as if you are this influencer, maintaining a professional yet friendly tone. Include occasional references to your content, collaborations, or experience in ${
                influencer?.niche
              }. Keep responses concise and conversational. 그리고 대답은 오직 한국말로만 해야해. 그리고 너는 인플루언서인 만큼 꼭 필요한 것만 질문해. 꾸밈말(예. 어떤 고민이 있나요? 좋은 하루입니다, 어떤 팁이 필요하시나요?)는 생략해줘. 
              
              특별 지시사항: 계약서를 받으면, 계약서의 내용을 요약하고 이에 대한 의견을 간단히 제시해주세요. 예를 들어 금액, 기간, 결과물에 대한 의견이나 질문을 할 수 있습니다.`,
            },
            ...apiMessages,
            { role: "user", content: message },
          ],
        }),
      });

      const data = await response.json();

      // Simulate contract acceptance if the message contains acceptance language
      const responseText = data.message;
      const isAcceptingContract =
        message.toLowerCase().includes("계약") &&
        (responseText.includes("수락") ||
          responseText.includes("동의") ||
          responseText.includes("좋습니다") ||
          responseText.includes("계약 체결"));

      // Add influencer's response
      setMessages((prev) => [
        ...prev,
        {
          sender: "influencer",
          text: data.message,
          timestamp: new Date(),
          isContractAccepted: isAcceptingContract,
        },
      ]);

      // If influencer is accepting a contract, automatically generate a contract ID for later use
      if (isAcceptingContract) {
        const lastContractMsg = [...messages]
          .reverse()
          .find((m) => m.isContract);
        if (lastContractMsg?.contractDetails) {
          const newContractId = `contract${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")}`;
          setCurrentContractId(newContractId);

          // Create milestones based on deliverables
          const deliverablesList =
            lastContractMsg.contractDetails.deliverables.split(",");
          const startDate = new Date(lastContractMsg.contractDetails.startDate);
          const endDate = new Date(lastContractMsg.contractDetails.endDate);
          const dateDiff = Math.floor(
            (endDate.getTime() - startDate.getTime()) / deliverablesList.length
          );

          const newMilestones = deliverablesList.map((deliverable, index) => {
            const milestoneDate = new Date(
              startDate.getTime() + dateDiff * index
            );
            return {
              description: deliverable.trim(),
              dueDate: milestoneDate.toISOString().split("T")[0],
              status: "pending" as const,
            };
          });

          setMilestones(newMilestones);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          sender: "influencer",
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create contract message
    const contractText = `캠페인 계약서: ${contractDetails.campaignName}\n\n기간: ${contractDetails.startDate} ~ ${contractDetails.endDate}\n보상: ${contractDetails.compensation}\n결과물: ${contractDetails.deliverables}`;

    // Create a new contract ID
    const newContractId = `contract${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;
    setCurrentContractId(newContractId);

    // Add contract message to chat
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: contractText,
        timestamp: new Date(),
        isContract: true,
        contractDetails: { ...contractDetails },
        contractId: newContractId,
      },
    ]);

    // Close modal and reset form
    setShowContractModal(false);
    setContractDetails({
      campaignName: "",
      startDate: "",
      endDate: "",
      compensation: "",
      deliverables: "",
    });
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { description: "", dueDate: "", status: "pending" },
    ]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (
    index: number,
    field: keyof Omit<Milestone, "id">,
    value: string
  ) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setMilestones(updatedMilestones);
  };

  const handleEscrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Find the contract details from messages
    const contractMsg = messages.find(
      (msg) => msg.contractId === currentContractId
    );

    if (!contractMsg?.contractDetails || !user) return;

    // Create an escrow transaction
    const newEscrowId = `escrow${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;

    const newEscrowTransaction: EscrowTransaction = {
      id: newEscrowId,
      campaignId: `camp${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      contractId: currentContractId || "",
      influencerId: id,
      brandId: user.id,
      amount: contractMsg.contractDetails.compensation,
      status: "in_progress",
      milestones: milestones.map((milestone) => ({
        id: `milestone${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        ...milestone,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, you would save this to a database
    // For the mock, we'll just alert that it was created
    alert(`에스크로 거래가 생성되었습니다! 거래 ID: ${newEscrowId}`);

    // Add message about escrow creation
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: `에스크로 거래가 생성되었습니다.\n\n금액: ${newEscrowTransaction.amount}\n마일스톤: ${newEscrowTransaction.milestones.length}개\n\n에스크로 ID: ${newEscrowId}`,
        timestamp: new Date(),
      },
    ]);

    // Close modal
    setShowEscrowModal(false);
    setCurrentContractId(null);
  };

  const handleCreateEscrow = (contractId: string) => {
    setCurrentContractId(contractId);
    setShowEscrowModal(true);
  };

  if (!influencer || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/influencers/${id}`}
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
            Back to Profile
          </Link>
          <div className="flex items-center">
            <div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={influencer.profileImageUrl}
                alt={influencer.name}
                className="h-full w-full object-cover"
                width={64}
                height={64}
              />
            </div>
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Chat with {influencer.name}
              </h1>
              <button
                onClick={() => setShowEscrowStatusModal(true)}
                className="ml-2 text-primary-500 hover:text-primary-600"
                title="View Escrow Status"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </button>
              <p className="text-sm text-gray-600 ml-2">
                {influencer.platform} • {influencer.niche}
              </p>
            </div>
          </div>
        </div>

        <Card className="flex h-[70vh] flex-col">
          {/* Chat messages */}
          <div
            className="flex-1 overflow-y-auto p-4 scroll-smooth"
            id="chat-messages-container"
          >
            <div className="space-y-4 min-h-full flex flex-col justify-end">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      msg.sender === "user"
                        ? msg.isContract
                          ? "bg-yellow-100 text-gray-800 border border-yellow-300"
                          : "bg-primary-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.isContract ? (
                      <div>
                        <p className="font-bold mb-1">📝 캠페인 계약서</p>
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            className="text-xs bg-primary-500 text-white py-1 px-2 rounded hover:bg-primary-600"
                            onClick={() =>
                              alert("계약서가 다운로드되었습니다.")
                            }
                          >
                            계약서 다운로드
                          </button>
                          <button
                            className="text-xs bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                            onClick={() =>
                              handleCreateEscrow(msg.contractId || "")
                            }
                          >
                            에스크로 생성
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p>{msg.text}</p>
                        {msg.isContractAccepted && (
                          <div className="mt-2">
                            <button
                              className="text-xs bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                              onClick={() => {
                                const contractMsg = [...messages]
                                  .reverse()
                                  .find((m) => m.isContract);
                                if (contractMsg?.contractId) {
                                  handleCreateEscrow(contractMsg.contractId);
                                }
                              }}
                            >
                              에스크로 생성
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="mt-1 text-xs opacity-70">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] rounded-lg bg-gray-100 px-4 py-2 text-gray-800">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowContractModal(true)}
                disabled={isLoading}
              >
                📝 계약서
              </Button>
              <Button type="submit" disabled={isLoading || !message.trim()}>
                Send
              </Button>
            </form>
          </div>
        </Card>

        {/* Contract Modal */}
        {showContractModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowContractModal(false)}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-xl font-bold mb-4">캠페인 계약서 작성</h3>
              <form onSubmit={handleContractSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    캠페인 이름
                  </label>
                  <input
                    type="text"
                    value={contractDetails.campaignName}
                    onChange={(e) =>
                      setContractDetails({
                        ...contractDetails,
                        campaignName: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      시작일
                    </label>
                    <input
                      type="date"
                      value={contractDetails.startDate}
                      onChange={(e) =>
                        setContractDetails({
                          ...contractDetails,
                          startDate: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      종료일
                    </label>
                    <input
                      type="date"
                      value={contractDetails.endDate}
                      onChange={(e) =>
                        setContractDetails({
                          ...contractDetails,
                          endDate: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    보상
                  </label>
                  <input
                    type="text"
                    value={contractDetails.compensation}
                    onChange={(e) =>
                      setContractDetails({
                        ...contractDetails,
                        compensation: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="예: ₩1,000,000"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    결과물
                  </label>
                  <textarea
                    value={contractDetails.deliverables}
                    onChange={(e) =>
                      setContractDetails({
                        ...contractDetails,
                        deliverables: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 min-h-[100px]"
                    placeholder="예: 인스타그램 포스트 2개, 스토리 3개"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContractModal(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit">계약서 보내기</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Escrow Modal */}
        {showEscrowModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowEscrowModal(false)}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
              <h3 className="text-xl font-bold mb-4">에스크로 생성</h3>
              <p className="mb-4 text-gray-600">
                에스크로 서비스를 통해 안전하게 결제를 진행할 수 있습니다.
                계약서에 명시된 결과물에 따라 마일스톤을 설정하세요.
              </p>
              <form onSubmit={handleEscrowSubmit}>
                <div className="mb-4">
                  <h4 className="font-medium text-lg mb-2">마일스톤 설정</h4>
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">마일스톤 #{index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={milestones.length === 1}
                        >
                          삭제
                        </button>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          설명
                        </label>
                        <input
                          type="text"
                          value={milestone.description}
                          onChange={(e) =>
                            updateMilestone(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2"
                          placeholder="예: 인스타그램 포스트 1개 업로드"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          마감일
                        </label>
                        <input
                          type="date"
                          value={milestone.dueDate}
                          onChange={(e) =>
                            updateMilestone(index, "dueDate", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2"
                          required
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="mt-2 w-full py-2 px-4 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    + 마일스톤 추가
                  </button>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEscrowModal(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit">에스크로 생성</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Escrow Status Modal */}
        {showEscrowStatusModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowEscrowStatusModal(false)}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[80vh] overflow-auto">
              <h3 className="text-xl font-bold mb-4">에스크로 진행 상태</h3>

              {activeEscrowTransactions.length > 0 ? (
                <div className="space-y-4">
                  {activeEscrowTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">
                          에스크로 ID: {transaction.id}
                        </h4>
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 text-sm rounded-full ${
                              transaction.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : transaction.status === "completed"
                                ? "bg-yellow-100 text-yellow-800"
                                : transaction.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {transaction.status === "paid"
                              ? "지급 완료"
                              : transaction.status === "completed"
                              ? "완료"
                              : transaction.status === "in_progress"
                              ? "진행 중"
                              : "대기 중"}
                          </span>
                          {transaction.status === "completed" && (
                            <button
                              className="ml-2 px-2 py-1 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600"
                              onClick={() => {
                                // In a real app, this would trigger a payment process
                                alert(
                                  `${transaction.id}에 대한 지급을 시작합니다.`
                                );
                              }}
                            >
                              지급하기
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">
                        금액: {transaction.amount}
                      </p>
                      <p className="font-medium mt-4 mb-2">
                        마일스톤 진행 상태:
                      </p>
                      <div className="space-y-2">
                        {transaction.milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                          >
                            <div>
                              <p className="font-medium">
                                {milestone.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                마감일: {milestone.dueDate}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                milestone.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : milestone.status === "pending"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {milestone.status === "completed"
                                ? "완료"
                                : milestone.status === "pending"
                                ? "대기 중"
                                : "진행 중"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    진행 중인 에스크로 거래가 없습니다.
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  type="button"
                  onClick={() => setShowEscrowStatusModal(false)}
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
          <p>
            <strong>Note:</strong> This is a simulated conversation powered by
            AI. Real influencer responses may vary.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
