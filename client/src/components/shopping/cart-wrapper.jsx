import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

const UserCartWrapper = ({ cartItems, setOpenCartSheet }) => {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
      {/* Header */}
      <SheetHeader className="border-b pb-4">
        <SheetTitle className="text-xl font-bold">Your Cart</SheetTitle>
      </SheetHeader>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 px-2">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent key={item.productId} cartItem={item} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-10">
            <p className="text-lg mb-4">Your cart is empty 🛒</p>
            <Button
              onClick={() => {
                navigate("/shop/home");
                setOpenCartSheet(false);
              }}
              variant="outline"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      {cartItems && cartItems.length > 0 && (
        <div className="mt-4 border-t pt-4 px-2 bg-background sticky bottom-0 shadow-md">
          <div className="flex justify-between items-center text-lg font-semibold mb-3">
            <span>Total:</span>
            <span>{formatCurrency(totalCartAmount)}</span>
          </div>
          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full text-lg py-3 mb-2"
          >
            Checkout
          </Button>
        </div>
      )}
    </SheetContent>
  );
};

export default UserCartWrapper;
