import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface VoiceInputProps {
  isRecording: boolean;
  onToggleRecording: () => void;
}

export function VoiceInput({ isRecording, onToggleRecording }: VoiceInputProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute w-11 h-11 right-14 rounded-md border-none bg-transparent hover:bg-transparent"
      onClick={(e) => {
        e.stopPropagation();
        onToggleRecording();
      }}
    >
      <Mic
        className={cn(
          "h-5 w-5 transition-colors duration-300",
          isRecording ? "text-red-500 dark:text-red-400" : "text-primary"
        )}
      />
      <span className="sr-only">{isRecording ? "Stop" : "Start"} voice input</span>
    </Button>
  );
}
