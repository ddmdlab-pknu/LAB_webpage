import { useState } from "react";
import { PageHead, groupOf } from "../ui";
import { galleryData, GalleryItem } from "../../data/galleryData";

// "(Oct 2026)_2026 KSHT Autumn Conference_Poster Presentation" → 날짜, 제목, 부제
function parse(c: string) {
  const m = c.match(/^\(([^)]+)\)_?(.*)$/);
  const date = m ? m[1] : "";
  const parts = (m ? m[2] : c).split("_");
  return { date, title: parts[0], sub: parts.slice(1).join(" · ") };
}

function Item({ item }: { item: GalleryItem }) {
  const imgs = item.imgs && item.imgs.length ? item.imgs : item.img ? [item.img] : [];
  const [i, setI] = useState(0);
  const { date, title, sub } = parse(item.comments);
  return (
    <figure className="gitem" style={{ margin: 0 }}>
      <div className="gimg">
        {imgs[i] && <img src={imgs[i]} alt={title} loading="lazy" />}
        {imgs.length > 1 && (
          <div className="gnav">
            <span>
              {i + 1}/{imgs.length}
            </span>
            <button type="button" aria-label="이전 사진" onClick={() => setI((i - 1 + imgs.length) % imgs.length)}>
              ←
            </button>
            <button type="button" aria-label="다음 사진" onClick={() => setI((i + 1) % imgs.length)}>
              →
            </button>
          </div>
        )}
      </div>
      <figcaption className="gtxt">
        {date && <span className="chip" style={{ width: "fit-content" }}>{date}</span>}
        <b>{title}</b>
        {sub && <span>{sub}</span>}
      </figcaption>
    </figure>
  );
}

function Gallery() {
  return (
    <>
      <PageHead label="Activities" title="Gallery" ko="학회, 워크숍, 연구실 행사 사진" group={groupOf("Activities")} />
      <section className="wrap band-s" style={{ paddingTop: 24 }}>
        <div className="gal">
          {galleryData.map((g) => (
            <Item key={g.comments} item={g} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Gallery;
