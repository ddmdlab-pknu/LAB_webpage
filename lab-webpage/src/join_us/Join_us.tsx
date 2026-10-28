import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CONTACT_EMAIL = "newtain@pknu.ac.kr";

function JoinUs() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      // clipboard API를 지원하지 않는 환경 대비
      const textarea = document.createElement("textarea");
      textarea.value = CONTACT_EMAIL;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const researchAreas = [
    {
      title: "친환경 모빌리티 핵심 소재 개발",
      desc: "모터코어용 고효율 무방향성 전기강판(Non-oriented Electrical Steel)의 특성 최적화 연구",
      img: "/images/our_work(2).jpg",
      cover: true,
    },
    {
      title: "공정 조건 최적화 및 설계",
      desc: "능동 학습(Active Learning) 기법을 통해 실험 횟수를 획기적으로 단축하고, 최소한의 데이터로 최대의 물성을 확보하는 지능형 공정 설계를 수행",
      img: "/images/join_us_optimg.webp",
      zoom: true,
    },
    {
      title: "AI 기반 소재 지능화",
      desc: "데이터 증강(Data Augmentation) 및 생성형 모델을 활용한 재료 물성 예측 AI 모델 고도화",
      img: "/images/join_us_증강.webp",
      zoom: true,
    },
    {
      title: "시뮬레이션을 활용한 재료 설계",
      desc: "Pandat 및 CALPHAD 기반의 열역학 시뮬레이션과 재료 AI 모델을 결합한 최적 설계",
      img: "/images/pandat_고화질.webp",
      cover: true,
    },
  ];

  const benefits = [
    {
      title: "체계적이고 수평적인 연구 지도",
      items: [
        "Weekly Meeting을 통해 개별 연구의 방향성을 점검하고 심도 있는 피드백을 제공합니다.",
        "교수님과의 상시 메신저 소통을 통해 연구 중 발생하는 문제에 대해 즉각적인 논의가 가능합니다.",
      ],
    },
    {
      title: "Materials AI 연구",
      items: [
        "학과 내 유일한 '재료 AI(Materials AI)' 연구실로서, 도메인 지식과 데이터 사이언스 역량을 동시에 갖춘 융합 인재로 성장할 수 있습니다.",
        "SEM-EDS, XRD, CT, DMA, Vacuum/Gas Furnace 등 풍부한 재료 분석 장비를 직접 운용하며 실전 데이터 획득 역량을 키울 수 있습니다.",
      ],
    },
    {
      title: "쾌적한 환경",
      items: [
        "개별 모니터 제공 및 집중도 높은 넓고 쾌적한 연구 공간을 보장합니다.",
        "대규모 프로젝트 및 산학 프로젝트 참여를 통해 연구비 지원은 물론 실무 네트워크 형성 기회를 제공합니다.",
      ],
    },
  ];

  const idealMembers = [
    "신소재공학 지식에 AI 기술을 접목해 보고 싶은 분",
    "최신 연구 트렌드에 민감하고, 분석 장비 활용 능력을 키우고 싶은 분",
    "자유로운 분위기 속에서 다양한 연구 성과를 만들어가고 싶은 분",
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Full-screen auto-rotating Swiper */}
      <div className="relative w-full">
        {/* Fixed JOIN US title overlay - top center */}
        <div className="absolute inset-x-0 top-6 sm:top-8 md:top-10 z-30 text-center pointer-events-none px-4">
          <h1 className="inline-block text-4xl sm:text-6xl md:text-[80px] text-white font-bold drop-shadow-2xl">
            JOIN US
          </h1>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: ".join-swiper-next",
            prevEl: ".join-swiper-prev",
          }}
          pagination={{
            clickable: true,
            el: ".join-swiper-pagination",
          }}
          autoplay={{
            delay: 7000,
            disableOnInteraction: false,
          }}
          loop={true}
          speed={800}
          autoHeight={true}
          className="w-full"
        >
          {/* Slide 1: Research Areas */}
          <SwiperSlide>
            <section className="relative w-full overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-first-bg bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-[#00305b]/85"></div>
              <div className="relative w-full px-5 sm:px-6 md:px-[10%] pt-24 sm:pt-28 md:pt-40 pb-14 md:pb-20 min-h-[85vh] md:min-h-screen text-center flex flex-col items-center justify-center">
                <h2 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 sm:mb-8 md:mb-10">
                  주요 연구 분야
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-5xl w-full mx-auto text-left">
                  {researchAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all group flex flex-col"
                    >
                      <div
                        className={`h-28 sm:h-32 md:h-44 bg-white flex items-center justify-center overflow-hidden ${
                          area.cover ? "" : area.zoom ? "p-1" : "p-3"
                        }`}
                      >
                        <img
                          src={area.img}
                          alt={area.title}
                          className={`transition-transform duration-700 ${
                            area.cover
                              ? "w-full h-full object-cover group-hover:scale-105"
                              : area.zoom
                                ? "max-w-full max-h-full object-contain scale-125 group-hover:scale-[1.35]"
                                : "max-w-full max-h-full object-contain group-hover:scale-105"
                          }`}
                        />
                      </div>
                      <div className="p-4 sm:p-5 flex-1">
                        <div className="flex items-center gap-2 sm:gap-2.5 mb-1.5 sm:mb-2">
                          <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-white text-title rounded-full text-xs sm:text-sm font-bold">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm sm:text-base md:text-lg font-bold text-white">
                            {area.title}
                          </h4>
                        </div>
                        <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
                          {area.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </SwiperSlide>

          {/* Slide 2: Lab Benefits */}
          <SwiperSlide>
            <section className="relative w-full overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-pandat-bg bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-[#00305b]/85"></div>
              <div className="relative w-full px-5 sm:px-6 md:px-[10%] pt-24 sm:pt-28 md:pt-40 pb-14 md:pb-20 min-h-[85vh] md:min-h-screen text-center flex flex-col items-center justify-center">
                <h2 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 sm:mb-8 md:mb-10">
                  연구실 혜택
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl w-full mx-auto text-left">
                  {benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 sm:p-6 hover:bg-white/15 transition-all flex flex-col"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 mb-3 sm:mb-4 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                        {idx + 1}
                      </div>
                      <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                        {benefit.title}
                      </h4>
                      <ul className="space-y-2">
                        {benefit.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-white/85 text-sm sm:text-base md:text-lg leading-relaxed"
                          >
                            <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 bg-blue-300 rounded-full"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </SwiperSlide>

          {/* Slide 3: Ideal Members */}
          <SwiperSlide>
            <section className="relative w-full overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-second-bg bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-[#00305b]/85"></div>
              <div className="relative w-full px-5 sm:px-6 md:px-[10%] pt-24 sm:pt-28 md:pt-40 pb-14 md:pb-20 min-h-[85vh] md:min-h-screen text-center flex flex-col items-center justify-center">
                <h2 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 sm:mb-8 md:mb-10">
                  이런 분들과 함께하고 싶습니다
                </h2>
                <ul className="space-y-3 sm:space-y-4 max-w-3xl w-full mx-auto text-left">
                  {idealMembers.map((member, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 sm:gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-5 hover:bg-white/15 transition-all"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-white text-sm sm:text-base md:text-lg font-medium">
                        {member}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </SwiperSlide>
        </Swiper>

        {/* Custom Navigation Arrows */}
        <div className="join-swiper-prev hidden sm:flex absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full items-center justify-center cursor-pointer transition-all duration-200 border border-white/30">
          <svg
            className="w-6 h-6 text-white"
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
        <div className="join-swiper-next hidden sm:flex absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full items-center justify-center cursor-pointer transition-all duration-200 border border-white/30">
          <svg
            className="w-6 h-6 text-white"
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

        {/* Custom Pagination */}
        <div className="join-swiper-pagination absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2"></div>
      </div>

      {/* Contact */}
      <div className="mx-5 sm:mx-[8%] md:mx-[10%] my-12 md:my-20">
        <section className="max-w-5xl mx-auto">
          <div className="bg-title text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-5">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                관심 있으신가요?
              </h3>
              <p className="text-white/70 text-xs sm:text-sm">
                CV와 간단한 자기소개를 보내주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              title="클릭하면 이메일 주소가 복사됩니다"
              aria-label={`이메일 주소 ${CONTACT_EMAIL} 복사하기`}
              className="w-full md:w-auto justify-center bg-white text-title px-5 sm:px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-all shadow-md text-xs sm:text-sm md:text-base flex items-center gap-2 break-all"
            >
              {copied ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  복사되었습니다!
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                  {CONTACT_EMAIL}
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default JoinUs;
