import styled from 'styled-components';

// import Heading from 'components/Form/Heading';
import colors from 'styles/colors';

export const Card = styled.section`
  background: ${colors.backgroundLighter};
  box-shadow: 4px 4px 0px ${colors.bgShadowColor};
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem;
`;

// interface CardProps {
//   children: React.ReactNode;
//   heading?: string,
// };

// const Card = (props: CardProps): JSX.Element => {
//   const { children, heading } = props;
//   return (
//     <StyledCard>
//       { heading &&
//         <Heading as="h3" size="small" align="left" color={colors.primary}>{heading}</Heading>
//       }
//       {children}
//     </StyledCard>
//   );
// }

export default Card;

