import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { LanguageProvider } from './i18n.tsx';

export default () => (
  <LanguageProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </LanguageProvider>
);
