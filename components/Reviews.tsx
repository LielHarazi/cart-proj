"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getReviews, addReview } from "@/app/actions";

interface User {
  id: number;
  username: string;
  email: string;
}

interface ReviewsProps {
  productId: number;
  currentUser: User | null;
  onSignInClick: () => void;
}

export default function Reviews({
  productId,
  currentUser,
  onSignInClick,
}: ReviewsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [loaded, setLoaded] = useState(false);

  async function toggleReviews() {
    if (!isOpen && !loaded) {
      const productReviews = await getReviews(productId);
      setReviews(productReviews);
      setLoaded(true);
    }
    setIsOpen(!isOpen);
  }

  async function handleAddReview() {
    if (!currentUser) {
      onSignInClick();
      return;
    }

    if (!newReview.comment.trim()) return;

    await addReview({
      product_id: productId,
      rating: newReview.rating,
      comment: newReview.comment,
    });

    const productReviews = await getReviews(productId);
    setReviews(productReviews);
    setNewReview({ rating: 5, comment: "" });
  }

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleReviews}
        className="w-full"
      >
        {isOpen ? "Hide Reviews" : "Show Reviews"}
      </Button>

      {isOpen && (
        <div className="mt-4 border-t pt-4">
          {/* Add Review Form */}
          {currentUser && (
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <h4 className="font-semibold mb-2">Add Your Review</h4>
              <div className="flex items-center gap-2 mb-2">
                <span>Rating:</span>
                <select
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      rating: Number(e.target.value),
                    }))
                  }
                  className="border rounded px-2 py-1"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {"⭐".repeat(num)}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                placeholder="Write your review..."
                className="w-full border rounded px-2 py-1 mb-2"
                rows={3}
              />
              <Button
                size="sm"
                onClick={handleAddReview}
                disabled={!newReview.comment.trim()}
              >
                Submit Review
              </Button>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-2">
            {reviews.length > 0 ? (
              reviews.map((review: any) => (
                <div key={review.id} className="p-2 bg-gray-50 rounded">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">
                      {review.username}
                    </span>
                    <span className="text-sm">
                      {"⭐".repeat(review.rating)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
