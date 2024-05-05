import { Routes, Route, Outlet } from "react-router-dom";

import Home from 'v1-check/views/Home.tsx';
import Results from 'v1-check/views/Results.tsx';
import About from 'v1-check/views/About.tsx';
import NotFound from 'v1-check/views/NotFound.tsx';

export default function App() {
  return (
    <Routes>
      <Route path="/check" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path=":urlToScan" element={<Results />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (<Outlet />);
}
