import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: { [key: number]: number }
}

function getReviewSummary(productId: string): ReviewSummary {
  return {
    averageRating: 4.3,
    totalReviews: 127,
    ratingDistribution: {
      5: 70,
      4: 40,
      3: 10,
      2: 5,
      1: 2,
    },
  }
}

export default function ReviewSummary({ productId }: { productId: string }) {
  const summary = getReviewSummary(productId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <span className="text-4xl font-bold mr-2">{summary.averageRating.toFixed(1)}</span>
          <div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(summary.averageRating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{summary.totalReviews} reviews</p>
          </div>
        </div>
        {Object.entries(summary.ratingDistribution)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([rating, count]) => (
            <div key={rating} className="flex items-center mb-2">
              <span className="w-8 text-sm font-medium">{rating} star</span>
              <Progress value={(count / summary.totalReviews) * 100} className="h-2 mx-2 flex-grow" />
              <span className="w-8 text-sm text-muted-foreground text-right">
                {((count / summary.totalReviews) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}

