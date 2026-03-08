import { useState } from "react";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const MenuBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isSignedIn, user } = useUser();
    const { userCredits, isLoading } = useAppContext();
    const navigate = useNavigate();
    
    return (
        <nav className="bg-white px-8 py-4 flex justify-between items-center relative">
            {/* Left side: logo + text - Click to go home */}
            <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/")}
            >
                <img src={assets.DeepMask} alt="DeepMask" className="h-8 w-12 object-contain" />
                <span className="text-2xl font-semibold text-indigo-700">
                    DeepMask <span className="text-gray-400">AI</span>
                </span>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
                {isSignedIn ? (
                    // Show user profile when signed in
                    <div className="flex items-center gap-4">
                        {/* Credits Display - Click to go to pricing */}
                        <div 
                            className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-all"
                            onClick={() => navigate("/pricing")}
                        >
                            <img src={assets.dollar} alt="credits" className="w-4 h-4" />
                            <span className="text-sm font-medium text-gray-700">
                                {isLoading ? "..." : userCredits}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                                Hi, {user?.firstName || user?.fullName || 'User'}
                            </span>
                            <UserButton />
                        </div>
                    </div>
                ) : (
                    // Show login/signup when signed out
                    <>
                        <SignInButton mode="modal">
                            <button className="text-gray-700 hover:text-blue-500 font-medium">
                                Login
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-full transition-all">
                                Sign Up
                            </button>
                        </SignUpButton>
                    </>
                )}
            </div>

            {/* Mobile Hamburger */}
            <div className="flex md:hidden">
                <button onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="absolute top-16 right-8 bg-white shadow-md rounded-md flex flex-col space-y-4 p-4 w-56 z-50">
                    {isSignedIn ? (
                        // Mobile view when signed in
                        <>
                            <div className="text-sm text-gray-600 border-b pb-2">
                                Signed in as <br/>
                                <span className="font-semibold">{user?.fullName || 'User'}</span>
                            </div>
                            
                            {/* Credits Display for Mobile */}
                            <div 
                                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                                onClick={() => {
                                    navigate("/pricing");
                                    setMenuOpen(false);
                                }}
                            >
                                <span className="text-sm text-gray-600">Credits:</span>
                                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                                    <img src={assets.dollar} alt="credits" className="w-4 h-4" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {isLoading ? "..." : userCredits}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Home link for mobile */}
                            <div 
                                className="text-sm text-gray-600 hover:text-indigo-600 cursor-pointer py-2"
                                onClick={() => {
                                    navigate("/");
                                    setMenuOpen(false);
                                }}
                            >
                                Home
                            </div>
                            
                            <UserButton />
                        </>
                    ) : (
                        // Mobile view when signed out
                        <>
                            <div 
                                className="text-sm text-gray-600 hover:text-indigo-600 cursor-pointer py-2"
                                onClick={() => {
                                    navigate("/");
                                    setMenuOpen(false);
                                }}
                            >
                                Home
                            </div>
                            <SignInButton mode="modal">
                                <button className="text-gray-700 hover:text-blue-500 font-medium w-full text-left">
                                    Login
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-full text-center w-full">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </>
                    )}
                </div>
            )}
        </nav>         
    );
};

export default MenuBar;