import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { SITE_DESIGN } from "./siteDesign";

// 디자인은 src/siteDesign.ts 한 곳에서 고른다. 고르지 않은 쪽 코드는 내려받지 않는다.
const ClassicSite = React.lazy(() => import("./ClassicSite"));
const CopperApp = React.lazy(() => import("./copper/CopperApp"));

// 스크립트가 도는 경우에만 등장 움직임을 켠다 (스크립트가 없으면 모든 내용이 처음부터 보인다)
document.documentElement.classList.add("js");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {SITE_DESIGN === "copper" ? (
        <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8f8f8" }} />}>
          <CopperApp />
        </Suspense>
      ) : (
        <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
          <ClassicSite />
        </Suspense>
      )}
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
