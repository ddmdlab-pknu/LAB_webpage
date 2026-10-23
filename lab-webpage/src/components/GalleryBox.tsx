import { useState } from "react";

interface InfoProps {
  info: {
    img?: string;
    imgs?: string[];
    comments: string;
  };
}

const arrowClass =
  "absolute top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-dark/50 text-white text-xl hover:bg-dark/80 transition-colors";

const GalleryBox = (info: InfoProps) => {
  const images = info.info.imgs ?? (info.info.img ? [info.info.img] : []);
  const [index, setIndex] = useState(0);
  const isSlide = images.length > 1;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="w-full h-full my-8 p-4 lg:mr-10 w-[450px] h-[300px] mb-5 flex flex-col justify-center items-center text-center">
      <div className="relative w-[600px] max-w-full h-[400px] mb-2">
        <img
          key={images[index]}
          className={`w-full h-full rounded-md animate-fade-in ${
            isSlide ? "object-contain bg-dark" : "object-cover"
          }`}
          src={images[index]}
          alt=""
        />
        {isSlide && (
          <>
            <button
              aria-label="Previous photo"
              onClick={prev}
              className={`${arrowClass} left-2`}
            >
              ‹
            </button>
            <button
              aria-label="Next photo"
              onClick={next}
              className={`${arrowClass} right-2`}
            >
              ›
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {images.map((src, i) => (
                <button
                  key={src}
                  aria-label={`Photo ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div>{info.info.comments}</div>
    </div>
  );
};

export default GalleryBox;
