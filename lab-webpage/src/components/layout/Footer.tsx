import { useLocation } from "react-router-dom";

function Footer() {
  const { pathname } = useLocation();
  return (
    <footer className={`${pathname === "/" ? "" : "mt-24 "}bg-steel text-[#cfdbe7]`}>
      <div className="h-0.5 bg-gradient-to-r from-ipfr via-ipfg to-ipfb" />
      <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_auto]">
        <div className="min-w-0">
          <div className="text-xl font-semibold text-white">
            Data Driven Material Design Lab @PKNU
          </div>
          <div className="mt-1 text-[15px]">
            Advanced Steel Design & Data Processing-Based AI
          </div>
          <div className="mt-6 text-sm leading-relaxed">
            Department of Materials System Engineering, Pukyong National
            University, 45 Yongso-ro, Nam-gu, Busan, 48513 Republic of Korea
            <br />
            Office Engineering 1 Building 1001
          </div>
        </div>
        <div className="text-sm leading-7">
          <div className="font-mono text-xs tracking-widest text-white/60 mb-2">CONTACT</div>
          <div>Phone : +82-51-629-6378</div>
          <div>Email : newtain@pknu.ac.kr</div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            <a className="hover:text-white" href="/about/Overview">About</a>
            <a className="hover:text-white" href="/project/PublishedPapers">Papers</a>
            <a className="hover:text-white" href="/activities/News">News</a>
            <a className="hover:text-white" href="/join_us/Join_us">Join us</a>
          </div>
        </div>
        <div>
          <a href="https://info.flagcounter.com/0UwV">
            <img
              src="https://s11.flagcounter.com/count2/0UwV/bg_FFFFFF/txt_000000/border_CCCCCC/columns_2/maxflags_10/viewers_0/labels_0/pageviews_1/flags_0/percent_0/"
              alt="Flag Counter"
              className="rounded"
            />
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-5 text-xs text-white/60 flex flex-wrap justify-between gap-2">
          <span>© Data Driven Material Design Lab, Pukyong National University</span>
          <span>
            made by{" "}
            <a className="underline hover:text-white" href="/about/Members">
              @Ha Jun Seo
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
