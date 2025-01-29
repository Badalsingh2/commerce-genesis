import { Roles } from "@/types/globals";
import { clsx, type ClassValue } from "clsx"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkRole = async (role: Roles) => {
  const response = await fetch('/api/check-role');
  const data = await response.json();
  return data.role === role;
}

export const setRole = async (role: Roles, userId: string) => {
  const response = await fetch('/api/set-role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, role }),
  });
  const data = await response.json();
  return data;
}

export const getRole = async () => {
  const response = await fetch('/api/check-role');
  const data = await response.json();
  return data.role;
}

interface UseVoiceRecognitionProps {
  onTranscript: (transcript: string) => void;
}

export function useVoiceRecognition({ onTranscript }: UseVoiceRecognitionProps) {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);

  const startVoiceRecognition = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        router.push("/search?q=" + encodeURIComponent(transcript));
        stopVoiceRecognition();
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        stopVoiceRecognition();
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setIsRecording(true);
    } else {
      console.error("Speech recognition not supported");
    }
  };

  const stopVoiceRecognition = () => {
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startVoiceRecognition();
    } else {
      stopVoiceRecognition();
    }
  };

  return {
    isRecording,
    toggleRecording
  };
}
