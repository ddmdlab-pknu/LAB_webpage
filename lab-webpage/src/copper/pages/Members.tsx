import { useState } from "react";
import { PageHead, groupOf, krName, enName } from "../ui";
import { masters, undergraduates, alumni, Member } from "../../data/membersData";

const SECTIONS: { key: string; ko: string; members: Member[] }[] = [
  { key: "Master Course", ko: "석사과정", members: masters },
  { key: "Undergraduate", ko: "학부연구생", members: undergraduates },
  { key: "Alumni", ko: "졸업생", members: alumni },
];

function Members() {
  const [tab, setTab] = useState(SECTIONS[0].key);
  const sec = SECTIONS.find((s) => s.key === tab)!;
  return (
    <>
      <PageHead label="About" title="Members" ko="재료를 알고, 코드를 쓰는 사람들" group={groupOf("About")} />
      <section className="wrap band-s">
        <div className="seg" role="tablist" aria-label="구성원 구분">
          {SECTIONS.map((s) => (
            <button key={s.key} type="button" role="tab" aria-selected={s.key === tab} onClick={() => setTab(s.key)}>
              {s.key} · {s.members.length}
            </button>
          ))}
        </div>
        <div key={tab} className="grid2 fade" style={{ marginTop: 28 }}>
          {sec.members.length === 0 && <p className="empty">Coming soon.</p>}
          {sec.members.map((m) => (
            <article key={m.name} className="mcard">
              <div className="ph">
                <img src={m.profileImg} alt={krName(m.name)} loading="lazy" />
              </div>
              <div>
                <b>
                  {krName(m.name)}
                  <small>{enName(m.name)}</small>
                </b>
                <dl>
                  <dt>Course</dt>
                  <dd>{m.edu || sec.ko}</dd>
                  <dt>Major</dt>
                  <dd>{m.major}</dd>
                  {m.email && (
                    <>
                      <dt>Email</dt>
                      <dd>{m.email}</dd>
                    </>
                  )}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default Members;
