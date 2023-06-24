
import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';

const Outer = styled(Card)`
overflow: auto;
max-height: 28rem;
img {
  border-radius: 6px;
  width: 100%;
  margin 0.5rem 0;;
}
`;

const ScreenshotCard = (props: { screenshot: string }): JSX.Element => {
  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>Screenshot</Heading>
      <img src={props.screenshot} alt="Full page screenshot" />
    </Outer>
  );
}

export default ScreenshotCard;
