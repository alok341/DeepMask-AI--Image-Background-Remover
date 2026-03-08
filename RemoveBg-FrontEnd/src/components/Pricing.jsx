// components/Pricing.jsx
import { useAppContext } from "../context/AppContext";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const Pricing = () => {
    const { isSignedIn } = useUser();
    const { purchaseCredits, isProcessing } = useAppContext();
    const navigate = useNavigate();

    const plans = [
        {
            name: "Basic Package",
            price: 99,
            credits: 20,
            description: "Best for personal use",
            popular: false
        },
        {
            name: "Premium Package",
            price: 199,
            credits: 50,
            description: "Best for business use",
            popular: true,
            badge: "Most Popular"
        },
        {
            name: "Ultimate Package",
            price: 349,
            credits: 100,
            description: "Best for enterprise use",
            popular: false
        }
    ];

    const handleBuyClick = async (plan) => {
        if (!isSignedIn) {
            toast.error("Please sign in to purchase credits");
            navigate("/");
            return;
        }

        await purchaseCredits(plan);
    };
<div className="max-w-5xl mx-auto mb-4">
    <button
        onClick={() => navigate("/")}
        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
    >
        ← Back to Home
    </button>
</div>
    return (
        <div className="px-8 py-20 bg-gray-50">
            {/* Heading */}
            <div className="text-center mb-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Choose your <span className="text-indigo-700">perfect package</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Select from our carefully curated photography packages designed to meet your specific needs and budget
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {plans.map((plan, index) => (
                    <div 
                        key={index}
                        className="bg-black rounded-3xl p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:shadow-xl transition-all hover:scale-105 relative"
                    >
                        {/* Most Popular Badge - only for Premium */}
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
                                     Most Popular
                                </span>
                            </div>
                        )}

                        {/* Plan Name */}
                        <h3 className="text-2xl font-bold mb-2 text-white">
                            {plan.name}
                        </h3>
                        
                        {/* Credits */}
                        <div className="mb-2">
                            <span className="text-3xl font-bold text-white">{plan.credits}</span>
                            <span className="text-gray-400 ml-2">credits</span>
                        </div>
                        
                        {/* Description */}
                        <p className="mb-4 text-gray-300">
                            {plan.description}
                        </p>
                        
                        {/* Price */}
                        <div className="mb-8">
                            <span className="text-4xl font-bold text-indigo-600">
                                ₹{plan.price}
                            </span>
                        </div>
                        
                        {/* Choose Plan Button */}
                        <button 
                            onClick={() => handleBuyClick(plan)}
                            disabled={isProcessing}
                            className="w-full bg-indigo-600 text-white font-medium px-6 py-3 rounded-full transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? "Processing..." : "Choose Plan"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Pricing;