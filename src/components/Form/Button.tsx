import styled from 'styled-components';
import colors from 'styles/colors';
import { InputSize, applySize } from 'styles/dimensions';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: InputSize,
  bgColor?: string,
  fgColor?: string,
  styles?: string,
  title?: string,
};

const StyledButton = styled.button<ButtonProps>`
  cursor: pointer;
  border: none;
  border-radius: 0.25rem;
  font-family: PTMono;
  box-sizing: border-box; 
  width: -moz-available;
  box-shadow: 3px 3px 0px ${colors.fgShadowColor};
  &:hover {
    box-shadow: 5px 5px 0px ${colors.fgShadowColor};
  }
  &:active {
    box-shadow: -3px -3px 0px ${colors.fgShadowColor};
  }
  ${props => applySize(props.size)};
  ${(props) => props.bgColor ?
    `background: ${props.bgColor};` : `background: ${colors.primary};`
  }
  ${(props) => props.fgColor ?
    `color: ${props.fgColor};` : `color: ${colors.background};`
  }
  ${props => props.styles}
`;

const Button = (props: ButtonProps): JSX.Element => {
  const { children, size, bgColor, fgColor, onClick, styles, title } = props;
  return (
    <StyledButton
      onClick={onClick || (() => null) }
      size={size}
      bgColor={bgColor}
      fgColor={fgColor}
      styles={styles}
      title={title?.toString()}
      >
      {children}
    </StyledButton>
  );
};

export default Button;
