import { useEffect, useState } from "react";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState({
    orderStatus: "",
    paymentStatus: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders/admin");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (statusType, value) => {
    if (!selectedOrder) return;

    // Update the status
    setUpdatedStatus((prevState) => ({
      ...prevState,
      [statusType]: value,
    }));

    try {
      // Assuming API endpoint to update order status
      const response = await fetch(
        `http://localhost:5000/api/orders/${selectedOrder._id}/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [statusType]: value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedOrder = await response.json();
      setSelectedOrder(updatedOrder); // Update the order with the new status
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      case "Shipped":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleAction = (action) => {
    if (!selectedOrder) return;

    let newStatus = selectedOrder.status;
    if (action === "accept") newStatus = "Pending";
    if (action === "reject") newStatus = "Cancelled";
    if (action === "deliver") newStatus = "Delivered";

    handleStatusChange("orderStatus", newStatus);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      <table className="w-full border text-sm mb-8">
        <thead className="bg-gray-100">
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="text-center border-t">
              <td>{order._id.slice(0, 8)}...</td>
              <td>{order.userId?.name || "Unknown"}</td>
              <td>₹{order.totalAmount}</td>
              <td>
                <span
                  className={`inline-block px-2 py-1 rounded ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>
              <td>{order.paymentMethod}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="text-blue-600 underline"
                  onClick={() => setSelectedOrder(order)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order details section */}
      {selectedOrder && (
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Order Details</h3>

          <p>
            <strong>Order ID:</strong> {selectedOrder._id}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(selectedOrder.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
          </p>
          <p>
            <strong>Status:</strong> {selectedOrder.status}
          </p>

          <h4 className="mt-4 font-semibold">Shipping Address</h4>
          <p>{selectedOrder.shippingAddress?.fullName}</p>
          <p>{selectedOrder.shippingAddress?.email}</p>
          <p>{selectedOrder.shippingAddress?.phone}</p>
          <p>
            {selectedOrder.shippingAddress?.city},{" "}
            {selectedOrder.shippingAddress?.state}{" "}
            {selectedOrder.shippingAddress?.zipCode}
          </p>

          <h4 className="mt-4 font-semibold">Items</h4>
          <ul className="list-disc ml-6">
            {selectedOrder.items?.map((item, idx) => (
              <li key={idx}>
                {item.name} - {item.quantity} x ₹{item.price}
              </li>
            ))}
          </ul>

          <h4 className="mt-4 font-semibold">Cart Totals</h4>
          <p>Subtotal: ₹{selectedOrder.subtotal}</p>
          <p>Shipping: ₹{selectedOrder.shippingCost}</p>
          <p>Tax: ₹{selectedOrder.tax}</p>
          <p>
            <strong>Total: ₹{selectedOrder.totalAmount}</strong>
          </p>

          {/* Change Status Section */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">
              Change Status for Order #{selectedOrder._id}
            </h3>

            <div className="mb-4">
              <p>
                <strong>Current Order Status:</strong>{" "}
                {selectedOrder.status || "Not Set"}
              </p>
              <p>
                <strong>Current Payment Status:</strong>{" "}
                {selectedOrder.paymentStatus || "Not Set"}
              </p>
            </div>

            {/* Order Status Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Order Status
              </label>
              <select
                value={updatedStatus.orderStatus || selectedOrder.status}
                onChange={(e) =>
                  handleStatusChange("orderStatus", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <select
                value={
                  updatedStatus.paymentStatus || selectedOrder.paymentStatus
                }
                onChange={(e) =>
                  handleStatusChange("paymentStatus", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => handleAction("accept")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction("reject")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => handleAction("deliver")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Deliver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
