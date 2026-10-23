interface InfoProps {
  info: {
    name: string;
    profileImg: string;
    edu: string;
    major: string;
    email?: string;
  };
}

const MembersProfile = (info: InfoProps) => {
  return (
    <div className="w-full h-full bg-white my-8 p-4 lg:mr-10 flex flex-col min-[500px]:flex-row items-center min-[500px]:items-start">
      <div className="w-48 aspect-[3/4] shrink-0 mb-5">
        <img
          className="w-full h-full object-cover rounded-md"
          src={info.info.profileImg}
          alt=""
        />
      </div>
      <div className="ml-4 mt-1 flex flex-col items-start justify-center">
        <div className="mb-6 text-lg font-bold text-title flex items-center">
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
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          {info.info.name}
        </div>
        {info.info.edu && <div className="mb-2">{info.info.edu}</div>}
        <div className="mb-2 text-start">{info.info.major}</div>
        {info.info.email && <div className="">{info.info.email}</div>}
      </div>
    </div>
  );
};

export default MembersProfile;
