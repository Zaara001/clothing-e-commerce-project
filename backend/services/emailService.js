// server/services/emailService.js
import axios from 'axios';

export const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const emailData = {
    sender: {
      name: "Aurora Clothing",
      email: "auroraclothing.orders@gmail.com", // Brevo's default verified sender
    },
    to: [{ email: userEmail }],
    subject: `Order Confirmed #${orderDetails.paymentId.slice(-6)}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #A06E4A;">Thank you for your order, ${orderDetails.user?.name || 'Customer'}!</h2>
        <p>Your payment of <strong>₹${orderDetails.amount.toFixed(2)}</strong> was successful.</p>
        
        <h3 style="color: #A06E4A;">Order Summary</h3>
        <ul style="list-style: none; padding: 0;">
          ${orderDetails.items.map(item => `
            <li style="margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #eee;">
              <img src="${item.image}" alt="${item.title}" style="width: 50px;  height: 80px; vertical-align: middle; margin-right: 10px;">
              ${item.title} 
              Size: ${item.selectedSize}, 
              Color: ${item.selectedColor} 
            </li>
          `).join('')}
        </ul>

        <h3 style="color: #A06E4A;">Delivery Address</h3>
        <p>
          ${orderDetails.address.fullName}<br>
          ${orderDetails.address.street}, ${orderDetails.address.city}<br>
          ${orderDetails.address.state} - ${orderDetails.address.pincode}<br>
          Phone: ${orderDetails.address.phone}
        </p>

        <p style="font-size: 14px; color: #777;">We'll notify you once your order ships.</p>
      </div>
    `,
  };

  try {
    await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ Order confirmation email sent to:', userEmail);
  } catch (error) {
    console.error('❌ Brevo email error:', error.response?.data || error.message);
    throw error; // Optional: Propagate error to handle in orderController
  }
};