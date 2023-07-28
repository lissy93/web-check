import styled from 'styled-components';

import { StyledCard } from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import colors from 'styles/colors';
import { ReactNode } from 'react';

const Header = styled(StyledCard)`
  margin: 1rem auto;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  align-items: center;
  width: 95vw;
`;

const Nav = (props: { children?: ReactNode}) => {
  return (
    <Header as="header">
    <Heading color={colors.primary} size="large">
      <img width="64" src="/web-check.png" alt="Web Check Icon" />
      <a href="/">Web Check</a>
    </Heading>
      {props.children && props.children}
  </Header>
  );
};

export default Nav;
