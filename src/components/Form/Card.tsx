import styled from 'styled-components';

import ErrorBoundary from 'components/misc/ErrorBoundary';
import Heading from 'components/Form/Heading';
import colors from 'styles/colors';

export const StyledCard = styled.section`
  background: ${colors.backgroundLighter};
  box-shadow: 4px 4px 0px ${colors.bgShadowColor};
  border-radius: 8px;
  padding: 1rem;
`;

interface CardProps {
  children: React.ReactNode;
  heading?: string,
};

export const Card = (props: CardProps): JSX.Element => {
  const { children, heading } = props;
  return (
    <ErrorBoundary title={heading}>
      <StyledCard>
        { heading && <Heading as="h3" align="left" color={colors.primary}>{heading}</Heading> }
        {children}
      </StyledCard>
    </ErrorBoundary>
  );
}

export default StyledCard;
