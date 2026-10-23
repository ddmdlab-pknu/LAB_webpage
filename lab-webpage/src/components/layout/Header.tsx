import { useEffect, useState } from "react";

function Header() {
  const [width, setWidth] = useState(window.innerWidth);
  const [isLarge, setIsLarge] = useState(Boolean);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (width >= 1024) {
      setIsLarge(true);
    } else {
      setIsLarge(false);
    }
  }, [width]);

  return (
    <div className="flex justify-between items-center lg:h-20 h-14 bg-white relative border-b border-border">
      <div className="ml-12">
        <a href="/">
          <img
            className="lg:w-20 lg:h-16 w-16 h-[54px] block m-auto"
            alt="lab logo"
            src="/images/lab-logo.png"
          />
        </a>
      </div>
      {isLarge ? (
        <div>
          {/* PC mode */}
          <div className="peer h-20 flex items-center">
            <nav>
              <ul className="flex justify-end mr-12">
                <li className="flex w-36 h-10 justify-center items-center">
                  <a href="/about/Overview">ABOUT</a>
                </li>
                <li className="flex w-36 h-10 justify-center items-center">
                  <a href="/project/Project">PROJECT</a>
                </li>
                <li className="flex w-36 h-10 justify-center items-center">
                  <a href="/facilities/Facilities">FACILITIES</a>
                </li>
                <li className="flex w-36 h-10 justify-center items-center">
                  <a href="/activities/Gallery">ACTIVITIES</a>
                </li>
                <li className="flex w-36 h-10 justify-center items-center">
                  <a href="/join_us/Join_us">JOIN US</a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="w-full hidden h-56 bg-white absolute top-[30px] right-0 z-20 peer-hover:block hover:block border-b border-border animate-[gotoDownLow_0.4s_ease-in-out_both] ">
            <nav>
              <ul className="flex justify-end mr-12">
                <li className="flex w-36 h-10 justify-center items-start">
                  <ul className="flex flex-col justify-center items-center">
                    <li className="flex justify-center items-center h-[54px]">
                      <a href="/about/Overview">OVERVIEW</a>
                    </li>
                    <li className="flex justify-center items-center h-[54px]">
                      <a href="/about/Pi">LEADER</a>
                    </li>
                    <li className="flex justify-center items-center h-[54px]">
                      <a href="/about/Members">MEMBERS</a>
                    </li>
                    <li className="flex justify-center items-center h-[54px]">
                      <a href="/about/Location">LOCATION</a>
                    </li>
                  </ul>
                </li>
                <li className="flex w-36 h-10 justify-center items-start">
                  <ul className="flex flex-col justify-center items-center">
                    <li className="flex justify-center items-center h-[54px] text-center">
                      <a href="/project/MustReadPapers">MUST READ PAPERS</a>
                    </li>
                    <li className="flex justify-center items-center h-[54px] text-center">
                      <a href="/project/PublishedPapers">PUBLISHED PAPERS</a>
                    </li>
                    <li className="flex justify-center items-center h-[54px] text-center">
                      <a href="/project/ResearchAreas">RESEARCH AREAS</a>
                    </li>
                    <li className="flex justify-center items-center h-[54px]">
                      <a href="/project/Project">PROJECT</a>
                    </li>
                  </ul>
                </li>

                <li className="flex w-36 h-12 justify-center items-center">
                  <a href="/facilities/Facilities">FACILITIES</a>
                </li>
                <li className="flex w-36 h-10 justify-center items-start">
                  <ul className="flex flex-col justify-center items-center">
                    <li className="flex justify-center items-center h-[54px]">
                      <a href="/activities/News">NEWS</a>
                    </li>
                    <li className="flex justify-center items-center h-[54px]">
                      <a href="/activities/Gallery">GALLERY</a>
                    </li>
                    <li className="flex justify-center items-center h-[54px]">
                      <a href="/activities/LabGame">LAB GAME</a>
                    </li>
                  </ul>
                </li>
                <li className="flex w-36 h-12 justify-center items-center">
                  <a href="/join_us/Join_us">JOIN US</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        <div className="">
          {/* Mobile mode */}
          <button className="mr-5" onClick={toggleSidebar}>
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          {/* 사이드바 */}
          <div
            className={`fixed top-0 right-0 h-full bg-white z-50 transform transition-transform border-l border-border ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            } ${width <= 500 ? "w-full" : "w-[350px]"}`}
          >
            {/* 닫기 버튼 */}
            <button
              className="absolute top-5 right-5 text-xl"
              onClick={closeSidebar}
            >
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>

            <nav className="mt-14">
              <ul className="flex flex-col mt-10">
                <li className="py-4 border-y border-border">
                  <a href="/about/Overview" className="text-xl ml-5">
                    ABOUT
                  </a>
                  <ul className="ml-8">
                    <li className="mt-3">
                      <a href="/about/Overview">Overview</a>
                    </li>
                    <li className="mt-3">
                      <a href="/about/Pi">Leader</a>
                    </li>
                    <li className="mt-3">
                      <a href="/about/Members">Members</a>
                    </li>
                    <li className="mt-3">
                      <a href="/about/Location">Location</a>
                    </li>
                  </ul>
                </li>
                <li className="py-4 border-b border-border">
                  <a href="/project/Project" className="text-xl ml-5">
                    PROJECT
                  </a>
                  <ul className="ml-8">
                    <li className="mt-3">
                      <a href="/project/MustReadPapers">Must Read Papers</a>
                    </li>
                  </ul>
                  <ul className="ml-8">
                    <li className="mt-3">
                      <a href="/project/PublishedPapers">Published Papers</a>
                    </li>
                  </ul>
                  <ul className="ml-8">
                    <li className="mt-3">
                      <a href="/project/ResearchAreas">Research Areas</a>
                    </li>
                  </ul>
                  <ul className="ml-8">
                    <li className="mt-3">
                      <a href="/project/Project">Project</a>
                    </li>
                  </ul>
                </li>
                <li className="py-4 border-b border-border">
                  <a href="/facilities/Facilities" className="text-xl ml-5">
                    FACILITIES
                  </a>
                </li>
                <li className="py-4 border-b border-border">
                  <a href="/activities/Gallery" className="text-xl ml-5">
                    ACTIVITIES
                  </a>
                  <ul className="ml-8">
                    <li className="mt-3">
                      <a href="/activities/News">NEWS</a>
                    </li>
                    <li className="mt-3">
                      <a href="/activities/Gallery">GALLERY</a>
                    </li>
                    <li className="mt-3">
                      <a href="/activities/LabGame">LAB GAME</a>
                    </li>
                  </ul>
                </li>
                <li className="py-4 border-b border-border">
                  <a href="/join_us/Join_us" className="text-xl ml-5">
                    JOIN US
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
