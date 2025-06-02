"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import ResizableTextarea from "@/components/ResizableTextarea";
import Link from "next/link";
import api from "@/lib/api";

// Message type definition
interface Message {
  id: string;
  role: "user" | "ai" | "system";
  text: string;
  timestamp: Date;
  reasoning?: string; // Add reasoning field
}

function MessageItem({ message }: { message: Message }) {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] flex items-start gap-3 ${
          message.role === "user" ? "flex-row-reverse" : ""
        }`}
      >
        {message.role !== "system" && (
          <Avatar className="mt-1">
            {message.role === "user" ? (
              <>
                <AvatarImage src="/user-avatar.png" />
                <AvatarFallback>U</AvatarFallback>
              </>
            ) : (
              <>
                <AvatarImage src="/bot-avatar.svg" />
                <AvatarFallback>AI</AvatarFallback>
              </>
            )}
          </Avatar>
        )}
        <div
          className={`rounded-xl px-4 py-2 ${
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : message.role === "system"
              ? "bg-secondary text-secondary-foreground"
              : "bg-muted"
          }`}
        >
          <ReactMarkdown>{message.text}</ReactMarkdown>
          {/* Display reasoning if available */}
          {message.reasoning && (
            <div className="mt-2 p-2 bg-background/50 rounded-md">
              <p className="text-xs font-semibold mb-1">Reasoning:</p>
              <div className="text-xs">
                <ReactMarkdown>{message.reasoning}</ReactMarkdown>
              </div>
            </div>
          )}
          <p
            className={`text-xs mt-1 ${
              message.role === "user"
                ? "text-primary-foreground/70"
                : message.role === "system"
                ? "text-secondary-foreground/70"
                : "text-muted-foreground"
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InteractiveProposalPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Start session on mount
  useEffect(() => {
    api.post("/start_proposal").then((res) => {
      const data = res.data;
      setSessionId(data.session_id);
      setMessages([
        {
          id: Date.now().toString(),
          role: "ai",
          text: data.question,
          timestamp: new Date(),
        },
      ]);
    });
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !sessionId || isComplete) return;

    const userInput = input.trim();
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        text: userInput,
        timestamp: new Date(),
      },
    ]);
    setInput("");

    // Create a placeholder for the AI response
    const aiMessageId = Date.now().toString() + "-ai";
    setMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        role: "ai",
        text: "",
        timestamp: new Date(),
      },
    ]);

    try {
      const res = await api.post(
        `/continue_proposal/${sessionId}`,
        { response: userInput },
        { responseType: "stream" }
      );
      if (!res.data) {
        throw new Error("No response body");
      }
      // NOTE: Axios does not support streaming in the browser. If you need streaming, you must use fetch. Otherwise, you can use res.data as the full response.
      const aiResponse = res.data;
      let finalQuestion = aiResponse;
      let finalReason = "";
      const reasoningMatch = aiResponse.match(
        /\[REASONING\][ \t]*([\s\S]*?)\n{2,}([\s\S]*)/
      );
      if (reasoningMatch) {
        finalReason = reasoningMatch[1].trim();
        finalQuestion = reasoningMatch[2].trim();
      }
      const isCompleteResponse =
        finalQuestion.toLowerCase().includes("all done") ||
        finalQuestion.toLowerCase().includes("proposal generation complete");
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: finalQuestion,
                reasoning: finalReason,
              }
            : msg
        )
      );
      if (isCompleteResponse) {
        setIsComplete(true);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "-system",
            role: "system",
            text: "Proposal generation complete! Visit the preview page to review your proposal.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      // Handle error or log it if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-background z-50">
      <Card className="w-full h-full max-w-none max-h-none flex flex-col rounded-none border-none shadow-none">
        {/* Header */}
        <CardHeader className="border-b p-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/bot-avatar.svg" alt="Chatbot" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">Proposal Assistant</h2>
              <p className="text-xs text-muted-foreground">Online now</p>
            </div>
            <div className="ml-auto">
              <Link
                href={sessionId ? `/proposal/${sessionId}` : "#"}
                className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  isComplete
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                prefetch={false}
              >
                {isComplete ? "Review Proposal" : "Preview Unavailable"}
              </Link>
            </div>
          </div>
        </CardHeader>

        {/* Message List */}
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full w-full p-4 pb-12">
            <div className="space-y-4 min-h-full">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
              {/* Dummy div for scroll-to-bottom */}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      {!isComplete && (
        <InputArea
          input={input}
          setInput={setInput}
          loading={loading}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function InputArea({
  input,
  setInput,
  loading,
  handleSubmit,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  handleSubmit: (e?: React.FormEvent) => void;
}) {
  return (
    <div className="fixed left-1/2 bottom-8 -translate-x-1/2 bg-background/80 backdrop-blur border rounded-xl shadow-lg p-4 z-50 w-full max-w-2xl flex items-center">
      <form onSubmit={handleSubmit} className="flex w-full items-center">
        <div className="relative flex-1">
          <ResizableTextarea
            value={input}
            onChange={setInput}
            placeholder="Type your answer..."
            initialHeight={48}
            className="pr-12 bg-transparent border-none focus:border-none focus:ring-0 active:border-none active:ring-0 shadow-none outline-none focus:outline-none"
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={loading}
            name="proposal-input"
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
            className="absolute bottom-2 right-2 h-9 w-9 rounded-full p-2"
            aria-label="Send"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              className="text-white"
            >
              <path
                fill="currentColor"
                d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"
              />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
}
