import { Routes, Route, BrowserRouter } from "react-router-dom";

import { GelMain } from "./routes/GelMain";
import { ErrorPage } from "./routes/ErrorPage";
import { GelCreate } from "../../Dev/prior/GelCreate";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<GelMain />} />
          <Route path="create" element={<GelCreate />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
