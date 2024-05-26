import { Routes, Route, Outlet } from 'react-router-dom';

import Home from 'web-check-live/views/Home.tsx';
import Results from 'web-check-live/views/Results.tsx';
import About from 'web-check-live/views/About.tsx';
import NotFound from 'web-check-live/views/NotFound.tsx';

import ErrorBoundary from 'web-check-live/components/boundaries/PageError.tsx';
import GlobalStyles from './styles/globals.tsx';

const Layout = () => {
  return (
  <>
    <GlobalStyles />
    <Outlet />
  </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/check" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path=":urlToScan" element={<Results />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
