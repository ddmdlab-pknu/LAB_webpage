function Overview() {
  return (
    <div>
      <div className="mx-[10%] mt-10">
        <div className="flex justify-center">
          <div>
            <div className="flex justify-center text-[60px] lg:mb-28 mb-16 text-title animate-[gotoDown_0.7s_ease-in-out_both]">
              <span className="mb-5">OVERVIEW</span>
            </div>
            <div className="flex justify-center items-start flex-col lg:flex-row">
              <div className="w-full">
                <div className="lg:mt-20 mt-5 flex justify-center items-center">
                  <img
                    alt="logo"
                    src="/images/logo(2).webp"
                    className="block w-[400px] h-[400px]"
                  />
                </div>
              </div>

              <div className="w-[90%] mt-10 ">
                <div className="inline-block mb-6 leading-6 text-lg font-medium">
                  <div className="mb-4 text-2xl font-bold text-title flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                      />
                    </svg>
                    Introduce
                  </div>
                  <div className="ml-2">
                    <b className="ml-2">Data Driven Material Design Lab</b>{" "}
                    focuses on improving the properties of magnetic materials,
                    such as steel cores, which are essential in advanced
                    mobility applications. We conduct research on vacuum and gas
                    heat treatments, analyze magnetic properties, and evaluate
                    texture and rolling characteristics. Additionally, we
                    develop new materials by optimizing various processes using
                    AI and predicting material properties through metal material
                    simulations.
                  </div>
                </div>
                <div className="inline-block mb-5 pt-6 leading-6 text-lg font-medium">
                  <div className="mb-5 text-2xl font-bold text-title flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                      />
                    </svg>
                    We research on
                  </div>
                  <div className="ml-2">
                    <div className="flex mb-2">
                      <div className="mr-2 mt-3 w-1 h-1 bg-title"></div>
                      <div className="w-[95%]">
                        {
                          "Improve the properties (magnetic characteristics and texture) of steel cores for motors and transformers used in electric vehicles, drones, and robots"
                        }
                      </div>
                    </div>
                    <div className="flex mb-2">
                      <div className="mr-2 mt-3 w-1 h-1 bg-title"></div>
                      <div className="w-[95%]">
                        Optimizing materials or process systems using AI
                      </div>
                    </div>
                    <div className="flex mb-2">
                      <div className="mr-2 mt-3 w-1 h-1 bg-title"></div>
                      <div className="w-[95%]">
                        {
                          "Prediction of material properties and development of new materials through metal material simulation(Pandat)"
                        }
                      </div>
                    </div>
                    <div className="flex mb-2">
                      <div className="mr-2 mt-3 w-1 h-1 bg-title"></div>
                      <div className="w-[95%]">
                        Research on the development of new magnetic materials
                      </div>
                    </div>
                    <div className="flex mb-2">
                      <div className="mr-2 mt-3 w-1 h-1 bg-title"></div>
                      <div className="w-[95%]">
                        Research on improving material properties using rolling
                        technology for steel materials
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 font-semibold">
                  데이터 융합 철강소재 설계 연구실
                  <strong className="pl-5 font-bold text-xl">
                    Prof. 박세민
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
