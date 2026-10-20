import GalleryBox from "../components/GalleryBox";
import { galleryData } from "../data/galleryData";

function Gallery() {
  const GalleryInfo = galleryData;
  return (
    <div>
      <div className="mx-[10%] mt-12">
        <div className="flex justify-center items-center flex-col">
          <div className="mb-20">
            <div className="text-center text-[60px] lg:mb-28 mb-16 text-title animate-[gotoDown_0.7s_ease-in-out_both]">
              <span>GALLERY</span>
            </div>
          </div>
          <div className="flex items-center justify-center grid lg:grid-cols-2 grid-cols-1">
            {GalleryInfo.map((info) => {
              return <GalleryBox info={info} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
