import styled from '@emotion/styled';

import { type ReactNode } from 'react';
import ErrorBoundary from 'v1-check/components/misc/ErrorBoundary';
import Heading from 'v1-check/components/Form/Heading';
import colors from 'v1-check/styles/colors';

export const StyledCard = styled.section<{ styles?: string}>`
  background: ${colors.backgroundLighter};
  color: ${colors.textColor};
  box-shadow: 4px 4px 0px ${colors.bgShadowColor};
  border-radius: 8px;
  padding: 1rem;
  position: relative;
  margin 0.5rem;
  max-height: 64rem;
  overflow: auto;
  ${props => props.styles}
`;

interface CardProps {
  children: ReactNode;
  heading?: string,
  styles?: string;
  actionButtons?: ReactNode | undefined;
};

export const Card = (props: CardProps): JSX.Element => {
  const { children, heading, styles, actionButtons } = props;
  return (
    <ErrorBoundary title={heading}>
      <StyledCard styles={styles}>
        { actionButtons && actionButtons }
        { heading && <Heading className="inner-heading" as="h3" align="left" color={colors.primary}>{heading}</Heading> }
        {children}
      </StyledCard>
    </ErrorBoundary>
  );
}

export default StyledCard;
