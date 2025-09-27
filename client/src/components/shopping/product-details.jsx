import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const ProductDetailsDialog = ({ open, setOpen, productDetails }) => {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const handleRatingChange = (getRating) => setRating(getRating);

  const handleAddToCart = (productId, totalStock) => {
    let currentCartItems = cartItems.items || [];
    const cartIndex = currentCartItems.findIndex(
      (item) => item.productId === productId
    );

    if (cartIndex > -1) {
      const quantity = currentCartItems[cartIndex].quantity;
      if (quantity + 1 > totalStock) {
        toast.error(`Only ${quantity} quantity can be added for this item`);
        return;
      }
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast.success("Product is added to cart");
        }
      }
    );
  };

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  };

  const handleAddReview = async () => {
    if (!reviewMsg.trim()) return;

    try {
      const response = await dispatch(
        addReview({
          productId: productDetails?._id,
          userId: user?.id,
          userName: user?.userName,
          reviewMessage: reviewMsg,
          reviewValue: rating,
        })
      );

      if (response?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast.success("Review added successfully!");
      } else {
        toast.error(
          response?.payload?.message ||
            "Failed to add review. You may not be authorized."
        );
      }
    } catch (err) {
      toast.error("Something went wrong while adding review");
      console.error(err);
    }
  };

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:p-4 md:p-6 lg:p-10 max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw] overflow-y-auto max-h-[90vh]">
        {/* Accessible DialogTitle */}
        <DialogTitle className="sr-only">
          {productDetails?.title || "Product Details"}
        </DialogTitle>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* left: Product Image */}
          <div className="flex justify-center items-start w-full">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="w-full h-auto max-h-[60vh] sm:max-h-[50vh] md:max-h-[70vh] lg:max-h-[550px] object-contain rounded-xl shadow-md bg-muted p-3"
            />
          </div>

          {/* right: Product Details */}
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[80vh] pr-2">
            {/* Title & Description */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
                {productDetails?.title}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-h-[120px] sm:max-h-[150px] overflow-auto">
                {productDetails?.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <p
                className={`text-2xl sm:text-3xl font-bold ${
                  productDetails?.salePrice > 0
                    ? "line-through text-muted-foreground"
                    : "text-primary"
                }`}
              >
                ${productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 && (
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  ${productDetails?.salePrice}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRatingComponent rating={averageReview} />
              <span className="text-muted-foreground text-sm">
                ({averageReview.toFixed(2)})
              </span>
            </div>

            {/* Add to Cart */}
            <div>
              {productDetails?.totalStock === 0 ? (
                <Button
                  className="w-full opacity-60 cursor-not-allowed"
                  disabled
                >
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>

            <Separator />

            {/* Reviews */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-3">
                Customer Reviews
              </h2>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-4 max-h-[200px] overflow-auto pr-2">
                  {reviews.map((reviewItem, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-3 rounded-lg border bg-muted/40"
                    >
                      <Avatar className="w-10 h-10 border">
                        <AvatarFallback>
                          {reviewItem?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {reviewItem?.userName}
                          </h3>
                          <StarRatingComponent
                            rating={reviewItem?.reviewValue}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground leading-snug">
                          {reviewItem.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No Reviews yet.</p>
              )}
            </div>

            {/* Write a Review */}
            <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <Label className="text-sm font-medium">Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Share your thoughts..."
              />
              <Button
                className="w-full"
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
