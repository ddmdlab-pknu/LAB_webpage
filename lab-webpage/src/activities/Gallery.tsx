import GalleryBox from "../components/GalleryBox";
import { galleryData } from "../data/galleryData";

function Gallery() {
  const GalleryInfo = galleryData;
  return (
    <div>
      <div className="mx-[10%] mt-12">
        <div className="flex justify-center items-center flex-col">
          <div>
            <div className="sr-only">
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
