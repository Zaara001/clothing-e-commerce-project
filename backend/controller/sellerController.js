
const Order = require("../model/orderModel"); // import your Order model

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // validate status
    const allowedStatuses = ["Pending", "Shipping", "Cancelled", "Delivered"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
