import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Review {
  id: number
  user: string
  rating: number
  comment: string
  date: string
}

//async function getReviews(productId: string): Promise<Review[]> {
//  const res = await fetch(`https://api.example.com/products/${productId}/reviews`)
//  if (!res.ok) throw new Error("Failed to fetch reviews")
//  return res.json()
//}

function getReviews(productId: string): Review[] {
  return [
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      comment: "This phone is amazing! The camera quality is outstanding and the battery life is impressive.",
      date: "2023-06-15",
    },
    {
      id: 2,
      user: "Jane Smith",
      rating: 4,
      comment: "Great phone overall. The only downside is that it's a bit heavy.",
      date: "2023-06-10",
    },
    {
      id: 3,
      user: "Mike Johnson",
      rating: 3,
      comment: "It's okay. I expected more features for the price.",
      date: "2023-06-05",
    },
  ]
}

export default function Reviews({ productId }: { productId: string }) {
  const reviews = getReviews(productId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.map((review) => (
          <div key={review.id} className="mb-6 last:mb-0">
            <div className="flex items-center mb-2">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${review.user}`} />
                <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{review.user}</p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

