import axios from "axios";

const API_BASE_URL = "https://server-kzwj.onrender.com/api";

const getToken = () => {
  return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
};

export const createRazorpayOrder = async (orderId, paymentMethod) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payments/create-razorpay-order`,
      { orderId, paymentMethod },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create payment order" };
  }
};

export const confirmPayment = async (paymentId, gateway, paymentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payments/confirm`,
      { paymentId, gateway, paymentData },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to confirm payment" };
  }
};