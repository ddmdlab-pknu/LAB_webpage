import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./main/Mainpage";
import Overview from "./about/Overview";
import Location from "./about/Location";
import Leader from "./about/Leader";
import Members from "./about/Members";
import Project from "./project/Project";
import Gallery from "./activities/Gallery";
import Facilities from "./facilities/Facilities";
import News from "./activities/News";
import LabGame from "./activities/LabGame";
import ResearchAreas from "./project/ResearchArea";
import MustReadPapers from "./project/MustReadPapers";
import JoinUs from "./join_us/Join_us";
import PublishedPapers from "./project/PublishedPapers";
import PaperDetail from "./project/PaperDetail";

function App() {
  return (
    <div className="m-auto">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about/Overview" element={<Overview />} />
        <Route path="/about/Pi" element={<Leader />} />
        <Route path="/about/Location" element={<Location />} />
        <Route path="/about/Members" element={<Members />} />
        <Route path="/project/MustReadPapers" element={<MustReadPapers />} />
        <Route path="/project/PublishedPapers" element={<PublishedPapers />} />
        <Route
          path="/project/PublishedPapers/:paperId"
          element={<PaperDetail />}
        />
        <Route path="/project/ResearchAreas" element={<ResearchAreas />} />
        <Route path="/project/Project" element={<Project />} />
        <Route path="/facilities/Facilities" element={<Facilities />} />
        <Route path="/activities/News" element={<News />} />
        <Route path="/activities/Gallery" element={<Gallery />} />
        <Route path="/activities/LabGame" element={<LabGame />} />
        <Route path="/join_us/Join_us" element={<JoinUs />} />
      </Routes>
    </div>
  );
}

export default App;
