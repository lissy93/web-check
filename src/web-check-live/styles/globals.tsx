import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
    @font-face {
      font-family: PTMono;
      font-style: normal;
      font-weight: 400;
      src: url('/fonts/PTMono.ttf') format('ttf');
    }
    body { font-family: PTMono; }
    `}
  />
);

export default GlobalStyles;
