// components/ImageProcessor.jsx
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Upload, Download, X, Loader2 } from "lucide-react";
import toast from 'react-hot-toast';

const ImageProcessor = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const { removeBackground, isProcessing, userCredits } = useAppContext();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setProcessedImage(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setProcessedImage(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setProcessedImage(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleProcessImage = async () => {
        if (!selectedImage) return;
        
        const result = await removeBackground(selectedImage);
        if (result) {
            setProcessedImage(`data:image/png;base64,${result}`);
            toast.success("Background removed successfully!");
        }
    };

    const handleDownload = () => {
        if (!processedImage) return;
        
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `removed-bg-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Credit Info */}
            <div className="mb-4 flex justify-end">
                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                    Credits Available: {userCredits}
                </div>
            </div>

            {/* Upload Area */}
            {!selectedImage ? (
                <div 
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-indigo-600 transition-colors cursor-pointer bg-white"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('imageInput').click()}
                >
                    <input 
                        type="file" 
                        id="imageInput" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                    />
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Upload className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-gray-900 mb-2">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-gray-500">
                                PNG, JPG, WEBP (Max 10MB)
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Image Processing
                        </h3>
                        <button 
                            onClick={handleRemoveImage}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Image Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Original Image */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Original</p>
                            <div className="bg-gray-100 rounded-xl p-4 h-64 flex items-center justify-center">
                                <img 
                                    src={previewUrl} 
                                    alt="Original" 
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Processed Image */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Background Removed</p>
                            <div className="bg-gray-100 rounded-xl p-4 h-64 flex items-center justify-center relative">
                                {processedImage ? (
                                    <img 
                                        src={processedImage} 
                                        alt="Processed" 
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        {isProcessing ? (
                                            <div className="flex flex-col items-center">
                                                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
                                                <p>Processing...</p>
                                            </div>
                                        ) : (
                                            <p>Click process to remove background</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center mt-6">
                        {!processedImage ? (
                            <button
                                onClick={handleProcessImage}
                                disabled={isProcessing}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                                className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-all flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download
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
    );
};

export default ImageProcessor;