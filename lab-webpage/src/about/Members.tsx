import MembersProfile from "../components/MembersProfile";
import { members, alumni } from "../data/membersData";

function Members() {
  const MemebersInfo = members;

  return (
    <div>
      <div className="mt-12">
        <div className="flex justify-center">
          <div>
            <div className="text-center lg:mb-28 mb-16 flex justify-center items-center flex-col">
              <span className="text-title text-[60px] mb-28 animate-[gotoDown_0.7s_ease-in-out_both]">
                MEMBERS
              </span>
              <div className="flex items-center justify-center grid lg:grid-cols-2 grid-cols-1">
                {MemebersInfo.map((info) => {
                  return <MembersProfile key={info.name} info={info} />;
                })}
              </div>
              {alumni.length > 0 && (
                <div className="mt-24 w-full">
                  <span className="text-title text-[40px]">ALUMNI</span>
                  <div className="mt-10 grid lg:grid-cols-2 grid-cols-1 gap-4">
                    {alumni.map((a) => (
                      <div key={a.name} className="bg-white p-4 text-start">
                        <div className="text-lg font-bold text-title">{a.name}</div>
                        <div className="text-gray-600">
                          {a.edu} · Graduated {a.graduated}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Members;
