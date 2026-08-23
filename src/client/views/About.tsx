import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

import colors from 'client/styles/colors';
import Heading from 'client/components/Form/Heading';
import Footer from 'client/components/misc/Footer';
import Nav from 'client/components/Form/Nav';
import Button from 'client/components/Form/Button';
import AdditionalResources from 'client/components/misc/AdditionalResources';
import { StyledCard } from 'client/components/Form/Card';
import docs, { about, featureIntro, license, fairUse, supportUs } from 'client/utils/docs';
import {
  chineseAbout,
  chineseFairUse,
  chineseFeatureIntro,
  chineseSupportUs,
  localizeDoc,
  useLanguage,
} from 'client/i18n';

const AboutContainer = styled.div`
width: 95vw;
max-width: 1000px;
margin: 2rem auto;
padding-bottom: 1rem;
header {
  margin 1rem 0;
  width: auto;
}
section {
  width: auto;
  .inner-heading { display: none; }
}
`;

const HeaderLinkContainer = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  a {
    text-decoration: none;
  }
`;

const Section = styled(StyledCard)`
  margin-bottom: 2rem;
  overflow: clip;
  max-height: 100%;
  section {
    clear: both;
  }
  h3 {
    font-size: 1.5rem;
  }
  hr {
    border: none;
    border-top: 1px dashed ${colors.primary};
    margin: 1.5rem auto;
  }
  ul {
    padding: 0 0 0 1rem;
    list-style: circle;
  }
  a {
    color: ${colors.primary};
    &:visited {
      opacity: 0.8;
    }
  }
  pre {
    background: ${colors.background};
    border-radius: 4px;
    padding: 0.5rem;
    width: fit-content;
  }
  small {
    opacity: 0.7;
  }
  .contents {
    ul {
      list-style: none;
      li {
        a {
          // color: ${colors.textColor};
          &:visited {
            opacity: 0.8;
          }
        }
        b {
          opacity: 0.75;
          display: inline-block;
          width: 1.5rem;
        }
      }
    }
  }
  .example-screenshot {
    float: right;
    display: inline-flex;
    flex-direction: column;
    clear: both;
    max-width: 300px;
    img {
      float: right;
      break-inside: avoid;
      max-width: 300px;
      // max-height: 30rem;
      border-radius: 6px;
      clear: both;
    }
    figcaption {
      font-size: 0.8rem;
      text-align: center;
      opacity: 0.7;
    }
  }
`;

const SponsorshipContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  line-height: 1.5rem;
  img {
    border-radius: 4px;
  }
`;

const makeAnchor = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .replace(/\s+/g, '-');

const About = (): JSX.Element => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const zh = language === 'zh-CN';
  const z = (english: string, chinese: string) => (zh ? chinese : english);
  const aboutCopy = zh ? chineseAbout : about;
  const featureCopy = zh ? chineseFeatureIntro : featureIntro;
  const supportCopy = zh ? chineseSupportUs : supportUs;
  const fairUseCopy = zh ? chineseFairUse : fairUse;

  useEffect(() => {
    // Scroll to hash fragment if present
    if (location.hash) {
      // Add a small delay to ensure the page has fully rendered
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div>
      <AboutContainer>
        <Nav>
          <HeaderLinkContainer>
            <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check">
              <Button>{t('viewGithub')}</Button>
            </a>
          </HeaderLinkContainer>
        </Nav>

        <Heading as="h2" size="medium" color={colors.primary}>
          {z('Intro', '项目介绍')}
        </Heading>
        <Section>
          {aboutCopy.map((para, index: number) => (
            <p key={index}>{para}</p>
          ))}
          <hr />
          <SponsorshipContainer>
            <p>
              {z('Web-Check is kindly sponsored by', 'Web Check 由以下伙伴赞助')}{' '}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://terminaltrove.com/?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh"
              >
                Terminal Trove
              </a>
              <br />
              {z('The $HOME of all things in the terminal.', '发现优秀终端工具的聚合站。')}
              <br />
              <small>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://terminaltrove.com/newsletter?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh"
                >
                  {z(
                    'Find your next CLI / TUI tool, and get updates to your inbox',
                    '发现新的 CLI / TUI 工具，并通过邮件获取更新',
                  )}
                </a>
              </small>
            </p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://terminaltrove.com/?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh"
            >
              <img
                width="300"
                alt="Terminal Trove"
                src="https://i.ibb.co/T1KzVmR/terminal-trove-green.png"
              />
            </a>
          </SponsorshipContainer>
          <hr />
          <p>
            {z('Web-Check is developed and maintained by', 'Web Check 的开发与维护者是')}{' '}
            <a target="_blank" rel="noreferrer" href="https://aliciasykes.com">
              Alicia Sykes
            </a>
            {zh ? '。' : '. '}
            {z("It's licensed under the", '项目采用')}{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/Lissy93/web-check/blob/master/LICENSE"
            >
              {z('MIT license', 'MIT 许可证')}
            </a>
            {z(
              ', and is completely free to use, modify and distribute in both personal and commercial settings.',
              '，可在个人和商业场景中免费使用、修改和分发。',
            )}
            <br />
            {z('Source code and self-hosting docs are available on', '源代码和自托管文档位于')}{' '}
            <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check">
              GitHub
            </a>
            {zh ? '。' : '. '}
            {z("If you've found this service useful, consider", '如果本服务对你有帮助，可以考虑')}
            {zh ? '' : ' '}
            <a target="_blank" rel="noreferrer" href="https://github.com/sponsors/Lissy93">
              {z('sponsoring me', '赞助项目')}
            </a>
            {zh ? '' : ' '}
            {z(
              'from $1/month, to help with the ongoing hosting and development costs.',
              '，每月 1 美元即可帮助承担持续的托管和开发成本。',
            )}
          </p>
        </Section>

        <Heading as="h2" size="medium" color={colors.primary}>
          {z('Features', '功能说明')}
        </Heading>
        <Section>
          {featureCopy.map((fi: string, i: number) => (
            <p key={i}>{fi}</p>
          ))}
          <div className="contents">
            <Heading as="h3" size="small" id="#feature-contents" color={colors.primary}>
              {z('Contents', '目录')}
            </Heading>
            <ul>
              {docs.map((section, index: number) => (
                <li key={index}>
                  <b>{index + 1}</b>
                  <a href={`#${makeAnchor(section.title)}`}>
                    {localizeDoc(section, language).title}
                  </a>
                </li>
              ))}
            </ul>
            <hr />
          </div>
          {docs.map((sourceSection, sectionIndex: number) => {
            const section = localizeDoc(sourceSection, language);
            return (
              <section key={section.title}>
                {sectionIndex > 0 && <hr />}
                <Heading
                  as="h3"
                  size="small"
                  id={makeAnchor(sourceSection.title)}
                  color={colors.primary}
                >
                  {section.title}
                </Heading>
                {section.screenshot && (
                  <figure className="example-screenshot">
                    <img
                      className="screenshot"
                      src={section.screenshot}
                      alt={z(`Example Screenshot ${section.title}`, `${section.title} 示例截图`)}
                    />
                    <figcaption>
                      {z(
                        `Fig.${sectionIndex + 1} - Example of ${section.title}`,
                        `图 ${sectionIndex + 1} - ${section.title} 示例`,
                      )}
                    </figcaption>
                  </figure>
                )}
                {section.description && (
                  <>
                    <Heading as="h4" size="small">
                      {z('Description', '说明')}
                    </Heading>
                    <p>{section.description}</p>
                  </>
                )}
                {section.use && (
                  <>
                    <Heading as="h4" size="small">
                      {z('Use Cases', '应用场景')}
                    </Heading>
                    <p>{section.use}</p>
                  </>
                )}
                {section.resources && section.resources.length > 0 && (
                  <>
                    <Heading as="h4" size="small">
                      {z('Useful Links', '相关链接')}
                    </Heading>
                    <ul>
                      {section.resources.map(
                        (link: string | { title: string; link: string }, linkIndx: number) =>
                          typeof link === 'string' ? (
                            <li key={`link-${linkIndx}`} id={`link-${linkIndx}`}>
                              <a target="_blank" rel="noreferrer" href={link}>
                                {link}
                              </a>
                            </li>
                          ) : (
                            <li key={`link-${linkIndx}`} id={`link-${linkIndx}`}>
                              <a target="_blank" rel="noreferrer" href={link.link}>
                                {link.title}
                              </a>
                            </li>
                          ),
                      )}
                    </ul>
                  </>
                )}
              </section>
            );
          })}
        </Section>

        <Heading as="h2" size="medium" color={colors.primary}>
          {z('Deploy your own Instance', '部署自己的实例')}
        </Heading>
        <Section>
          <p>
            {z(
              'Web-Check is designed to be easily self-hosted.',
              'Web Check 支持便捷的自托管部署。',
            )}
          </p>
          <Heading as="h3" size="small" color={colors.primary}>
            {z('Option #1 - Netlify', '方式 #1 - Netlify')}
          </Heading>
          <p>{z('Click the button below to deploy to Netlify', '点击下方按钮部署到 Netlify')}</p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/web-check"
          >
            <img
              src="https://www.netlify.com/img/deploy/button.svg"
              alt={z('Deploy to Netlify', '部署到 Netlify')}
            />
          </a>

          <Heading as="h3" size="small" color={colors.primary}>
            {z('Option #2 - Vercel', '方式 #2 - Vercel')}
          </Heading>
          <p>{z('Click the button below to deploy to Vercel', '点击下方按钮部署到 Vercel')}</p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flissy93%2Fweb-check&project-name=web-check&repository-name=web-check-fork&demo-title=Web-Check%20Demo&demo-description=Check%20out%20web-check.xyz%20to%20see%20a%20live%20demo%20of%20this%20application%20running.&demo-url=https%3A%2F%2Fweb-check.xyz&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2FLissy93%2Fweb-check%2Fmaster%2F.github%2Fscreenshots%2Fweb-check-screenshot10.png"
          >
            <img
              src="https://vercel.com/button"
              alt={z('Deploy with Vercel', '使用 Vercel 部署')}
            />
          </a>

          <Heading as="h3" size="small" color={colors.primary}>
            {z('Option #3 - Docker', '方式 #3 - Docker')}
          </Heading>
          <p>
            {z('A Docker container is published to', 'Docker 镜像已发布到')}{' '}
            <a target="_blank" rel="noreferrer" href="https://hub.docker.com/r/lissy93/web-check">
              DockerHub
            </a>
            <br />
            {z('Run this command, then open', '运行以下命令，然后打开')} <code>localhost:3000</code>
          </p>
          <pre>docker run -p 3000:3000 lissy93/web-check</pre>

          <Heading as="h3" size="small" color={colors.primary}>
            {z('Option #4 - Manual', '方式 #4 - 手动部署')}
          </Heading>
          <pre>
            git clone https://github.com/Lissy93/web-check.git
            <br />
            cd web-check # Move into the project directory
            <br />
            yarn install # Install dependencies
            <br />
            yarn build # Build the app for production
            <br />
            yarn serve # Start the app (API and GUI)
            <br />
          </pre>

          <Heading as="h3" size="small" color={colors.primary}>
            {z('Further Docs', '更多文档')}
          </Heading>
          <p>
            {z(
              'More detailed installation and setup instructions can be found in the GitHub repository -',
              '更详细的安装与配置说明请查看 GitHub 仓库：',
            )}{' '}
            <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check#readme">
              github.com/lissy93/web-check
            </a>
          </p>

          <Heading as="h3" size="small" color={colors.primary}>
            {z('Configuring', '配置')}
          </Heading>
          <p>
            {z(
              'There are some optional environmental variables you can specify to give you access to some additional Web-Checks. See the README for full list of options.',
              '可通过可选环境变量启用更多检查能力，完整配置项请查看 README。',
            )}
          </p>

          <ul>
            <li>
              <code>GOOGLE_CLOUD_API_KEY</code>:{' '}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://developers.google.com/speed/docs/insights/v5/get-started"
              >
                {z('A Google API key', 'Google API 密钥')}
              </a>
              <i>
                {' '}
                {z(
                  'With the PageSpeed Insights API enabled, used to return quality metrics for a site',
                  '启用 PageSpeed Insights API 后，用于返回网站质量指标',
                )}
              </i>
            </li>
            <li>
              <code>REACT_APP_SHODAN_API_KEY</code>:{' '}
              <a target="_blank" rel="noreferrer" href="https://account.shodan.io/">
                {z('A Shodan API key', 'Shodan API 密钥')}
              </a>
              <i>{z(' To show associated hosts for a domain', ' 用于显示域名关联主机')}</i>
            </li>
            <li>
              <code>REACT_APP_WHO_API_KEY</code>:{' '}
              <a target="_blank" rel="noreferrer" href="https://whoapi.com/">
                {z('A WhoAPI key', 'WhoAPI 密钥')}
              </a>
              <i>
                {z(' Allows for more comprehensive WhoIs records', ' 用于获取更完整的 WHOIS 记录')}
              </i>
            </li>
          </ul>
        </Section>

        <Heading as="h2" size="medium" color={colors.primary}>
          {z('API Documentation', 'API 文档')}
        </Heading>
        <Section>
          <p>{z('// Coming soon...', '// 即将推出...')}</p>
        </Section>

        <Heading as="h2" size="medium" color={colors.primary}>
          {z('Additional Resources', '更多资源')}
        </Heading>
        <AdditionalResources />

        <Heading as="h2" size="medium" color={colors.primary}>
          {z('Support Us', '支持我们')}
        </Heading>
        <Section>
          {supportCopy.map((para, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: para }} />
          ))}
        </Section>

        <Heading as="h2" size="medium" color={colors.primary}>
          {z('Terms & Info', '条款与信息')}
        </Heading>
        <Section>
          <Heading as="h3" size="small" color={colors.primary}>
            {z('License', '许可证')}
          </Heading>
          <b>
            <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check">
              Web-Check
            </a>{' '}
            {z('is distributed under the MIT license, ©', '采用 MIT 许可证发布，©')}{' '}
            <a target="_blank" rel="noreferrer" href="https://aliciasykes.com">
              Alicia Sykes
            </a>{' '}
            {new Date().getFullYear()}
          </b>
          <br />
          <small>
            {z('For more info, see', '更多信息请参阅')}{' '}
            <a target="_blank" rel="noreferrer" href="https://tldrlegal.com/license/mit-license">
              TLDR Legal → MIT
            </a>
          </small>
          <pre>{license}</pre>
          <hr />
          <Heading as="h3" size="small" color={colors.primary}>
            {z('Fair Use', '合理使用')}
          </Heading>
          <ul>
            {fairUseCopy.map((para, index) => (
              <li key={index}>{para}</li>
            ))}
          </ul>
          <hr />
          <Heading as="h3" size="small" color={colors.primary}>
            {z('Privacy', '隐私')}
          </Heading>
          <p>
            {z(
              "Analytics are used on the demo instance (via a self-hosted Plausible instance), this only records the URL you visited but no personal data. There's also some basic error logging (via a self-hosted GlitchTip instance), this is only used to help me fix bugs.",
              '演示实例使用自托管 Plausible 进行访问统计，只记录访问的网址，不记录个人数据；同时使用自托管 GlitchTip 收集基础错误信息，仅用于修复问题。',
            )}
            <br />
            <br />
            {z(
              'Neither your IP address, browser/OS/hardware info, nor any other data will ever be collected or logged. (You may verify this yourself, either by inspecting the source code or the using developer tools)',
              '你的 IP 地址、浏览器、操作系统、硬件信息及其他个人数据都不会被收集或记录。你可以通过检查源代码或浏览器开发者工具自行验证。',
            )}
          </p>
        </Section>
      </AboutContainer>
      <Footer />
    </div>
  );
};

export default About;
