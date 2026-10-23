import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="wrap foot" id="contact">
      <div className="fpanel">
        <ul className="flinks">
          <li><Link to="/about/Overview">About</Link></li>
          <li><Link to="/project/ResearchAreas">Research</Link></li>
          <li><Link to="/project/PublishedPapers">Papers</Link></li>
          <li><Link to="/activities/News">News</Link></li>
          <li><Link to="/about/Members">People</Link></li>
          <li><Link to="/about/Pi">Leader</Link></li>
          <li><Link to="/facilities/Facilities">Facilities</Link></li>
          <li><Link to="/join_us/Join_us">Join us</Link></li>
        </ul>
        <div className="fmark" aria-label="DDMD">
          <span>D</span>
          <span>D</span>
          <span>M</span>
          <span>D</span>
        </div>
        <div className="fcontact">
          <b>Data Driven Material Design Lab</b>
          <br />
          공학1관 1001호
          <br />
          +82-51-629-6378
          <br />
          newtain@pknu.ac.kr
        </div>
        <div className="legal">
          <span>
            Department of Materials System Engineering, Pukyong National University · 45 Yongso-ro, Nam-gu, Busan
            48513
          </span>
          <span>© DDMD Lab · made by @Ha Jun Seo</span>
          <a href="https://info.flagcounter.com/0UwV" aria-label="방문자 국가 통계">
            <img
              src="https://s11.flagcounter.com/count2/0UwV/bg_111110/txt_9D978F/border_111110/columns_2/maxflags_10/viewers_0/labels_0/pageviews_1/flags_0/percent_0/"
              alt="Flag Counter"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
