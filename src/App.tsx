import { Route, Routes } from 'react-router-dom';
import Styled from 'styled-components';
import Home from 'pages/Home';
import Results from 'pages/Results';
import About from 'pages/About';
import NotFound from 'pages/NotFound';
import colors from 'styles/colors';

const Container = Styled.main`
  background: ${colors.background};
  color: ${colors.textColor};
  width: 100vw;
  height: 100vh;
  margin: 0;
`;

function App() {
  return (
    <Container>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/results/:address" element={<Results />} />
      </Routes>
    </Container>
  );
}

export default App;
