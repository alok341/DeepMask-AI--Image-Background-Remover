// components/Header.jsx
import { assets } from "../assets/assets";
import { useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const Header = () => {
    const { isSignedIn } = useUser();
    const { userCredits } = useAppContext();
    const navigate = useNavigate();

    const handleUploadClick = () => {
        if (!isSignedIn) {
            toast.error("Please sign in to upload images");
            return;
        }

        // Navigate to the image tool page
        navigate("/tool");
    };

    return (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 px-8 py-12">
        {/* Left side: Video Panel */}
        <div className="order-2 md:order-1 flex justify-center">
           <div className="shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden">
            <video 
                src={assets.video} 
                autoPlay 
                loop 
                muted 
                className="w-full max-w-[450px] h-auto object-cover"
            />
           </div>
        </div>
        
        {/* Right side: Content */}
        <div className="order-1 md:order-2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            The fastest <span className="text-indigo-700">background eraser.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
            Transform your photos with our AI-powered tool. Get perfect cutouts in seconds - no manual editing required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
            <button 
                onClick={handleUploadClick}
                className="bg-black text-white font-medium px-8 py-4 rounded-full hover:opacity-90 transition-all hover:scale-105 text-lg cursor-pointer inline-block"
            >
                Upload your image
            </button>

            {/* Show credits if signed in */}
            {isSignedIn && (
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                    <img src={assets.dollar} alt="credits" className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">
                        {userCredits} credits left
                    </span>
                </div>
            )}
          </div>
        </div>
      </div>
    )
}

export default Header;