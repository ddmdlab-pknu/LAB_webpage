function Location() {
  return (
    <div>
      <div className="mx-[10%] mt-12">
        <div className="flex justify-center items-center flex-col">
          <div>
            <div className="sr-only">
              <span>LOCATION</span>
            </div>
          </div>
          <iframe
            title="Google Maps showing our office location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d815.7515126450805!2d129.10299731930297!3d35.13152254993364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568ed4214847607%3A0x43c9c1bf922f3c60!2z67aA6rK964yA7ZWZ6rWQIOqzte2VmSAx6rSA!5e0!3m2!1sko!2skr!4v1732546521315!5m2!1sko!2skr"
            width="90%"
            height="450"
            className="b-0"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Location;
