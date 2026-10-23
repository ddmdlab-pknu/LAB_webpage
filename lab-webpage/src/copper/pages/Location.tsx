import { PageHead, groupOf } from "../ui";

function Location() {
  return (
    <>
      <PageHead label="About" title="Location" ko="국립부경대학교 대연캠퍼스 공학1관 1001호" group={groupOf("About")} />
      <section className="wrap band-s">
        <dl className="info">
          <div>
            <dt>Address</dt>
            <dd>
              부산광역시 남구 용소로 45
              <br />
              국립부경대학교 공학1관 1001호 (48513)
            </dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>+82-51-629-6378</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>newtain@pknu.ac.kr</dd>
          </div>
        </dl>
        <div className="map">
          <iframe
            title="연구실 위치 지도"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d815.7515126450805!2d129.10299731930297!3d35.13152254993364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568ed4214847607%3A0x43c9c1bf922f3c60!2z67aA6rK964yA7ZWZ6rWQIOqzte2VmSAx6rSA!5e0!3m2!1sko!2skr!4v1732546521315!5m2!1sko!2skr"
            loading="lazy"
          />
        </div>
      </section>
    </>
  );
}

export default Location;
