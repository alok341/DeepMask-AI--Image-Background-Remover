import { useState } from "react";
import { assets } from "../assets/assets";

const categories = ["People", "Products", "Animals", "Cars", "Graphics"];

const BgSlider = () => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [activeCategory, setActiveCategory] = useState("People");
    const [isDragging, setIsDragging] = useState(false);
    
    const handleSliderChange = (e) => {
        setSliderPosition(e.target.value);
    }

    const handleDragStart = () => {
        setIsDragging(true);
    }

    const handleDragEnd = () => {
        setIsDragging(false);
    }
    
    return (
      <div className="px-8 py-20 mb-16 relative bg-white">
        {/*section title*/}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Stunning <span className="text-indigo-700">quality.</span>
        </h2>

        {/*category selector*/}
        <div className="flex justify-center mb-12 flex-wrap">
            <div className="inline-flex gap-2 bg-gray-100 p-1.5 rounded-full flex-wrap justify-center">
                {categories.map((category) => (
                    <button 
                        key={category} 
                        className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                            activeCategory === category 
                                ? 'bg-white text-indigo-700 shadow-md' 
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>

        {/*image comparison slider*/}
        <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                    {/* Original Image (Alok.png) - Shown on left side */}
                    <img 
                        src={assets.people} 
                        alt="Original with background" 
                        className="absolute top-0 left-0 w-full h-full object-contain bg-gray-50"
                        style={{
                            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                        }}
                    />
                    
                    {/* Processed Image (Alokk.png) - Shown on right side */}
                    <img 
                        src={assets.people1} 
                        alt="After background removal" 
                        className="absolute top-0 left-0 w-full h-full object-contain"
                        style={{
                            clipPath: `inset(0 0 0 ${sliderPosition}%)`
                        }}
                    />

                    {/* Slider Line with better handle */}
                    <div 
                        className={`absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-opacity ${
                            isDragging ? 'opacity-100' : 'opacity-80'
                        }`}
                        style={{ left: `${sliderPosition}%` }}
                    >
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className={`w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center cursor-ew-resize transition-transform ${
                                isDragging ? 'scale-110' : 'hover:scale-105'
                            }`}>
                                <div className="flex gap-1">
                                    <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
                                    <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Range Input for Slider */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition}
                        onChange={handleSliderChange}
                        onMouseDown={handleDragStart}
                        onMouseUp={handleDragEnd}
                        onTouchStart={handleDragStart}
                        onTouchEnd={handleDragEnd}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                    />
                </div>

                {/* Better Labels showing which side is which */}
                <div className="absolute bottom-4 left-4">
                    <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm shadow-lg">
                        ← Original
                    </div>
                </div>
                <div className="absolute bottom-4 right-4">
                    <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm shadow-lg">
                        Processed →
                    </div>
                </div>

                {/* Slider instruction */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 text-gray-700 px-4 py-2 rounded-full text-sm shadow-lg backdrop-blur-sm">
                    Drag slider to compare
                </div>
            </div>

            {/* Category-specific description */}
            <div className="text-center mt-8">
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    {activeCategory === "People" && "Perfect for portraits, profile pictures, and group photos."}
                    {activeCategory === "Products" && "Ideal for e-commerce, product photography, and catalogs."}
                    {activeCategory === "Animals" && "Handles fur and fine details with precision."}
                    {activeCategory === "Cars" && "Clean cutouts for automotive photography."}
                    {activeCategory === "Graphics" && "Perfect for logos, illustrations, and digital art."}
                </p>
            </div>
        </div>
      </div>
    )
}

export default BgSlider;