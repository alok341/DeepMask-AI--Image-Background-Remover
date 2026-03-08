// components/TryNow.jsx
import { useState, useEffect, useRef } from "react";
import { Upload, Image as ImageIcon, X, Loader2, Download } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const TryNow = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    
    const fileInputRef = useRef(null);
    
    const { isSignedIn } = useUser();
    const { removeBackground, isProcessing, userCredits } = useAppContext();
    const navigate = useNavigate();

    // Auto-trigger file input when page loads
    useEffect(() => {
        // Small delay to ensure page is loaded
        const timer = setTimeout(() => {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            if (processedImage && processedImage.startsWith('blob:')) {
                URL.revokeObjectURL(processedImage);
            }
        };
    }, [previewUrl, processedImage]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        console.log("File selected:", file?.name, file?.type, file?.size);
        
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            
            // Check file size (30MB max)
            const MAX_SIZE = 30 * 1024 * 1024;
            if (file.size > MAX_SIZE) {
                toast.error("File size too large. Max 30MB allowed.");
                return;
            }
            
            setSelectedFile(file);
            
            // Clean up old preview URL
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setSelectedImage(url);
            setProcessedImage(null);
            
            // Show confirmation dialog
            setShowConfirmDialog(true);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setSelectedImage(url);
            setProcessedImage(null);
            
            // Show confirmation dialog
            setShowConfirmDialog(true);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleRemoveImage = () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        if (processedImage && processedImage.startsWith('blob:')) {
            URL.revokeObjectURL(processedImage);
        }
        
        setSelectedImage(null);
        setSelectedFile(null);
        setProcessedImage(null);
        setPreviewUrl(null);
        setShowConfirmDialog(false);
    };

    const handleConfirmProcess = async () => {
        setShowConfirmDialog(false);
        
        if (!isSignedIn) {
            toast.error("Please sign in to remove background");
            return;
        }

        if (userCredits < 2) {
            toast.error("Insufficient credits. Need 2 credits.");
            navigate("/pricing");
            return;
        }

        if (!selectedFile) {
            toast.error("Please upload an image file");
            return;
        }
        
        const resultUrl = await removeBackground(selectedFile);
        if (resultUrl) {
            // Clean up old processed image URL
            if (processedImage && processedImage.startsWith('blob:')) {
                URL.revokeObjectURL(processedImage);
            }
            
            setProcessedImage(resultUrl);
            toast.success("Background removed successfully!");
        }
    };

    const handleCancelProcess = () => {
        setShowConfirmDialog(false);
        // Keep the image preview but don't process
        toast.success("You can process it later when ready");
    };

    const handleDownload = () => {
        if (!processedImage) return;
        
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `removed-bg-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Image downloaded!");
    };

    // If not signed in, show sign-in prompt
    if (!isSignedIn) {
        return (
            <div className="px-8 py-20 bg-gray-50 min-h-screen">
                <div className="max-w-md mx-auto bg-white rounded-2xl p-8 text-center shadow-lg">
                    <p className="text-gray-600 mb-4">
                        Please sign in to use the background remover
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    // If no credits, show purchase prompt
    if (userCredits < 2) {
        return (
            <div className="px-8 py-20 bg-gray-50 min-h-screen">
                <div className="max-w-md mx-auto bg-white rounded-2xl p-8 text-center shadow-lg">
                    <p className="text-gray-600 mb-2">
                        You have <span className="font-bold text-red-600">{userCredits} credits</span>
                    </p>
                    <p className="text-gray-500 mb-4">
                        Need 2 credits per removal. Purchase more credits to continue.
                    </p>
                  // In TryNow.jsx, find the "Buy Credits" button
<button
    onClick={() => navigate("/pricing")}  // Now navigates to pricing page
    className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-all"
>
    Buy Credits
</button>
                </div>
            </div>
        );
    }

return (
    <div className="px-8 py-20 bg-gray-50 min-h-screen">
        {/* Credit Info with Back button */}
        <div className="max-w-3xl mx-auto mb-4 flex justify-between items-center">
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-all hover:scale-105"
            >
                <span>←</span> Back to Home
            </button>
            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                Credits Available: {userCredits} (2 per removal)
            </div>
        </div>
            {/* Main Card */}
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
                    
                    {/* Image Upload Area */}
                    {!selectedImage ? (
                        <div 
                            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-indigo-600 transition-colors cursor-pointer"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold text-gray-900 mb-2">
                                        Drop a file or click to upload
                                    </p>
                                    <p className="text-gray-500 mb-4">
                                        Supports: JPG, PNG, WEBP (Max 30MB)
                                    </p>
                                </div>
                                
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    id="imageUpload" 
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    hidden
                                />
                                <label 
                                    htmlFor="imageUpload" 
                                    className="bg-indigo-600 text-white font-medium px-8 py-3 rounded-full hover:bg-indigo-700 transition-all hover:scale-105 cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Upload Image
                                </label>
                            </div>
                        </div>
                    ) : (
                        /* Image Preview Area */
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900">Selected Image</h3>
                                <button 
                                    onClick={handleRemoveImage}
                                    className="text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Original Image */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 mb-2">Original</p>
                                    <div className="bg-gray-100 rounded-xl p-4 h-64 flex items-center justify-center">
                                        <img 
                                            src={selectedImage} 
                                            alt="Original" 
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Processed Image */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 mb-2">Background Removed</p>
                                    <div className="bg-gray-100 rounded-xl p-4 h-64 flex items-center justify-center">
                                        {processedImage ? (
                                            <img 
                                                src={processedImage} 
                                                alt="Processed" 
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        ) : (
                                            <div className="h-64 flex flex-col items-center justify-center">
                                                {isProcessing ? (
                                                    <>
                                                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-2" />
                                                        <p className="text-gray-500">Processing...</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                                                        <p className="text-gray-500">Click process to remove background</p>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-center">
                                {!processedImage ? (
                                    <button 
                                        onClick={() => setShowConfirmDialog(true)}
                                        disabled={isProcessing}
                                        className="bg-indigo-600 text-white font-medium px-8 py-3 rounded-full hover:bg-indigo-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Remove Background'
                                        )}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleDownload}
                                        className="bg-green-600 text-white font-medium px-8 py-3 rounded-full hover:bg-green-700 transition-all hover:scale-105 flex items-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download Result
                                    </button>
                                )}
                            </div>

                            {/* Credit Cost Info */}
                            {!processedImage && (
                                <p className="text-center text-sm text-gray-500 mt-4">
                                    ⚡ 2 credits will be used for this removal
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Background Removal</h3>
                        <p className="text-gray-600 mb-2">This will use <span className="font-bold text-indigo-600">2 credits</span> from your account.</p>
                        <p className="text-gray-500 mb-6">Your available credits: {userCredits}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleConfirmProcess}
                                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-all"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={handleCancelProcess}
                                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TryNow;