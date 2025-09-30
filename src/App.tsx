import { Routes, Route } from "react-router-dom";
import { HashRouter } from "react-router-dom";

import { GelMain } from "./routes/GelMain";
import { ErrorPage } from "./routes/ErrorPage";
import { AboutPage } from "./routes/AboutPage";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/">
          <Route index element={<AboutPage />} />
          <Route path="create" element={<GelMain />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
