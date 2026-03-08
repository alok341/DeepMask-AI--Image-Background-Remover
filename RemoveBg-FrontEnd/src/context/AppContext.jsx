// context/AppContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import toast from 'react-hot-toast';
import OrderService from "../services/OrderService";

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppContextProvider");
    }
    return context;
};

export const AppContextProvider = ({ children }) => {
    const [userCredits, setUserCredits] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { isSignedIn, user } = useUser();
    const { getToken } = useAuth();

    // Get backend URL from environment variable
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    // Function to sync user with backend
    const syncUserWithBackend = async () => {
        if (!isSignedIn || !user) return null;

        setIsLoading(true);
        try {
            const token = await getToken();
            
            const userData = {
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                photoUrl: user.imageUrl
            };

            const response = await fetch(`${API_BASE_URL}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (data.success) {
                console.log("User synced successfully:", data.data);
                setUserCredits(data.data.credits || 0);
                return data.data;
            } else {
                console.error("Failed to sync user:", data.data);
                toast.error("Failed to sync user data");
                return null;
            }
        } catch (error) {
            console.error("Error syncing user:", error);
            toast.error("Error connecting to server");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch user credits
    const fetchUserCredits = async () => {
        if (!isSignedIn || !user) return;

        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/users/credits`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            const data = await response.json();
            if (data.success) {
                setUserCredits(data.data.credits || 0);
            } else {
                console.error("Failed to fetch credits:", data.data);
            }
        } catch (error) {
            console.error("Error fetching credits:", error);
        }
    };

    // Function to remove background
    const removeBackground = async (file) => {
        console.log("removeBackground called with file:", file?.name, file?.type, file?.size);
        
        if (!isSignedIn) {
            toast.error("Please sign in to remove background");
            return null;
        }

        if (userCredits < 2) {
            toast.error("Insufficient credits. Need 2 credits.");
            return null;
        }

        setIsProcessing(true);
        try {
            const token = await getToken();
            
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${API_BASE_URL}/api/images/remove-background`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            console.log("Response status:", response.status);
            console.log("Response content-type:", response.headers.get("content-type"));

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to remove background");
            }

            // Get the image as blob (binary data)
            const imageBlob = await response.blob();
            console.log("Image blob received:", imageBlob.type, imageBlob.size, "bytes");
            
            // Create object URL from blob
            const imageUrl = URL.createObjectURL(imageBlob);
            
            // Update credits (deduct 2)
            setUserCredits(prev => prev - 2);
            
            return imageUrl; // Return URL for img src
            
        } catch (error) {
            console.error("Error removing background:", error);
            toast.error(error.message || "Error removing background");
            return null;
        } finally {
            setIsProcessing(false);
        }
    };

    // Function to purchase credits
const purchaseCredits = async (plan) => {
    if (!isSignedIn) {
        toast.error("Please sign in to purchase credits");
        return;
    }

    setIsProcessing(true);
    try {
        const token = await getToken();
        
        // Load Razorpay script - use OrderService (capital O)
        const scriptLoaded = await OrderService.loadRazorpayScript();
        if (!scriptLoaded) {
            toast.error("Failed to load payment gateway");
            setIsProcessing(false);
            return;
        }

        // Create order in backend - use OrderService
        const orderDetails = await OrderService.createOrder(plan.name, token);
        
        // Initiate payment - use OrderService
        await OrderService.initiatePayment(
            plan,
            orderDetails,
            token,
            // Success callback
            async (result) => {
                toast.success("Payment successful! Credits added to your account");
                // Refresh credits
                await fetchUserCredits();
                setIsProcessing(false);
            },
            // Failure callback
            (errorMessage) => {
                toast.error(errorMessage || "Payment failed");
                setIsProcessing(false);
            }
        );
    } catch (error) {
        console.error("Purchase error:", error);
        toast.error(error.message || "Failed to process payment");
        setIsProcessing(false);
    }
};

    // Fetch credits when user signs in
    useEffect(() => {
        if (isSignedIn && user) {
            fetchUserCredits();
        }
    }, [isSignedIn, user]);

    return (
        <AppContext.Provider value={{
            userCredits,
            setUserCredits,
            isLoading,
            isProcessing,
            syncUserWithBackend,
            fetchUserCredits,
            removeBackground,
            purchaseCredits  // Added purchaseCredits function
        }}>
            {children}
        </AppContext.Provider>
    );
};