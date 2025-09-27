import { useState } from "react";
import CommonForm from "../common/form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "sonner";

const initialFormData = { status: "" };

const AdminOrderDetailsView = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();

  if (!orderDetails) return null; 

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!formData.status) {
      toast.error("Please select a status");
      return;
    }

    dispatch(
      updateOrderStatus({ id: orderDetails._id, orderStatus: formData.status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast.success(data?.payload?.message);
      }
    });
  };

  return (
    <DialogContent className="fixed top-1/2 left-1/2 z-50 w-full max-w-4xl max-h-[90vh] overflow-auto -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg">
      <DialogHeader>
        <DialogTitle>Order Details</DialogTitle>
        <DialogDescription>
          Admin view for order #{orderDetails._id}
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
                className={`py-1 px-3 rounded-full text-white ${
                  orderDetails.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails.orderStatus === "rejected"
                    ? "bg-red-600"
                    : orderDetails.orderStatus === "pending"
                    ? "bg-yellow-500"
                    : orderDetails.orderStatus === "inProcess"
                    ? "bg-blue-500"
                    : orderDetails.orderStatus === "inShipping"
                    ? "bg-purple-500"
                    : orderDetails.orderStatus === "delivered"
                    ? "bg-teal-500"
                    : "bg-gray-500"
                }`}
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
            <span>Address: {orderDetails.addressInfo?.address || "N/A"}</span>
            <span>City: {orderDetails.addressInfo?.city || "N/A"}</span>
            <span>Pincode: {orderDetails.addressInfo?.pincode || "N/A"}</span>
            <span>Phone: {orderDetails.addressInfo?.phone || "N/A"}</span>
            {orderDetails.addressInfo?.notes && (
              <span>Notes: {orderDetails.addressInfo.notes}</span>
            )}
          </div>
        </div>

        <Separator />

        {/* Update Order Status Form */}
        <CommonForm
          formControls={[
            {
              label: "Order Status",
              name: "status",
              componentType: "select",
              options: [
                { id: "pending", label: "Pending" },
                { id: "inProcess", label: "In Process" },
                { id: "inShipping", label: "In Shipping" },
                { id: "delivered", label: "Delivered" },
                { id: "rejected", label: "Rejected" },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText="Update Order Status"
          onSubmit={handleUpdateStatus}
        />
      </div>
    </DialogContent>
  );
};

export default AdminOrderDetailsView;
