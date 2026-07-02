import styled from '@emotion/styled';

import { type ReactNode } from 'react';
import ErrorBoundary from 'client/components/misc/ErrorBoundary';
import Heading from 'client/components/Form/Heading';
import colors from 'client/styles/colors';

export const StyledCard = styled.section<{ styles?: string }>`
  background: ${colors.backgroundLighter};
  color: ${colors.textColor};
  box-shadow: 4px 4px 0px ${colors.bgShadowColor};
  border-radius: 8px;
  padding: 1rem;
  position: relative;
  max-height: 54rem;
  overflow: auto;
  ${(props) => props.styles}
`;

interface CardProps {
  children: ReactNode;
  heading?: string;
  styles?: string;
  actionButtons?: ReactNode | undefined;
}

export const Card = (props: CardProps): JSX.Element => {
  const { children, heading, styles, actionButtons } = props;
  return (
    <ErrorBoundary title={heading}>
      <StyledCard styles={styles}>
        {actionButtons && actionButtons}
        {heading && (
          <Heading className="inner-heading" as="h3" align="left" color={colors.primary}>
            {heading}
          </Heading>
        )}
        {children}
      </StyledCard>
    </ErrorBoundary>
  );
};

export default StyledCard;
