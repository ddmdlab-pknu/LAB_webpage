import { PageHead, groupOf } from "../ui";
import { PIBlock } from "../sections";
import { patentSummary, patents } from "../../data/piData";

function Leader() {
  const groups = [patents.krLead, patents.krCo, patents.pctLead, patents.pctCo];
  const s = patentSummary;
  return (
    <>
      <PageHead label="About" title="Leader" ko="지도교수 박세민 · 경력, 특허, 대표 논문" group={groupOf("About")} />
      <section className="wrap band-s">
        <PIBlock full />
      </section>
      <section className="wrap band-s">
        <h2 className="h" style={{ marginBottom: 16 }}>특허 목록</h2>
        <p className="body" style={{ marginBottom: 8 }}>
          국내 등록 {s.krRegistered}건(대표 발명 {s.krRegisteredLead}, 공동 {s.krRegistered - s.krRegisteredLead}), 모두 권리 유지 중 · 국내 출원 전체{" "}
          {s.krApplications}건(심사 중 {s.krPending}) · PCT {s.pct}건(대표 발명 {s.pctLead}) · 해외 등록 {s.overseasGranted}건
        </p>
        <p className="cap" style={{ marginBottom: 32 }}>
          포스코 기술연구원 재직(2014–2023)과 POSTECH 박사과정 중 출원. KIPRIS·Google Patents 대조, {s.asOf} 기준
        </p>
        <div className="grid2">
          {groups.map((g) => (
            <div key={g.label} className="tile">
              <div className="txt">
                <h3>
                  {g.label} {g.count}건
                </h3>
                <ul className="dots mute">
                  {g.items.map((p) => (
                    <li key={p} style={{ fontSize: 14 }}>
                      {p}
                    </li>
                  ))}
                </ul>
                {g.count > g.items.length && (
                  <p>외 {g.count - g.items.length}건</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="wrap band-s">
        <h2 className="h" style={{ marginBottom: 32 }}>자격 인증</h2>
        <div className="split" style={{ alignItems: "center" }}>
          <div className="cream" style={{ maxWidth: 520 }}>
            <img src="/images/Certificate_Prof.webp" alt="Pandat 트레이너 인증서" style={{ width: "100%", display: "block" }} loading="lazy" />
          </div>
          <div>
            <p className="h3">Pandat 공인 트레이너</p>
            <p className="body">
              CompuTherm의 Pandat 6개 모듈(다성분 합금의 열역학·동역학 계산) 교육을 마치고, 국내 Pandat 트레이너 자격을
              받았습니다.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Leader;
