import { Routes, Route, BrowserRouter } from "react-router-dom";

import { GelCreatorPage } from "./routes/GelEntry";
import { ErrorPage } from "./routes/ErrorPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<GelCreatorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
