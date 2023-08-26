import styled, { keyframes } from 'styled-components';
import colors from 'styles/colors';
import { InputSize, applySize } from 'styles/dimensions';

type LoadState = 'loading' | 'success' | 'error';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: InputSize,
  bgColor?: string,
  fgColor?: string,
  styles?: string,
  title?: string,
  loadState?: LoadState,
};

const StyledButton = styled.button<ButtonProps>`
  cursor: pointer;
  border: none;
  border-radius: 0.25rem;
  font-family: PTMono;
  box-sizing: border-box; 
  width: -moz-available;
  display: flex;
  justify-content: center;
  gap: 1rem;
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


const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
const SimpleLoader = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid ${colors.background};
  width: 1rem;
  height: 1rem;
  animation: ${spinAnimation} 1s linear infinite;
`;

const Loader = (props: { loadState: LoadState }) => {
  if (props.loadState === 'loading') return <SimpleLoader />
  if (props.loadState === 'success') return <span>✔</span>
  if (props.loadState === 'error') return <span>✗</span>
  return <span></span>;
};

const Button = (props: ButtonProps): JSX.Element => {
  const { children, size, bgColor, fgColor, onClick, styles, title, loadState } = props;
  return (
    <StyledButton
      onClick={onClick || (() => null) }
      size={size}
      bgColor={bgColor}
      fgColor={fgColor}
      styles={styles}
      title={title?.toString()}
      >
      { loadState && <Loader loadState={loadState} /> }
      {children}
    </StyledButton>
  );
};

export default Button;
