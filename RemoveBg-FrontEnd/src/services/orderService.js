// services/orderService.js
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

class OrderService {
    
    // Load Razorpay script dynamically
    loadRazorpayScript() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    // Create order in backend
   // In OrderService.js, update the createOrder method:
async createOrder(planName, token) {
    try {
        console.log("Creating order for plan:", planName);
        
        // CHANGE THIS: add /create to the endpoint
        const url = `${API_BASE_URL}/api/orders/create?planId=${encodeURIComponent(planName)}`;
        console.log("Request URL:", url);
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Response status:", response.status);
        
        const data = await response.json();
        console.log("Response data:", data);
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message || "Failed to create order");
        }
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}

    // Verify payment after completion
    async verifyPayment(razorpayOrderId, token) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/verify`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ razorpay_order_id: razorpayOrderId })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error verifying payment:", error);
            throw error;
        }
    }

    // Initialize Razorpay payment
    async initiatePayment(plan, orderDetails, token, onSuccess, onFailure) {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Add this to your .env
            amount: orderDetails.amount,
            currency: orderDetails.currency,
            name: "DeepMask AI",
            description: `${plan.credits} Credits Package`,
            image: "/logo.png", // Add your logo path
            order_id: orderDetails.id,
            handler: async (response) => {
                try {
                    // Verify payment with backend
                    const verificationResult = await this.verifyPayment(response.razorpay_order_id, token);
                    
                    if (verificationResult.success) {
                        onSuccess(verificationResult);
                    } else {
                        onFailure(verificationResult.message || "Payment verification failed");
                    }
                } catch (error) {
                    onFailure("Payment verification failed");
                }
            },
            prefill: {
                name: "", // You can get this from user context
                email: "", // You can get this from user context
                contact: ""
            },
            notes: {
                plan: plan.name,
                credits: plan.credits
            },
            theme: {
                color: "#4f46e5" // indigo-600
            },
            modal: {
                ondismiss: () => {
                    onFailure("Payment cancelled");
                }
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    }
}

export default new OrderService();