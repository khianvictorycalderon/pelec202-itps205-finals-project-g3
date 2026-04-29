import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BrowsePage from "./pages/BrowsePage";
import RecordPage from "./pages/RecordPage";
import ErrorPage from "./pages/ErrorPage";
import Layout from "./pages/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<LandingPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/record/:id" element={<RecordPage />} />
      </Route>
      <Route path="*" element={<ErrorPage/>} />
    </Routes>
  );
}

export default App;