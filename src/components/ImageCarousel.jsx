import { useState } from 'react';

function ImageCarousel({ images }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length < 3) {
        return (
            <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-500">
                Minimum of 3 images required.
            </div>
        );
    }

    const displayImages = images.slice(0, 6);

    const handlePrev = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="w-full flex flex-col gap-4 items-center">
            <div className="w-[70vw] aspect-video flex flex-col items-center rounded-2xl overflow-hidden border border-gray-200 relative group">
                <img
                    src={displayImages[activeIndex]}
                    alt={`Property View ${activeIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                />

                <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary  text-white px-4 py-1.5 rounded-full border border-gray-200 transition-all cursor-pointer opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold text-2xl select-none"
                >
                    &lt;
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1.5  rounded-full border border-gray-200  transition-all cursor-pointer opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold text-2xl select-none"
                >
                    &gt;
                </button>

                <div className="absolute bottom-4 right-4 bg-gray-900/70 text-white text-xs px-3 py-1 rounded-md font-medium">
                    {activeIndex + 1} / {displayImages.length}
                </div>
            </div>

            <div className="flex flex-row gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {displayImages.map((imgUrl, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${activeIndex === index
                            ? 'border-primary scale-95 shadow-sm'
                            : 'border-gray-200 opacity-70 hover:opacity-100'
                            }`}
                    >
                        <img
                            src={imgUrl}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ImageCarousel;