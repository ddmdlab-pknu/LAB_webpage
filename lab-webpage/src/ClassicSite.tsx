// 리뉴얼 전 디자인(classic). src/siteDesign.ts 에서 "classic"을 고르면 이 화면이 나온다.
import App from "./App";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function ClassicSite() {
  return (
    <>
      <Header />
      <App />
      <Footer />
    </>
  );
}

export default ClassicSite;
