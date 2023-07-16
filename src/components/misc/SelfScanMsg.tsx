
import styled from 'styled-components';
import colors from 'styles/colors';
import { StyledCard } from 'components/Form/Card';

const StyledSelfScanMsg = styled(StyledCard)`
  margin: 0px auto 1rem;
  width: 95vw;
  a { color: ${colors.primary}; }
  b { font-weight: extra-bold; }
  span, i { opacity: 0.85; }
  img {
    width: 5rem;
    float: right;
    border-radius: 4px;
  }
`;

const messages = [
  'Nice try! But scanning this app is like trying to tickle yourself. It just doesn\'t work!',
  'Recursive scanning detected. The universe might implode...or it might not. But let\'s not try to find out.',
  'Hey, stop checking us out! We\'re blushing... 😉',
  'Hmmm, scanning us, are you? We feel so special!',
  'Alert! Mirror scanning detected. Trust us, we\'re looking good 😉',
  'We\'re flattered you\'re trying to scan us, but we can\'t tickle ourselves!',
  'Oh, inspecting the inspector, aren\'t we? Inception much?',
  'Just a second...wait a minute...you\'re scanning us?! Well, that\'s an interesting twist!',
  'Scanning us? It\'s like asking a mirror to reflect on itself.',
  'Well, this is awkward... like a dog chasing its own tail!',
  'Ah, I see you\'re scanning this site... But alas, this did not cause an infinite recursive loop (this time)',
];

const SelfScanMsg = () => {
  return (
    <StyledSelfScanMsg>
      <img src="https://i.ibb.co/0tQbCPJ/test2.png" alt="Self-Scan" />
      <b>{messages[Math.floor(Math.random() * messages.length)]}</b>
      <br />
      <span>
        But if you want to see how this site is built, why not check out
        the <a href='https://github.com/lissy93/web-check'>source code</a>?
      </span>
      <br />
      <i>Do me a favour, and drop the repo a Star while you're there</i> 😉
    </StyledSelfScanMsg>
  );
};

export default SelfScanMsg;
