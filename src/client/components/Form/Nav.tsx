import styled from '@emotion/styled';
import type { ReactNode } from 'react';

import { StyledCard } from 'client/components/Form/Card';
import Heading from 'client/components/Form/Heading';
import colors from 'client/styles/colors';
import LanguageSwitcher from 'client/components/misc/LanguageSwitcher';
import { useLanguage } from 'client/i18n';

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

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  min-width: 0;
  @media (max-width: 600px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Nav = (props: { children?: ReactNode }) => {
  const { language } = useLanguage();
  return (
    <Header as="header">
      <Heading color={colors.primary} size="large">
        <img
          width="64"
          src="/favicon.svg"
          alt={language === 'zh-CN' ? 'Web Check 图标' : 'Web Check icon'}
        />
        <a href="/" target="_self">
          Web Check
        </a>
      </Heading>
      <HeaderActions>
        {props.children && props.children}
        <LanguageSwitcher />
      </HeaderActions>
    </Header>
  );
};

export default Nav;
