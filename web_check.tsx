import { Routes, Route, Outlet } from 'react-router-dom';
import Home from 'web-check-live/views/Home';
import Results from 'web-check-live/views/Results';
import About from 'web-check-live/views/About';
import NotFound from 'web-check-live/views/NotFound';
import ErrorBoundary from 'web-check-live/components/boundaries/PageError';
import GlobalStyles from './styles/globals';

const Layout = () => (
  <>
    <GlobalStyles />
    <Outlet />
  </>
);

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
