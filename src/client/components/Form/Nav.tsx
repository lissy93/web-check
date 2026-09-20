import styled from '@emotion/styled';
import type { ReactNode } from 'react';

import { StyledCard } from 'client/components/Form/Card';
import Heading from 'client/components/Form/Heading';
import colors from 'client/styles/colors';
import { TextSizes } from 'client/styles/typography';

const Header = styled(StyledCard)`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  align-items: center;
  width: 95vw;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  img {
    width: 2.5rem;
    border-radius: 4px;
  }
  h1 {
    margin: 0;
  }
  .parent {
    margin: 0;
    font-size: ${TextSizes.small};
    color: ${colors.textColorSecondary};
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  a:hover {
    color: ${colors.primary};
  }
`;

const Nav = (props: { tool?: { name: string; href: string }; children?: ReactNode }) => {
  const { tool, children } = props;
  return (
    <Header as="header">
      <Brand>
        <img width="64" src="/favicon.svg" alt="Web Check Icon" />
        {tool ? (
          <div>
            <p className="parent">
              <a href="/">Web Check</a>
            </p>
            <Heading color={colors.primary} size="medium">
              <a href={tool.href}>{tool.name}</a>
            </Heading>
          </div>
        ) : (
          <Heading color={colors.primary} size="large">
            <a href="/" target="_self">
              Web Check
            </a>
          </Heading>
        )}
      </Brand>
      {children && children}
    </Header>
  );
};

export default Nav;
