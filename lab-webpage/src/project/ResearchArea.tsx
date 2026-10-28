import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";

function ResearchAreas() {
  return (
    <div className="mx-[10%] mt-10">
      <div className="flex justify-center">
        <div className="w-full">
          {/* Page Title */}
          <div className="flex justify-center text-[40px] md:text-[60px] lg:mb-28 mb-16 text-title animate-[gotoDown_0.7s_ease-in-out_both] font-bold">
            <span className="mb-5 uppercase tracking-wider">Research Areas</span>
          </div>

          {/* Lab Introduction Section (Modeled after Overview.tsx) */}
          <div className="flex justify-center items-start flex-col lg:flex-row mb-32 bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-full lg:w-1/3">
              <div className="lg:mt-0 mt-5 flex justify-center items-center">
                <img
                  alt="lab logo"
                  src="/images/logo(2).webp"
                  className="block w-[300px] h-[300px] object-contain drop-shadow-md"
                />
              </div>
            </div>

            <div className="w-full lg:w-2/3 mt-10 lg:mt-0 lg:pl-16">
              <div className="inline-block mb-6 leading-7 text-lg font-medium">
                <div className="mb-8 text-3xl font-bold text-title flex items-center border-b-4 border-title pb-3 w-fit pr-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-8 mr-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                    />
                  </svg>
                  연구실 소개 (Introduction)
                </div>
                <div className="space-y-6 text-gray-800">
                  <div className="flex items-start">
                    <div className="mr-4 mt-2.5 w-2 h-2 bg-title rounded-full flex-shrink-0"></div>
                    <div className="text-xl">
                      첨단 모빌리티 핵심 소재인 <span className="font-bold text-title">전기강판 등 자성재료</span>의 물성 향상을 목표로 연구를 수행합니다.
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 mt-2.5 w-2 h-2 bg-title rounded-full flex-shrink-0"></div>
                    <div className="text-xl">
                      <span className="font-bold text-title">진공·가스 열처리 공정</span>과 자성, 집합조직 및 압연 거동을 분석하여 소재 성능을 체계적으로 규명합니다.
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 mt-2.5 w-2 h-2 bg-title rounded-full flex-shrink-0"></div>
                    <div className="text-xl">
                      <span className="font-bold text-title">AI 기반 공정 최적화</span>와 금속 소재 시뮬레이션을 통해 차세대 자성 소재 개발 및 개발방식을 혁신합니다.
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 text-right border-t-2 border-slate-200 pt-6">
                <span className="text-xl font-semibold text-gray-600">데이터 융합 철강 소재 설계 연구실</span>
                <strong className="pl-6 font-bold text-2xl text-title">Prof. 박세민 (Se Min Park)</strong>
              </div>
            </div>
          </div>

          {/* Major Research Areas Section */}
          <div className="mb-40">
            <div className="mb-16 text-4xl font-bold text-title flex flex-col items-center">
              <span className="mb-4">주요 연구 분야</span>
              <div className="w-24 h-1.5 bg-title rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Area 1 */}
              <Card className="hover:shadow-2xl transition-all duration-500 border border-slate-100 group">
                <div className="h-64 p-6 overflow-hidden bg-slate-50">
                  <img
                    src="/images/research_area_1.jpg"
                    alt="Mobility motor steel material"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <CardHeader className="bg-slate-50/50">
                  <CardTitle className="text-2xl text-title font-bold">모빌리티 모터용 철강 소재</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-4">
                    <li className="flex items-start text-lg">
                      <span className="mr-3 text-title font-bold">•</span>
                      <span>전기차·드론 모터용 자성 철강 소재의 성능 향상</span>
                    </li>
                    <li className="flex items-start text-lg">
                      <span className="mr-3 text-title font-bold">•</span>
                      <span>저손실·고자속밀도 확보를 위한 공정 조건 최적화</span>
                    </li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {["고효율 철심 소재", "에너지 효율 향상", "도심형 드론", "전기자동차"].map((tag, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full border border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Area 2 */}
              <Card className="hover:shadow-2xl transition-all duration-500 border border-slate-100 group">
                <div className="h-64 p-6 overflow-hidden bg-slate-50">
                  <img
                    src="/images/research_area_2.webp"
                    alt="Magnetostrictive material for sensors"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <CardHeader className="bg-slate-50/50">
                  <CardTitle className="text-2xl text-title font-bold">항공기 및 선박 센서용 자왜 소재</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-4">
                    <li className="flex items-start text-lg">
                      <span className="mr-3 text-title font-bold">•</span>
                      <span>고강도·고성능 자왜 합금 소재 연구</span>
                    </li>
                    <li className="flex items-start text-lg">
                      <span className="mr-3 text-title font-bold">•</span>
                      <span>자왜 안정화를 위한 미세조직 제어 및 성분 설계</span>
                    </li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {["고감도 소재", "결빙 인식", "센서용 소재"].map((tag, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full border border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Area 3 */}
              <Card className="hover:shadow-2xl transition-all duration-500 border border-slate-100 group">
                <div className="h-64 p-6 overflow-hidden bg-slate-50">
                  <img
                    src="/images/research_area_3.webp"
                    alt="Material AI process and optimization"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <CardHeader className="bg-slate-50/50">
                  <CardTitle className="text-2xl text-title font-bold">재료 인공지능 공정 및 성분 최적 설계</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-4">
                    <li className="flex items-start text-lg">
                      <span className="mr-3 text-title font-bold">•</span>
                      <span>AI 기반 분석을 통한 공정·성분 조건의 최적 설계</span>
                    </li>
                    <li className="flex items-start text-lg">
                      <span className="mr-3 text-title font-bold">•</span>
                      <span>물성 예측 모델과 시뮬레이션을 활용한 신소재 개발</span>
                    </li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {["베이지안 최적화", "신소재 개발", "공정 최적화", "AI for Materials"].map((tag, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full border border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Area 4 */}
              <Card className="hover:shadow-2xl transition-all duration-500 border border-slate-100 group">
                <div className="h-64 p-6 overflow-hidden bg-slate-50">
                  <img
                    src="/images/research_area_4.webp"
                    alt="Texture and magnetic analysis"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <CardHeader className="bg-slate-50/50">
                  <CardTitle className="text-2xl text-title font-bold">금속 확산과 집합조직 및 자성 분석</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-4">
                    <li className="flex items-start text-lg">
                      <span className="mr-3 text-title font-bold">•</span>
                      <span>철강 확산 열처리에 따른 집합조직 형성과 변화 분석</span>
                    </li>
                    <li className="flex items-start text-lg">
                      <span className="mr-3 text-title font-bold">•</span>
                      <span>XRD, EBSD 기반 조직과 자기적 특성 상관관계 규명</span>
                    </li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {["XRD/EBSD 분석", "자성 특성", "3D 프린팅", "철강 압연 시뮬레이션"].map((tag, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full border border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResearchAreas;
