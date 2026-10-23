import React, { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import Modal from "../components/Modal";
import { projects, EffectPart, Status } from "./projectData";

// 상태 뱃지 색상
const statusBadgeClass = (status: Status) =>
  status === "Done"
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-amber-100 text-amber-700 border-amber-200";

// 이미지 로드 실패 시 대체 배경색(배너 그라데이션/회색) 표시
const hideOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

// 기대 효과 한 줄 렌더링 (강조 조각 포함)
const renderEffect = (parts: EffectPart[]): ReactNode =>
  parts.map((part, i) =>
    part.bold ? (
      <span key={i} className="font-bold text-green-800">
        {part.text}
      </span>
    ) : (
      <React.Fragment key={i}>{part.text}</React.Fragment>
    )
  );

function Project() {
  const [openProject, setOpenProject] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="sr-only">
        Projects
      </h1>

      {/* ===================== 프로젝트 카드 목록 ===================== */}
      <div className="max-w-4xl mx-auto space-y-10">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer group"
            onClick={() => setOpenProject(project.id)}
          >
            <div className={`relative h-64 overflow-hidden ${project.bannerClass}`}>
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                onError={hideOnError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                    {project.category}
                  </span>
                  <p className="text-sm font-medium opacity-90">{project.org}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/90 text-blue-900 px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  Click for Details
                </span>
              </div>
            </div>

            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-blue-900 mb-2 flex items-center gap-3">
                {project.title}
                <span
                  className={`${statusBadgeClass(
                    project.status
                  )} text-xs font-bold px-3 py-1 rounded-full border shadow-sm`}
                >
                  {project.status}
                </span>
              </CardTitle>
              <p className="text-lg font-medium text-gray-700">
                {project.description}
              </p>
              <p className="text-sm text-gray-500 italic mt-2">
                {project.englishTitle}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* ===================== 프로젝트 상세 모달 ===================== */}
      {projects.map((project) => (
        <Modal
          key={project.id}
          isOpen={openProject === project.id}
          onClose={() => setOpenProject(null)}
          title="Project Details"
        >
          <div className="space-y-8">
            <div
              className={`relative h-80 w-full overflow-hidden rounded-xl shadow-inner ${project.bannerClass}`}
            >
              <img
                src={project.image}
                alt={`${project.title} Detail`}
                className="w-full h-full object-cover"
                onError={hideOnError}
              />
            </div>

            <div className="border-b pb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center gap-3">
                {project.title}
                <span
                  className={`${statusBadgeClass(
                    project.status
                  )} text-xs font-bold px-3 py-1 rounded-full border`}
                >
                  {project.status}
                </span>
              </h2>
              <p className="text-lg text-gray-800 font-medium">
                {project.description}
              </p>
            </div>

            <CardContent className="space-y-8 !p-0">
              {/* 연구 개요 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div>
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    연구 기간
                  </h4>
                  <p className="text-gray-700 text-base">{project.period}</p>
                  {project.periodSub && (
                    <p className="text-gray-500 text-sm mt-1">
                      {project.periodSub}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M11 15h.01M15 7h.01M15 11h.01M15 15h.01"
                      />
                    </svg>
                    키워드
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-white text-blue-800 text-xs px-3 py-1 rounded-full shadow-sm border border-blue-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 세부 연구 내용 */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-blue-600 mr-4 rounded-full"></span>
                  주요 연구 내용
                </h3>
                <ul className="space-y-6">
                  {project.research.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start bg-gray-50 p-5 rounded-lg hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200"
                    >
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-base font-bold mr-4">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-gray-900 text-base block mb-1">
                          {item.title}
                        </strong>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 기대 효과 */}
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-green-500 mr-4 rounded-full"></span>
                  기대 효과
                </h3>
                <div className="bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
                  <ul className="flex flex-col gap-4">
                    {project.effects.map((effect, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-gray-700 text-base"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{renderEffect(effect)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 연구 성과 */}
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-purple-600 mr-4 rounded-full"></span>
                  연구 성과
                </h3>
                {project.achievements ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {project.achievements.stats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="bg-purple-50 p-5 rounded-xl border border-purple-100 flex flex-col items-center text-center shadow-sm"
                        >
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-3">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={stat.iconPath}
                              />
                            </svg>
                          </div>
                          <h4 className="font-bold text-purple-900 mb-1">
                            {stat.label}
                          </h4>
                          <p className="text-purple-700 text-2xl font-black">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h5 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">
                        상세 성과 목록
                      </h5>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {project.achievements.list.map((entry, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            <span>{entry}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                    <p className="text-gray-500 text-base">
                      연구 진행 중입니다. 성과는 추후 업데이트될 예정입니다.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>

            <div className="mt-8 text-center border-t pt-8">
              <button
                onClick={() => setOpenProject(null)}
                className="px-8 py-3 bg-blue-900 text-white rounded-full font-bold hover:bg-blue-800 transition-colors shadow-lg"
              >
                닫기
              </button>
            </div>
          </div>
        </Modal>
      ))}
    </div>
  );
}

export default Project;
