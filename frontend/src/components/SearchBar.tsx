"use client";
import { CameraIcon, SearchIcon, Voicemail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CameraComponent from "./CameraComponent";
import { VoiceInput } from "./VoiceButton";
import { useVoiceRecognition } from "@/lib/utils";

export default function SearchBar() {
  const urlQuery = useSearchParams().get("q");
  const [query, setQuery] = useState(urlQuery || "");
  const router = useRouter();

  const { isRecording, toggleRecording } = useVoiceRecognition({
    onTranscript: setQuery,
  });

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full py-4">
      <div className="relative flex items-center w-full">
        {/* Search Icon Button Inside Input */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 w-11 h-11 rounded-md border-none bg-transparent hover:bg-transparent"
        >
          <SearchIcon strokeWidth={3} className="h-5 w-5 text-primary" />
        </Button>
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="py-5 pl-10 pr-14 rounded-md border-primary"
        />

        {/* Camera Button (Fixed Square Shape) */}
        <VoiceInput
          isRecording={isRecording}
          onToggleRecording={toggleRecording}
        />
        <CameraComponent />
      </div>
    </div>
  );
}

