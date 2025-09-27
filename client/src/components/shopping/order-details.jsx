import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const ShoppingOrderDetailsView = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);

  if (!orderDetails) return null;

  // Map order statuses to badge colors
  const statusColorMap = {
    confirmed: "bg-green-600",
    pending: "bg-yellow-500",
    inProcess: "bg-blue-500",
    inShipping: "bg-purple-500",
    delivered: "bg-teal-500",
    rejected: "bg-red-600",
  };

  const badgeColor = statusColorMap[orderDetails.orderStatus] || "bg-gray-500";

  return (
    <DialogContent className="fixed top-1/2 left-1/2 z-50 w-full max-w-4xl max-h-[90vh] overflow-auto -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg">
      <DialogHeader>
        <DialogTitle>Order Details</DialogTitle>
        <DialogDescription>
          Details for order #{orderDetails._id}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 mt-4">
        {/* Order Info */}
        <div className="grid gap-2">
          {[
            ["Order ID", orderDetails._id],
            ["Order Date", orderDetails.orderDate?.split("T")[0]],
            ["Order Price", `$${orderDetails.totalAmount}`],
            ["Payment Method", orderDetails.paymentMethod],
            ["Payment Status", orderDetails.paymentStatus],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center mt-2">
              <p className="font-medium">{label}</p>
              <Label>{value || "N/A"}</Label>
            </div>
          ))}

          <div className="flex justify-between items-center mt-2">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 rounded-full text-white ${badgeColor}`}
              >
                {orderDetails.orderStatus || "N/A"}
              </Badge>
            </Label>
          </div>
        </div>

        <Separator />

        {/* Cart Items */}
        <div className="grid gap-2">
          <div className="font-medium">Order Items</div>
          <ul className="grid gap-2">
            {orderDetails.cartItems?.map((item, idx) => (
              <li
                key={item.id || item._id || idx}
                className="flex justify-between"
              >
                <span>Title: {item.title}</span>
                <span>Quantity: {item.quantity}</span>
                <span>Price: ${item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Shipping Info */}
        <div className="grid gap-2">
          <div className="font-medium">Shipping Info</div>
          <div className="grid gap-0.5 text-muted-foreground">
            <span>User: {user?.userName}</span>
            <span>Address: {orderDetails.addressInfo?.address || "N/A"}</span>
            <span>City: {orderDetails.addressInfo?.city || "N/A"}</span>
            <span>Pincode: {orderDetails.addressInfo?.pincode || "N/A"}</span>
            <span>Phone: {orderDetails.addressInfo?.phone || "N/A"}</span>
            <span>Notes: {orderDetails.addressInfo?.notes || "N/A"}</span>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default ShoppingOrderDetailsView;
