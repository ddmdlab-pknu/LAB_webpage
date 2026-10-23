function Footer() {
  return (
    <div className="w-full bg-white block mt-32 flex flex-col md:flex-row justify-around items-center mb-20">
      <div className="ml-10">
        <div className="text-xl">Data Driven Material Design Lab @PKNU</div>
        <div className="text-xl mb-5">
          Advanced Steel Design & Data Processing-Based AI
        </div>
        <div>
          <div></div>Department of Materials System Engineering, Pukyong
          National University, 45 Yongso-ro, Nam-gu, Busan, 48513 Republic of
          Korea
        </div>
        <div className="mb-5">Office Engineering 1 Building 1001</div>
        <div>Phone : +82-51-629-6378</div>
        <div>Email : newtain@pknu.ac.kr</div>
        <div className="text-my_name">
          made by{" "}
          <a className="underline" href="/about/Members">
            @Ha Jun Seo
          </a>
        </div>
      </div>
      <div className="mr-10 md:mt-0 mt-10">
        <a href="https://info.flagcounter.com/0UwV" className="">
          <img
            className=""
            src="https://s11.flagcounter.com/count2/0UwV/bg_FFFFFF/txt_000000/border_CCCCCC/columns_2/maxflags_10/viewers_0/labels_0/pageviews_1/flags_0/percent_0/"
            alt="Flag Counter"
          />
        </a>
      </div>
    </div>
  );
}

export default Footer;
