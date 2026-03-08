import { assets } from "../assets/assets";

const BgRemovalSteps = () => {
    return (
        <div className="px-8 py-20 bg-gray-50">
            {/* Heading */}
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    How to remove a <span className="text-indigo-700">background in seconds?</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Three simple steps to get professional results
                </p>
            </div>

            {/* Steps Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Step 1 */}
                <div className="bg-white rounded-3xl p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:shadow-xl transition-all hover:scale-105 relative">
                    <div className="absolute -top-4 -left-2 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        1
                    </div>
                    <div className="mt-6">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-center mb-3">Select an image</h3>
                        <p className="text-gray-600 text-center">
                            Upload any image - JPG, PNG, or WebP. We support all image dimensions.
                        </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-3xl p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:shadow-xl transition-all hover:scale-105 relative">
                    <div className="absolute -top-4 -left-2 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        2
                    </div>
                    <div className="mt-6">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-center mb-3">Let magic remove the background</h3>
                        <p className="text-gray-600 text-center">
                            Our AI automatically detects and removes the background with pixel-perfect accuracy. You can also choose background color of your choice.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-3xl p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:shadow-xl transition-all hover:scale-105 relative">
                    <div className="absolute -top-4 -left-2 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        3
                    </div>
                    <div className="mt-6">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-center mb-3">Download your image</h3>
                        <p className="text-gray-600 text-center">
                            Get your transparent PNG instantly. High-quality download with no watermarks.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BgRemovalSteps;