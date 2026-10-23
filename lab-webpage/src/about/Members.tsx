import { useState } from "react";
import MembersProfile from "../components/MembersProfile";
import { masters, undergraduates, alumni } from "../data/membersData";

function Members() {
  const sections = [
    { title: "Master Course", members: masters },
    { title: "Undergraduate", members: undergraduates },
    { title: "Alumni", members: alumni },
  ];

  const [activeTab, setActiveTab] = useState("Master Course");
  const activeSection = sections.find((s) => s.title === activeTab)!;

  return (
    <div>
      <div className="mt-12">
        <div className="flex justify-center">
          <div>
            <div className="text-center lg:mb-28 mb-16 flex justify-center items-center flex-col">
              <span className="sr-only">
                MEMBERS
              </span>
              <div
                role="tablist"
                className="flex justify-center gap-6 min-[500px]:gap-12 mb-12"
              >
                {sections.map((section) => {
                  const isActive = section.title === activeTab;
                  return (
                    <button
                      key={section.title}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(section.title)}
                      className={`pb-2 text-base min-[500px]:text-xl border-b-2 transition-colors duration-200 ${
                        isActive
                          ? "text-title font-bold border-title"
                          : "text-my_name border-transparent hover:text-title"
                      }`}
                    >
                      {section.title}
                    </button>
                  );
                })}
              </div>
              <div
                key={activeTab}
                className="flex items-center justify-center grid lg:grid-cols-2 grid-cols-1 animate-fade-in"
              >
                {activeSection.members.length > 0 ? (
                  activeSection.members.map((info) => (
                    <MembersProfile key={info.name} info={info} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-my_name">
                    Coming soon.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Members;
