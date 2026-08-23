import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { StyledCard } from 'client/components/Form/Card';
import Heading from 'client/components/Form/Heading';
import { useLanguage } from 'client/i18n';

const Wrapper = styled(StyledCard)`
  margin: 0 auto;
  width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  h2 {
    margin: 0;
  }
  p {
    margin: 0;
  }
  .target {
    font-family: var(--font-mono);
    background: ${colors.background};
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    word-break: break-all;
    align-self: flex-start;
    max-width: 100%;
    color: ${colors.textColor};
  }
  .reasons {
    margin: 0;
    padding-left: 1.25rem;
    color: ${colors.textColorSecondary};
    li {
      padding: 0.15rem 0;
    }
  }
  .detail {
    color: ${colors.textColorSecondary};
    font-size: 0.85rem;
    word-break: break-word;
  }
`;

type Kind = 'unreachable' | 'invalid' | 'api-down' | 'disabled' | 'blocked';

const VARIANT: Record<Kind, { title: string; description: string; reasons: string[] }> = {
  unreachable: {
    title: 'Cannot Reach This Site',
    description: 'We could not resolve an IP address for this host, so checks cannot run',
    reasons: [
      'The domain might be misspelled or no longer registered',
      'The website may be offline or temporarily unreachable',
      'A DNS resolution issue may be affecting the lookup',
      'A firewall or geo-block may be preventing access',
    ],
  },
  invalid: {
    title: 'Invalid Input',
    description: 'That does not look like a valid URL or IP address, so checks cannot run',
    reasons: [
      'Enter a domain (example.com) or an IPv4 / IPv6 address',
      'Check for typos or stray characters in the input',
      'Avoid spaces and unsupported symbols in the address',
    ],
  },
  'api-down': {
    title: 'Service Unavailable',
    description: 'Most checks failed because the Web-Check API could not be reached',
    reasons: [
      'The API may be down, restarting or rate-limited',
      'A self-hosted instance might be misconfigured or offline',
      'A network or firewall issue could be blocking the API',
    ],
  },
  blocked: {
    title: 'Scanning Not Permitted',
    description: 'Every check was skipped, as this instance does not allow scanning this host',
    reasons: [
      'The administrator may have blocked this domain or IP range',
      'The instance may be configured to not run these checks',
      'You can still scan this host from your own instance of Web-Check',
    ],
  },
  disabled: {
    title: 'Web-Check is Paused',
    description: 'This instance has been temporarily disabled, so checks cannot run',
    reasons: [
      'The public instance may be paused to manage running costs',
      'A self-hosted instance may be in maintenance mode',
      'You can run your own copy from the open-source repo on GitHub',
    ],
  },
};

const VARIANT_ZH: typeof VARIANT = {
  unreachable: {
    title: '无法访问该站点',
    description: '无法解析该主机的 IP 地址，因此不能继续检查',
    reasons: [
      '域名可能拼写错误或已注销',
      '网站可能离线或暂时无法访问',
      'DNS 解析可能出现问题',
      '防火墙或地域限制可能阻止访问',
    ],
  },
  invalid: {
    title: '输入无效',
    description: '输入内容不是有效的网址或 IP 地址，因此不能继续检查',
    reasons: [
      '请输入域名（例如 example.com）或 IPv4 / IPv6 地址',
      '检查输入中的拼写错误或多余字符',
      '请勿包含空格或不支持的符号',
    ],
  },
  'api-down': {
    title: '服务不可用',
    description: '由于无法连接 Web Check API，大部分检查均失败',
    reasons: [
      'API 可能离线、重启中或触发限流',
      '自托管实例可能配置错误或未运行',
      '网络或防火墙可能拦截了 API',
    ],
  },
  blocked: {
    title: '不允许扫描',
    description: '当前实例不允许扫描该主机，因此所有检查均已跳过',
    reasons: [
      '管理员可能已屏蔽该域名或 IP 网段',
      '实例可能禁用了相关检查',
      '仍可在自己的 Web Check 实例中扫描该主机',
    ],
  },
  disabled: {
    title: 'Web Check 已暂停',
    description: '当前实例已暂时停用，因此不能执行检查',
    reasons: [
      '公共实例可能为控制运行成本而暂停',
      '自托管实例可能正在维护',
      '可以从 GitHub 开源仓库运行自己的实例',
    ],
  },
};

interface Props {
  address: string;
  error?: string;
  kind?: Kind;
}

// Surface a friendly explanation when input is invalid or the host is unreachable
const NoResults = ({ address, error, kind = 'unreachable' }: Props): JSX.Element => {
  const { language, t } = useLanguage();
  const { title, description, reasons } = (language === 'zh-CN' ? VARIANT_ZH : VARIANT)[kind];
  return (
    <Wrapper role="alert">
      <Heading as="h2" align="left" color={colors.danger}>
        {title}
      </Heading>
      <p>{description}</p>
      <code className="target">{address}</code>
      <p>{t('possibleReasons')}</p>
      <ul className="reasons">
        {reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      {error && (
        <span className="detail">
          {kind === 'blocked' ? t('reason').replace('：', '') : t('lookupError')}: {error}
        </span>
      )}
    </Wrapper>
  );
};

export default NoResults;
