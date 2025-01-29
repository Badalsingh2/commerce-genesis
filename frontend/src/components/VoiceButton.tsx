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
      type="button"
      variant="secondary"
      className={cn(
        "relative h-14 md:h-16 aspect-square rounded-xl transition-all duration-300",
        "bg-white/90 backdrop-blur-sm dark:bg-slate-900/90",
        "hover:bg-sky-50 dark:hover:bg-sky-900/50",
        "border border-sky-200 dark:border-sky-800/50",
        "shadow-lg shadow-sky-200/30 dark:shadow-sky-900/30",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400",
        "focus-visible:border-sky-500 dark:focus-visible:border-sky-400",
        isRecording && "animate-pulse border-red-400 dark:border-red-600"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onToggleRecording();
      }}
    >
      <Mic className={cn(
        "h-6 w-6 transition-colors duration-300",
        isRecording
          ? "text-red-500 dark:text-red-400"
          : "text-sky-600 dark:text-sky-400"
      )} />
      <span className="sr-only">
        {isRecording ? "Stop" : "Start"} voice input
      </span>
    </Button>
  );
}
