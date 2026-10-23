import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function MustReadPapers() {
  // 슬라이드에 사용할 이미지 데이터 배열
  const slideImages = [
    {
      src: "/images/must_read_paper_1.png",
      alt: "Effect of annealing on the microstructure and magnetic properties of soft magnetic Fe-Si produced via laser additive manufacturing",
      keywords:
        "Additive manufacturing, Annealing, Powder processing, Soft magnetic materials, Magnetic properties",
    },
    {
      src: "/images/must_read_paper_2.png", // 예시 이미지
      alt: "Diffusion driven columnar grain growth induced in an Al–Si-coated steel substrate",
      keywords:
        "Diffusion, Metallic coating, Grain growth, Phase transformation, Electrical steel",
    },
    {
      src: "/images/must_read_paper_3.png", // 예시 이미지
      alt: "Development of (100) Texture in Silicon Steel Sheets by Removal of Manganese and Decarburization",
      keywords:
        "(100) texture, Removal of manganese, Decarburization, Silicon steel sheets, Magnetic properties",
    },
    {
      src: "/images/must_read_paper_4.png", // 예시 이미지
      alt: "COMBO: An efficient Bayesian optimization library for materials science",
      keywords:
        "Bayesian optimization, Python library, Global optimization, Materials design",
    },
    // 필요에 따라 더 많은 이미지 추가 가능
  ];

  return (
    <div>
      <div className="w-full flex justify-center items-center">
        <div className="flex flex-col w-full min-h-[30vh] md:min-h-[70vh]">
          <span className="text-title text-[60px] text-center mb-28 animate-[gotoDown_0.7s_ease-in-out_both]">
            Must Read Papers
          </span>
          {/* Swiper 슬라이드 구현 - 100vh 높이 적용 */}
          <div className="w-[100%] bg-[rgb(97,120,161)] flex flex-col justify-center items-center p-4">
            <div className="relative w-full h-full">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                  el: ".swiper-pagination-custom",
                }}
                autoplay={{
                  delay: 9000,
                  disableOnInteraction: false,
                }}
                loop={true}
                speed={800}
                className="relative w-full h-full"
              >
                {slideImages.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className="flex justify-center items-center my-10"
                  >
                    <div className="flex flex-col md:flex-row justify-center md:items-start items-center h-full">
                      <img
                        className="lg:w-[550px] lg:h-[600px] md:w-[400px] md:h-[420px] w-[320px] h-[350px] object-cover object-top rounded-t-md overflow-hidden"
                        src={image.src}
                        alt={image.alt}
                      />
                      <div className="md:w-[40%] w-[80%] md:ml-16 flex flex-col items-start justify-start">
                        <div className="font-bold lg:text-3xl md:text-2xl text-xl md:mt-10 mt-5">
                          {image.alt}
                        </div>
                        <div>
                          <div className="lg:mt-10 mt-5 text-md md:text-lg font-bold">
                            Keywords
                          </div>
                          <div className="text-sm">{image.keywords}</div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* 커스텀 네비게이션 버튼 */}
              <div className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200">
                <svg
                  className="w-5 h-5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
              <div className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200">
                <svg
                  className="w-5 h-5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              {/* 커스텀 페이지네이션 */}
              <div className="swiper-pagination-custom absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MustReadPapers;
