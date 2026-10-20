import Card, { CardContent } from "../components/Card";
import { publicationsData } from "../data/publicationsData";

export default function ProfilePage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 py-12">
      {/* Header Section */}
      <span className="text-title text-[60px] flex justify-center items-center mb-28 animate-[gotoDown_0.7s_ease-in-out_both]">
        <div>LEADER</div>
      </span>
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
              <img
                src="/images/prof-profile.png"
                alt="Professor Semin Park"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4">
                {"Semin Park (박 세 민)"}
              </h1>
              <h2 className="text-2xl text-gray-600 mb-4">Professor</h2>
              <div className="flex flex-col md:flex-row gap-4 text-gray-600">
                <div className="flex items-center gap-2">
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
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>

                  <span>newtain@pknu.ac.kr</span>
                </div>
                <div className="flex items-center gap-2">
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
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>

                  <span>{"+82) 1037283568"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-around items-center lg:flex-row flex-col">
            <img
              className="w-[300px] h-[200px]"
              src="/images/PKNU_logo.svg"
              alt=""
            />

            <img
              className="w-[300px] h-[150px]"
              src="/images/posco-logo.png"
              alt=""
            />
            <img
              className="w-[300px] h-[200px]"
              src="/images/Certificate_Prof.png"
              alt=""
            />
          </div>
        </div>

        {/* Education Section */}
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
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
              Education
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">
                  {"POSTECH(Pohang University of science and technology)"}
                </h3>
                <p className="text-gray-600">
                  Ph.D. in Graduate Institute of Ferrous & Energy Materials
                  Technology
                </p>
                <p className="text-gray-500">Sep. 2010 - Feb. 2015</p>
                <p className="text-gray-500">Professor: Koo Yang Mo</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {"POSTECH(Pohang University of science and technology)"}
                </h3>
                <p className="text-gray-600">
                  M.S. in Graduate Institute of Ferrous & Energy Materials
                  Technology
                </p>
                <p className="text-gray-500">Sep. 2008 - Aug. 2010</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {"POSTECH(Pohang University of science and technology)"}
                </h3>
                <p className="text-gray-600">
                  B.S. in Department of Materials Science and Engineering
                </p>
                <p className="text-gray-500">Mar. 2003 - Aug. 2008</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research Interests */}
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
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              Research Interests
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                "Data driven metallurgy",
                "Meta-Optimization",
                "Steel (Electrical steel)",
                "Machine learning",
                "Magnetic properties",
              ].map((interest) => (
                <span
                  key={interest}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Publications */}
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
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
              Recent Publications (within 5 years)
            </h2>
            <div className="space-y-6">
              {publicationsData.map((pub, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold">{pub.title}</h3>
                  <p className="text-gray-600">
                    {pub.journal}, {pub.year}
                  </p>
                  <p className="text-gray-500">{pub.metrics}</p>
                </div>
              ))}
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
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
              Patents
            </h2>

            {/* PCT Representative */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                PCT Representative (5건)
              </h3>
              <div className="space-y-4">
                {[
                  "PCT/KR2020/017973 CN, EP, JP, US Grain-oriented electrical steel and its magnetic domain refinement method",
                  "PCT/KR19/018033 JP, EP, CN, US Grain-oriented electrical steel and its manufacturing method",
                  "PCT/KR2019/06220 JP, EP, CN, US Grain-oriented electrical steel and its magnetic domain refinement method",
                  "PCT/KR2018/16037 CN, DE, EP, FR, GB, JP Grain-oriented electrical steel and its magnetic domain refinement method",
                  "PCT/KR17/015204 JP, CN, US Grain-oriented electrical steel and its magnetic domain refinement method",
                ].map((patent, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{patent}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Domestic Representative */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Domestic Representative (11건)
              </h3>
              <div className="space-y-4">
                {[
                  "2020-0179368, 2438476, Grain-oriented electrical steel with superior noise characteristics",
                  "2020-0177989, 2462682, Grain-oriented electrical steel with superior noise characteristics",
                  "2019-0171286, 2276850, Process for magnetic domain refined grain-oriented electrical steel with superior magnetic properties",
                  "2019-0172496, 2395230, Process for temporary magnetic domain refined grain-oriented electrical steel with superior magnetic properties",
                  "2018-0165650, 10-2162984, Advanced process for permanent magnetic domain refinement of electrical steel",
                ].map((patent, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{patent}</p>
                  </div>
                ))}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 italic">... and 6 more patents</p>
                </div>
              </div>
            </div>

            {/* PCT Correspondence */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                PCT Correspondence (10건)
              </h3>
              <div className="space-y-4">
                {[
                  "PCT/KR17/015127 권오열 Grain-oriented electrical steel and its magnetic domain refinement method",
                  "PCT/KR17/015128 권오열 Magnetic domain refinement method for grain-oriented electrical steel",
                  "PCT/KR17/015205 권민석 Annealing separator composition for grain-oriented electrical steel, grain-oriented electrical steel and manufacturing method thereof",
                  "PCT/KR19/12027 홍성철 Foreign material trapping device and electrical steel manufacturing equipment including the same",
                  "PCT/KR19/17445 홍성철 Foreign material removal device and electrical steel manufacturing equipment including the same",
                ].map((patent, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{patent}</p>
                  </div>
                ))}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 italic">... and 5 more patents</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Technologies */}
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
                  d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                />
              </svg>
              Simulation Program and Techniques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Pandat (phase transformation, diffusion, phase field)",
                "OIM (texture analysis)",
                "AI machine learning & optimization",
              ].map((skill) => (
                <div key={skill} className="bg-gray-50 p-3 rounded">
                  {skill}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Awards */}
        <Card>
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
                  d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
                />
              </svg>
              Awards and Honors
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">
                  Pandat education trainer in south korea
                </h3>
                <p className="text-gray-600">(Jan. 2025)</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">POSCO Technology Award</h3>
                <p className="text-gray-600">
                  Grain-oriented electrical steel magnetic domain refinement
                  mass production development POSCO, Korea (Aug. 2018)
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">
                  POSCO Research Institute Director Citation
                </h3>
                <p className="text-gray-600">
                  Permanent magnetic domain refinement 23PHE080 mass production
                  development, POSCO, Korea (Dec. 2018)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
