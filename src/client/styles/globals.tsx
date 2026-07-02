import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
      body,
      div,
      a,
      p,
      span,
      ul,
      li,
      small,
      h1,
      h2,
      h3,
      h4,
      button,
      section {
        font-family: var(--font-mono);
        color: #fff;
      }
      #fancy-background p span {
        color: transparent;
      }
    `}
  />
);

export default GlobalStyles;
