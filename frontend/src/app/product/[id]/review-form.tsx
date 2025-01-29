"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    const { toast } = useToast()
    e.preventDefault()
    try {
      const response = await fetch(`https://api.example.com/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit review")
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })

      setRating(0)
      setComment("")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Your Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)} className="mr-1">
              <Star className={`w-6 h-6 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Your Review
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Write your review here..."
          required
        />
      </div>
      <Button type="submit" disabled={rating === 0 || comment.trim() === ""}>
        Submit Review
      </Button>
    </form>
  )
}

