import Card, { CardContent } from "../components/Card";
import FacilityBoxMd from "../components/FacilityBoxMd";

function Facilities() {
  const MicrostructureandTexture = [
    {
      img: "/images/EBSD.jpg",
      name: "EBSD",
    },
    {
      img: "/images/mini SEM.jpg",
      name: "Mini SEM",
    },
    {
      img: "/images/electro polish.jpg",
      name: "Electrolytic Polisher",
    },
    {
      img: "/images/auto polisher.jpg",
      name: "Auto Polishing Machine",
    },
    {
      img: "/images/mounting.jpg",
      name: "Mounting Machine",
    },
    {
      img: "/images/OM.jpg",
      name: "Optical Microscope",
    },
  ];

  const MaterialDefectAnalysis = [
    {
      img: "/images/3D_CT.jpg",
      name: "3D CT",
    },
    {
      img: "/images/인장시험기.png",
      name: "인장시험기기",
    },
  ];

  return (
    <div>
      <div className="mx-[10%] mt-12">
        <div className="flex justify-center items-center flex-col">
          <div className="mb-20">
            <div className="text-center text-[60px] lg:mb-28 mb-16 text-title animate-[gotoDown_0.7s_ease-in-out_both]">
              <span>FACILITIES</span>
            </div>
          </div>
          <div>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                  Microstructure and Texture
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MicrostructureandTexture.map((info) => {
                    return <FacilityBoxMd info={info} />;
                  })}
                </div>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                  Furnace
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center">
                    <img
                      className="w-[400px] h-[300px] object-cover rounded-md mb-2"
                      src="/images/열처리.jpg"
                      alt=""
                    />
                    <div className="font-bold">
                      {"Gas Furnace (H decarburization & diffusion)"}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <img
                      className="w-[300px] h-[320px] object-cover rounded-md mb-2"
                      src="/images/heat furnace.jpg"
                      alt=""
                    />
                    <div className="font-bold">Heat Furnace</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                  3D Printing & Material Defect Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MaterialDefectAnalysis.map((info) => {
                    return <FacilityBoxMd info={info} />;
                  })}
                  <div className="flex flex-col items-center">
                    <img
                      className="w-[150px] h-[150px] object-cover rounded-md mb-4"
                      src="/images/재질결함분석1.jpg"
                      alt=""
                    />
                    <img
                      className="w-[150px] h-[150px] object-cover rounded-md"
                      src="/images/재질결함분석2.jpg"
                      alt=""
                    />
                    <div className="font-bold">재질결함분석</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <img
                      className="w-[400px] h-[300px] object-cover rounded-md mb-2"
                      src="/images/3D profiler.jpg"
                      alt=""
                    />
                    <div className="font-bold">3D Profiler</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                  Simulation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex items-center">
                  <img
                    className="w-[394px] h-[130px] object-cover rounded-md"
                    src="/images/pandat_1.png"
                    alt=""
                  />
                  <img
                    className="w-[310px] h-[130px] object-cover rounded-md"
                    src="/images/oim_logo.webp"
                    alt=""
                  />
                  <img
                    className="w-[305px] h-[165px] object-cover rounded-md"
                    src="/images/python_ai.jpg"
                    alt=""
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Facilities;
