import { Routes, Route, BrowserRouter } from "react-router-dom";

import { GelMain } from "./routes/GelMain";
import { ErrorPage } from "./routes/ErrorPage";
import { AboutPage } from "./routes/AboutPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<AboutPage />} />
          <Route path="create" element={<GelMain />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
