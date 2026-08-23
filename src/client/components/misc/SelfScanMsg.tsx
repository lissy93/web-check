import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { StyledCard } from 'client/components/Form/Card';
import { useLanguage } from 'client/i18n';

const StyledSelfScanMsg = styled(StyledCard)`
  margin: 0px auto 1rem;
  width: 95vw;
  a {
    color: ${colors.primary};
  }
  b {
    font-weight: extra-bold;
  }
  span,
  i {
    opacity: 0.85;
  }
  img {
    width: 5rem;
    float: right;
    border-radius: 4px;
  }
`;

const englishMessages = [
  "Nice try! But scanning this app is like trying to tickle yourself. It just doesn't work!",
  "Recursive scanning detected. The universe might implode...or it might not. But let's not try to find out.",
  "Hey, stop checking us out! We're blushing... 😉",
  'Hmmm, scanning us, are you? We feel so special!',
  "Alert! Mirror scanning detected. Trust us, we're looking good 😉",
  "We're flattered you're trying to scan us, but we can't tickle ourselves!",
  "Oh, inspecting the inspector, aren't we? Inception much?",
  "Just a second...wait a minute...you're scanning us?! Well, that's an interesting twist!",
  "Scanning us? It's like asking a mirror to reflect on itself.",
  'Well, this is awkward... like a dog chasing its own tail!',
  "Ah, I see you're scanning this site... But alas, this did not cause an infinite recursive loop (this time)",
];

const chineseMessages = [
  '好尝试！但扫描这个应用就像挠自己痒痒，确实行不通。',
  '检测到递归扫描。宇宙也许会坍缩，也许不会，还是别验证了。',
  '别再检查我们啦，我们都不好意思了。',
  '正在扫描我们吗？真让人受宠若惊。',
  '警告：检测到镜像扫描。相信我们，状态很好。',
  '很高兴你想扫描我们，但我们没法检查自己。',
  '用检查器检查检查器？很有递归的味道。',
  '等一下，你正在扫描我们？这个转折有点意思。',
  '扫描我们，就像让镜子反省它自己。',
  '这个场面有点尴尬：系统正在追踪自己。',
  '原来你在扫描本站。不过这一次并没有触发无限递归。',
];

const SelfScanMsg = () => {
  const { language } = useLanguage();
  const messageIndex = Math.floor(Math.random() * englishMessages.length);
  return (
    <StyledSelfScanMsg>
      <img
        src="https://i.ibb.co/0tQbCPJ/test2.png"
        alt={language === 'zh-CN' ? '自扫描' : 'Self-Scan'}
      />
      <b>{language === 'zh-CN' ? chineseMessages[messageIndex] : englishMessages[messageIndex]}</b>
      <br />
      <span>
        {language === 'zh-CN'
          ? '如果想了解本站的构建方式，可以查看'
          : 'But if you want to see how this site is built, why not check out the '}
        <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check">
          {language === 'zh-CN' ? '源代码' : 'source code'}
        </a>
        {language === 'zh-CN' ? '。' : '?'}
      </span>
      <br />
      <i>
        {language === 'zh-CN'
          ? '也欢迎顺手为项目点个 Star'
          : "Do me a favour, and drop the repo a Star while you're there"}
      </i>{' '}
      😉
    </StyledSelfScanMsg>
  );
};

export default SelfScanMsg;
