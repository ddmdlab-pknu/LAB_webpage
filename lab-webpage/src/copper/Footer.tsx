import { Link } from "react-router-dom";

// 바닥글: 연구실 이름을 블록으로 쌓아 크게 닫는다 (민트 바탕 = 자석의 S극, 바로 위 지원 안내의 분홍 = N극)
const BLOCKS = [
  { ch: "D", h: 1, tone: "ink" },
  { ch: "D", h: 0.72, tone: "acc" },
  { ch: "M", h: 0.88, tone: "ink" },
  { ch: "D", h: 0.64, tone: "acc" },
];

function Footer() {
  const W = 1000,
    H = 300,
    gap = 6,
    bw = (W - gap * 3) / 4;
  return (
    <footer className="foot" id="contact">
      <div className="wrap">
        <svg className="blocks" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="DDMD">
          {BLOCKS.map((b, i) => {
            const x = i * (bw + gap),
              h = H * b.h;
            return (
              <g key={i}>
                <rect x={x} y={H - h} width={bw} height={h} className={b.tone} />
                <text x={x + bw / 2} y={H - 36} textAnchor="middle">
                  {b.ch}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="foot-grid">
          <ul className="flinks">
            <li><Link to="/about/Overview">About</Link></li>
            <li><Link to="/about/Pi">Leader</Link></li>
            <li><Link to="/about/Members">People</Link></li>
            <li><Link to="/about/Location">Location</Link></li>
            <li><Link to="/project/ResearchAreas">Research</Link></li>
            <li><Link to="/project/PublishedPapers">Papers</Link></li>
            <li><Link to="/facilities/Facilities">Facilities</Link></li>
            <li><Link to="/activities/News">News</Link></li>
            <li><Link to="/activities/Gallery">Gallery</Link></li>
            <li><Link to="/join_us/Join_us">Join us</Link></li>
          </ul>
          <address className="fcontact">
            <b>Data Driven Material Design Lab</b>
            국립부경대학교 공학1관 1001호
            <br />
            부산광역시 남구 용소로 45 (48513)
            <br />
            +82-51-629-6378 · newtain@pknu.ac.kr
          </address>
        </div>
        <div className="legal">
          <span>© DDMD Lab · Department of Materials System Engineering, Pukyong National University · made by @Ha Jun Seo</span>
          <a href="https://info.flagcounter.com/0UwV" className="flag" aria-label="방문자 국가 통계">
            <img
              src="https://s11.flagcounter.com/count2/0UwV/bg_C3EDCE/txt_0A0A0A/border_C3EDCE/columns_2/maxflags_10/viewers_0/labels_0/pageviews_1/flags_0/percent_0/"
              alt="방문자 국가 통계"
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.display = "none";
              }}
            />
          </a>
          <a className="btn small" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); }}>
            맨 위로 <i>↑</i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
