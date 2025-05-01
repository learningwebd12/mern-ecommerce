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

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      // Ensure valid values for orderStatus and paymentStatus
      if (!updatedStatus.orderStatus || !updatedStatus.paymentStatus) {
        alert("Please select both order and payment status.");
        return;
      }

      // Adjust frontend status to match backend enum
      const updatedStatusData = {
        ...updatedStatus,
        paymentStatus:
          updatedStatus.paymentStatus === "Paid" ? "Completed" : "Pending", // Modify "Paid" to "Completed"
      };

      const response = await fetch(
        `http://localhost:5000/api/orders/${selectedOrder._id}/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedStatusData),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      const updatedOrder = await response.json();

      // Update the orders list with the modified order
      setSelectedOrder(updatedOrder);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      // Clear status form
      setUpdatedStatus({ orderStatus: "", paymentStatus: "" });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
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
                  onClick={() => {
                    setSelectedOrder(order);
                    setUpdatedStatus({
                      orderStatus: order.status,
                      paymentStatus:
                        order.paymentStatus === "Completed" ? "Paid" : "Unpaid", // Modify for frontend
                    });
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

          <p className="mt-4 font-semibold">
            Total: ₹{selectedOrder.totalAmount}
          </p>

          {/* Status Controls */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">
              Change Status for Order #{selectedOrder._id}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium">Order Status</label>
              <select
                value={updatedStatus.orderStatus}
                onChange={(e) =>
                  setUpdatedStatus((prev) => ({
                    ...prev,
                    orderStatus: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Payment Status
              </label>
              <select
                value={updatedStatus.paymentStatus}
                onChange={(e) =>
                  setUpdatedStatus((prev) => ({
                    ...prev,
                    paymentStatus: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button
              onClick={handleUpdateStatus}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
