import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import ReactStars from "react-stars";

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedRating, setEditedRating] = useState(0);

  const username = localStorage.getItem("username");

  const getAccessToken = () => localStorage.getItem("access");
  const getRefreshToken = () => localStorage.getItem("refresh");

  useEffect(() => {
    setFeedback("");
    setRating(0);
    setFeedbacks([]);
    setProduct(null);
    setLoading(true);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, feedbacksRes] = await Promise.all([
          api.get(`products/${id}/`),
          api.get(`feedbacks/?product=${id}`),
        ]);

        const normalizedFeedbacks = feedbacksRes.data.map((fb) => ({
          ...fb,
          user: typeof fb.user === "object" ? fb.user.username : fb.user,
        }));

        setProduct(productRes.data);
        setFeedbacks(normalizedFeedbacks);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location.key]);

  const refreshAuthToken = async () => {
    try {
      const res = await api.post("token/refresh/", {
        refresh: getRefreshToken(),
      });
      localStorage.setItem("access", res.data.access);
      return res.data.access;
    } catch (err) {
      localStorage.clear(); // Clear local storage on token refresh failure
      window.location.href = "/login"; // Redirect to login
      toast.error("Session expired. Please log in again.");
      throw err;
    }
  };

  const handleSubmitFeedback = async () => {
    if (!product || !feedback.trim() || rating < 1 || rating > 5) {
      toast.error("Please provide valid feedback and a rating (1-5).");
      return;
    }
    const token = localStorage.getItem("access");
    if (!token) {
        toast.error("You must be logged in to submit feedback.");
        return;
    }

    let currentToken = getAccessToken();
    let retryCount = 0;

    while (retryCount < 2) {
      try {
        setSubmitting(true);
        const payload = {
          product: product.id,
          content: feedback.trim(),
          rating: Math.round(rating * 2) / 2,
        };

        const res = await api.post("feedbacks/", payload, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        const newFeedback = {
          ...res.data,
          user: username, // Use the username from local storage for display
        };

        setFeedbacks((prev) => [newFeedback, ...prev]);
        setFeedback("");
        setRating(0);
        toast.success("Feedback submitted!");
        return;
      } catch (err) {
        if (err.response?.status === 401 && retryCount === 0) {
          currentToken = await refreshAuthToken();
          retryCount++;
          continue;
        }
        console.error("Feedback submit error:", err);
        toast.error("Failed to submit feedback");
        return;
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleEdit = (feedbackItem) => {
    setEditingFeedback(feedbackItem.id);
    setEditedContent(feedbackItem.content);
    setEditedRating(feedbackItem.rating);
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim() || editedRating < 1 || editedRating > 5) {
      toast.error("Feedback content and rating are required.");
      return;
    }

    let currentToken = getAccessToken();
    let retryCount = 0;

    while (retryCount < 2) {
      try {
        setSubmitting(true);
        const payload = {
          content: editedContent.trim(),
          rating: Math.round(editedRating * 2) / 2,
        };

        const res = await api.patch(`feedbacks/${editingFeedback}/`, payload, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        setFeedbacks((prev) =>
          prev.map((fb) =>
            fb.id === editingFeedback
              ? { ...fb, content: res.data.content, rating: res.data.rating }
              : fb
          )
        );
        setEditingFeedback(null);
        setEditedContent("");
        setEditedRating(0);
        toast.success("Feedback updated!");
        return;
      } catch (err) {
        if (err.response?.status === 401 && retryCount === 0) {
          currentToken = await refreshAuthToken();
          retryCount++;
          continue;
        }
        console.error("Feedback update error:", err);
        toast.error(err.response?.data?.detail || "Failed to update feedback");
        return;
      ;
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingFeedback(null);
    setEditedContent("");
    setEditedRating(0);
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return; // Consider replacing window.confirm with a custom modal for better UX

    let currentToken = getAccessToken();
    let retryCount = 0;

    while (retryCount < 2) {
      try {
        setDeletingId(feedbackId);
        await api.delete(`feedbacks/${feedbackId}/`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        setFeedbacks((prev) => prev.filter((fb) => fb.id !== feedbackId));
        toast.success("Feedback deleted");
        return;
      } catch (err) {
        if (err.response?.status === 401 && retryCount === 0) {
          currentToken = await refreshAuthToken();
          retryCount++;
          continue;
        }
        const errMsg =
          err.response?.status === 403
            ? "You can only delete your own feedback"
            : "Failed to delete feedback";
        console.error("Delete error:", err);
        toast.error(errMsg);
        return;
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
      });
      toast.success(`${product.name} added to cart`);
    }
  };

  if (loading) {
    return (
      // Loading state also uses background and foreground colors
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      // Product not found state also uses background and foreground colors
      <div className="flex flex-col justify-center items-center h-screen bg-background text-foreground">
        <h1 className="text-xl font-bold text-destructive">Product not found</h1> {/* Explicit red for error */}
        <Link to="/" className="text-primary mt-4 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    // Main container uses background and foreground colors
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="bottom-center" />
      {/* Header uses card background and foreground text, with border */}
      <header className="bg-card text-card-foreground py-4 px-6 shadow border-b border-border">
        <div className="max-w-6xl mx-auto">
          {/* Link uses primary text color */}
          <Link to="/" className="text-primary hover:text-primary-foreground font-medium inline-flex items-center">
            <ArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto py-8">
        <div className="flex gap-8">
          <div className="flex-shrink-0">
            {/* Image styling remains */}
            <img className="w-192 h-72 object-cover rounded-lg" src={product.image} alt={product.name} />
          </div>
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
            <p className="text-xl font-semibold text-muted-foreground mt-2">${product.price}</p>
            {/* Add to Cart button uses primary colors */}
            <Button onClick={handleAddToCart} className="mt-4 w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-foreground">Submit Your Feedback</h2>
          <div className="mt-4">
            <ReactStars count={5} value={rating} size={24} onChange={setRating} color2="#ffd700" className="mb-4" />
            {/* Textarea uses input semantic colors */}
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border border-input rounded-md px-3 py-2 mb-3 bg-background text-foreground placeholder:text-muted-foreground"
              rows={3}
              placeholder="Write your feedback..."
            />
            {/* Submit Feedback button uses primary colors */}
            <Button onClick={handleSubmitFeedback} disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-foreground">Feedback</h2>
          <div>
            {feedbacks.length === 0 && <p className="text-muted-foreground">No feedback yet. Be the first to review this product!</p>}
            {feedbacks.map((fb) => (
              // Feedback item borders and text colors adjusted
              <div key={fb.id} className="border-b border-border pb-4 last:border-none last:pb-0 pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <ReactStars count={5} value={fb.rating} size={18} edit={false} color2="#ffd700" />
                      <span className="ml-2 text-sm text-muted-foreground">
                        {new Date(fb.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {editingFeedback === fb.id ? (
                      <div>
                        <ReactStars
                          count={5}
                          value={editedRating}
                          size={24}
                          onChange={setEditedRating}
                          color2="#ffd700"
                          className="mb-4"
                        />
                        {/* Edited textarea uses input semantic colors */}
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full border border-input rounded-md px-3 py-2 mb-3 bg-background text-foreground placeholder:text-muted-foreground"
                          rows={3}
                          placeholder="Edit your feedback..."
                        />
                        <div className="flex gap-2 mt-1">
                          <Button onClick={handleSaveEdit} className="bg-primary text-primary-foreground hover:bg-primary/90">Save</Button>
                          <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-foreground">{fb.content}</p>
                        <p className="text-sm text-muted-foreground">By: {fb.user}</p>
                      </>
                    )}
                  </div>

                  {fb.user === username && editingFeedback !== fb.id && (
                    <div className="flex gap-2 mt-1">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(fb)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive" // Use destructive variant for delete
                        size="sm"
                        onClick={() => handleDeleteFeedback(fb.id)}
                        disabled={deletingId === fb.id}
                      >
                        {deletingId === fb.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
