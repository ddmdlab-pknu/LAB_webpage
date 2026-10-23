import { PageHead, groupOf } from "../ui";
import { projects } from "../../project/projectData";

function Projects() {
  return (
    <>
      <PageHead label="Research" title="Projects" ko="수행 중이거나 마친 국책·산학 과제" group={groupOf("Research")} />
      <section className="wrap band-s">
        {projects.map((p, i) => (
          <details key={p.id} className="proj" open={i === 0}>
            <summary>
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <span className={p.status === "In Progress" ? "chip q1" : "chip"}>
                    {p.status === "In Progress" ? "진행 중" : "완료"}
                  </span>
                  <span className="chip">{p.category}</span>
                  <span className="chip">{p.period}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
              <span className="plus" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="pbody">
              <div>
                <p className="en">{p.englishTitle}</p>
                <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: 14 }}>{p.org}</p>
              </div>
              {p.image && (
                <img src={p.image} alt={p.title} loading="lazy" style={{ width: "100%", maxWidth: 720 }} />
              )}
              <div>
                <h4 className="sub">Keywords</h4>
                <div className="tagrow" style={{ paddingTop: 0 }}>
                  {p.keywords.map((k) => (
                    <span key={k} className="chip">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="sub">연구 내용</h4>
                <div className="ritems">
                  {p.research.map((r) => (
                    <div key={r.title}>
                      <b>{r.title}</b>
                      <span>{r.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="sub">기대 효과</h4>
                <ul className="dots mute">
                  {p.effects.map((line, li) => (
                    <li key={li}>
                      {line.map((part, pi) =>
                        part.bold ? (
                          <b key={pi} style={{ fontWeight: 600 }}>
                            {part.text}
                          </b>
                        ) : (
                          <span key={pi}>{part.text}</span>
                        )
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {p.achievements && (
                <div>
                  <h4 className="sub">성과</h4>
                  <div className="stats">
                    {p.achievements.stats.map((s) => (
                      <div key={s.label}>
                        <b>{s.value}</b>
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <ul className="dots mute" style={{ marginTop: 16 }}>
                    {p.achievements.list.map((l) => (
                      <li key={l} style={{ fontSize: 14 }}>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        ))}
      </section>
    </>
  );
}

export default Projects;
