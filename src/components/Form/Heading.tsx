import styled from 'styled-components';
import colors from 'styles/colors';
import { TextSizes } from 'styles/typography';

interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  align?: 'left' | 'center' | 'right';
  color?: string;
  size?: 'xSmall' | 'small' | 'medium' | 'large';
  inline?: boolean;
  children: React.ReactNode;
};

const StyledHeading = styled.h1<HeadingProps>`
  margin: 0.5rem 0;
  text-shadow: 2px 2px 0px ${colors.bgShadowColor};
  display: flex;
  gap: 1rem;
  align-items: center;
  img { // Some titles have an icon
    width: 2rem;
    border-radius: 4px;
  }
  a { // If a title is a link, keep title styles
    color: inherit;
    text-decoration: none;
  }
  ${props => {
    switch (props.size) {
      case 'xSmall': return `font-size: ${TextSizes.small};`;
      case 'small': return `font-size: ${TextSizes.medium};`;
      case 'medium': return `font-size: ${TextSizes.large};`;
      case 'large': return `font-size: ${TextSizes.xLarge};`;
    }
  }};
  ${props => {
    switch (props.align) {
      case 'left': return 'text-align: left;';
      case 'right': return 'text-align: right;';
      case 'center': return 'text-align: center;';
    }
  }};
  ${props => props.color ? `color: ${props.color};` : '' }
  ${props => props.inline ? 'display: inline;' : '' }
`;

const Heading = (props: HeadingProps): JSX.Element => {
  const { children, as, size, align, color, inline } = props;
  return (
    <StyledHeading as={as} size={size} align={align} color={color} inline={inline}>
      {children}
    </StyledHeading>
  );
}

export default Heading;
