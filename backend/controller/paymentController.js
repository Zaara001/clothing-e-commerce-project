import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// ✅ Create Order - Already Working
export const createOrder = async (req, res) => {
  const { amount } = req.body; // 548.00

  try {
    // Validate amount is a valid number
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Convert to paise (Razorpay expects integer)
    const amountInPaise = Math.round(amountNum * 100); // 548.00 * 100 = 54800

    const options = {
      amount: amountInPaise, // 54800
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Razorpay error:", err.error.description);
    res.status(500).json({ 
      error: err.error.description,
      receivedAmount: amount,
      convertedAmount: amountInPaise
    });
  }
};
// ✅ Verify Payment - Newly Added
export const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};
