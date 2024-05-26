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
    body, div, a, p, span, ul, li, small, h1, h2, h3, h4, button, section {
      font-family: PTMono;
      color: #fff;
    }
    #fancy-background p span {
      color: transparent;
    }
    `}
  />
);

export default GlobalStyles;
