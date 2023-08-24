import styled from 'styled-components';

import { StyledCard } from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import colors from 'styles/colors';

const LoaderContainer = styled(StyledCard)`
  margin: 0 auto 1rem auto;
  width: 95vw;
  position: relative;
  transition: all 0.2s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  height: 50vh;
  transition: all 0.3s ease-in-out;
  p.loadTimeInfo {
    text-align: center;
    margin: 0;
    color: ${colors.textColorSecondary};
    opacity: 0.5;
  }
  &.flex {
    display: flex;
  }
  &.finished {
    height: 0;
    overflow: hidden;
    opacity: 0;
    margin: 0;
    padding: 0;
    svg { width: 0; }
    h4 { font-size: 0; }
  }
  &.hide {
    display: none;
  }
`;

const StyledSvg = styled.svg`
  width: 200px;
  margin: 0 auto;
  path {
    fill: ${colors.primary};
    &:nth-child(2) { opacity: 0.8; }
    &:nth-child(3) { opacity: 0.5; }
  }
`;

const Loader = (props: { show: boolean }): JSX.Element => {
  return (
  <LoaderContainer className={props.show ? '' : 'finished'}>
    <Heading as="h4" color={colors.primary}>Crunching data...</Heading>
    <StyledSvg version="1.1" id="L7" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      viewBox="0 0 100 100" enableBackground="new 0 0 100 100">
      <path fill="#fff" d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
        c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">
          <animateTransform 
            attributeName="transform" 
            attributeType="XML" 
            type="rotate"
            dur="2s" 
            from="0 50 50"
            to="360 50 50" 
            repeatCount="indefinite" />
      </path>
    <path fill="#fff" d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
      c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z">
          <animateTransform 
            attributeName="transform" 
            attributeType="XML" 
            type="rotate"
            dur="1s" 
            from="0 50 50"
            to="-360 50 50" 
            repeatCount="indefinite" />
      </path>
    <path fill="#fff" d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
      L82,35.7z">
          <animateTransform 
            attributeName="transform" 
            attributeType="XML" 
            type="rotate"
            dur="2s" 
            from="0 50 50"
            to="360 50 50" 
            repeatCount="indefinite" />
      </path>
    </StyledSvg>
    <p className="loadTimeInfo">
      It may take up-to a minute for all jobs to complete<br />
      You can view preliminary results as they come in below
    </p>
  </LoaderContainer>
  );
}

export default Loader;



