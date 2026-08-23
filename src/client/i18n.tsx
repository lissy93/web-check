import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Language = 'en' | 'zh-CN';

const STORAGE_KEY = 'web-check-language';

const messages = {
  en: {
    language: 'Language',
    english: 'English',
    chinese: 'Chinese',
    enterUrl: 'Enter a URL',
    analyze: 'Analyze!',
    emptyInput: 'Field must not be empty',
    invalidInput: 'Must be a valid URL, IPv4 or IPv6 Address',
    supportedChecks: 'Supported Checks',
    enjoying: 'Enjoying Web Check?',
    sponsorBefore:
      "It's free, open source, and funded by the community. If it's been useful, you can keep it going (and ad-free) by",
    sponsorLink: 'sponsoring me on GitHub',
    sponsorAfter: 'Every bit genuinely helps, thank you.',
    viewGithub: 'View on GitHub',
    deployOwn: 'Deploy your own',
    apiDocs: 'API Docs',
    infoAbout: 'Info about {title}',
    refetch: 'Re-fetch {title} data',
    crunching: 'Crunching data...',
    loadWait: 'It may take up to a minute for all jobs to complete',
    preliminary: 'You can view preliminary results as they come in below',
    advisory: 'Advisory',
    showLoadState: 'Show Load State',
    showDetails: 'Show Details',
    dismiss: 'Dismiss',
    learnMore: 'Learn More about Web-Check',
    retry: 'Retry',
    showError: 'Show Error',
    showTimeout: 'Show Timeout Reason',
    showSkip: 'Show Skip Reason',
    serverResponse: 'Server response:',
    reason: 'Reason:',
    jobDetails: 'Details for {name}',
    jobEnded: "The {name} job ended with state '{state}'",
    afterMs: ' after {time} ms. ',
    loadingJobs: 'Loading {done} / {total} Jobs',
    completedJobs: '{count} Jobs Completed Successfully',
    finishedLookups: 'Finished {total} lookups in {seconds}s',
    loadingLookups: 'Loading {done} of {total}',
    issues: 'issues',
    issue: 'issue',
    took: 'Took {time} ms',
    doneIn: 'Done in {time}',
    checkConsole: 'Check the browser console for logs and more info',
    normalFailures:
      "It's normal for some jobs to fail because the host may not return the required information, the runtime may restrict a check, or an API limit may have been reached.",
    possibleReasons: 'Possible reasons:',
    lookupError: 'Lookup error',
    rawData: 'View / Download Raw Data',
    downloadResults: 'Download Results',
    updateResults: 'Update Results',
    viewResults: 'View Results',
    hideResults: 'Hide Results',
    rawHint:
      'These are the raw results generated from your URL in JSON format. You can import them into your own program for further analysis.',
    resultsAvailable: 'Your results are available to view here.',
    externalTools: 'External Tools for Further Research',
    externalToolsNote:
      'These tools are not affiliated with Web-Check. Please use them at your own risk.',
    docsAbout: 'About',
    docsUses: 'Use Cases',
    docsLinks: 'Links',
    docsExample: 'Example',
    noDocs: 'No documentation is available for this widget yet.',
    sourceAt: 'View source at',
    licensed: 'is licensed under',
    notFound: 'Not Found',
    backHome: 'Back to Homepage',
    reportIssue: 'Report Issue',
  },
  'zh-CN': {
    language: '语言',
    english: 'English',
    chinese: '中文',
    enterUrl: '输入网址',
    analyze: '开始分析',
    emptyInput: '网址不能为空',
    invalidInput: '请输入有效的网址、IPv4 或 IPv6 地址',
    supportedChecks: '支持的检查项目',
    enjoying: '觉得 Web Check 好用吗？',
    sponsorBefore: 'Web Check 免费、开源，并由社区支持。如果它对你有帮助，可以通过',
    sponsorLink: 'GitHub 赞助',
    sponsorAfter: '帮助项目持续运行并保持无广告。感谢每一份支持。',
    viewGithub: '在 GitHub 查看',
    deployOwn: '部署自己的实例',
    apiDocs: 'API 文档',
    infoAbout: '查看“{title}”说明',
    refetch: '重新获取“{title}”数据',
    crunching: '正在分析数据...',
    loadWait: '全部检查最多可能需要一分钟',
    preliminary: '检查过程中会在下方持续显示已返回的结果',
    advisory: '安全建议',
    showLoadState: '显示加载状态',
    showDetails: '显示详情',
    dismiss: '收起',
    learnMore: '了解 Web Check',
    retry: '重试',
    showError: '查看错误',
    showTimeout: '查看超时原因',
    showSkip: '查看跳过原因',
    serverResponse: '服务器响应：',
    reason: '原因：',
    jobDetails: '{name} 详情',
    jobEnded: '任务 {name} 以“{state}”状态结束',
    afterMs: '，耗时 {time} 毫秒。',
    loadingJobs: '正在加载 {done} / {total} 项检查',
    completedJobs: '{count} 项检查已成功完成',
    finishedLookups: '{total} 项检查已完成，用时 {seconds} 秒',
    loadingLookups: '正在加载 {done} / {total}',
    issues: '个问题',
    issue: '个问题',
    took: '耗时 {time} 毫秒',
    doneIn: '完成用时 {time}',
    checkConsole: '请查看浏览器控制台日志以了解更多信息',
    normalFailures:
      '部分检查失败是正常现象，可能因为目标未返回所需信息、运行环境限制或触发 API 限额。',
    possibleReasons: '可能的原因：',
    lookupError: '查询错误',
    rawData: '查看或下载原始数据',
    downloadResults: '下载结果',
    updateResults: '更新结果',
    viewResults: '在线查看',
    hideResults: '隐藏结果',
    rawHint: '这是根据目标生成的 JSON 原始结果，可导入其他程序继续分析。',
    resultsAvailable: '结果已生成，可点击此处查看。',
    externalTools: '用于进一步研究的外部工具',
    externalToolsNote: '这些工具与 Web Check 无关联，请自行判断并承担使用风险。',
    docsAbout: '项目说明',
    docsUses: '应用场景',
    docsLinks: '相关链接',
    docsExample: '示例',
    noDocs: '暂时没有该检查项目的说明文档。',
    sourceAt: '源代码：',
    licensed: '采用',
    notFound: '页面不存在',
    backHome: '返回首页',
    reportIssue: '报告问题',
  },
} as const;

export type MessageKey = keyof (typeof messages)['en'];

const cardTitles: Record<string, string> = {
  location: '服务器位置',
  ssl: 'SSL 证书',
  domain: '域名 WHOIS',
  whois: '域名信息',
  quality: '网站质量概览',
  'tech-stack': '技术栈',
  hosts: '关联主机名',
  'server-info': '服务器信息',
  vulnerabilities: '已知漏洞',
  cookies: 'Cookie',
  headers: 'HTTP 响应头',
  dns: 'DNS 记录',
  'http-security': 'HTTP 安全配置',
  'tls-connection': 'TLS 连接',
  'tls-security-audit': 'TLS 安全审计',
  'tls-client-compat': 'TLS 客户端兼容性',
  subdomains: '子域名',
  'trace-route': '路由追踪',
  'security-txt': 'Security.txt',
  'dns-server': 'DNS 服务器',
  firewall: '防火墙',
  dnssec: 'DNSSEC',
  hsts: 'HSTS 检查',
  threats: '恶意软件与钓鱼检测',
  'mail-config': '邮件安全配置',
  archives: '历史归档',
  rank: '全球排名',
  redirects: '重定向链',
  'linked-pages': '页面链接',
  'robots-txt': '爬虫规则',
  status: '服务器状态',
  ports: '开放端口',
  'txt-records': 'TXT 记录',
  'block-lists': '拦截名单检测',
  sitemap: '站点页面',
  screenshot: '网页截图',
  'social-tags': '社交分享标签',
  carbon: '碳足迹',
};

const chineseText: Record<string, string> = {
  'First Scan': '首次收录',
  'Last Scan': '最近收录',
  'Days Archived': '归档天数',
  'Change Count': '变更次数',
  'Avg Size': '平均大小',
  'Avg Days between Archives': '归档平均间隔天数',
  'HTML Initial Size': 'HTML 初始大小',
  'Adjusted Transfer Size': '估算传输大小',
  'CO2 for Initial Load': '首次加载二氧化碳排放',
  'Energy Usage for Load': '加载能耗',
  'Cleaner than average page (est.)': '优于普通页面（估算）',
  'Internal Link Count': '内部链接数',
  'External Link Count': '外部链接数',
  Cookies: 'Cookie',
  None: '无',
  Hostname: '主机名',
  'IP Address': 'IP 地址',
  'Registered Domain': '注册域名',
  'Creation Date': '创建日期',
  'Updated Date': '更新日期',
  'Registry Expiry Date': '注册到期日期',
  'Registry Domain ID': '注册局域名 ID',
  'Registrar WHOIS Server': '注册商 WHOIS 服务器',
  Registrar: '注册商',
  'Registrar IANA ID': '注册商 IANA ID',
  Firewall: '防火墙',
  'HSTS Enabled?': '是否启用 HSTS',
  'Content Security Policy': '内容安全策略',
  'Strict Transport Policy': '严格传输策略',
  'Referrer Policy': '来源信息策略',
  'Permissions Policy': '权限策略',
  'Historical Average Rank': '历史平均排名',
  'Change since Yesterday': '较昨日变化',
  Present: '是否存在',
  'File Location': '文件位置',
  'PGP Signed': 'PGP 签名',
  Organization: '组织',
  'Service Provider': '服务提供商',
  'Operating System': '操作系统',
  Ports: '端口',
  Type: '类型',
  Location: '位置',
  City: '城市',
  Country: '国家或地区',
  Timezone: '时区',
  Languages: '语言',
  Currency: '货币',
  'Status Code': '状态码',
  'Response Time': '响应时间',
  'Is Up?': '是否在线',
  Title: '标题',
  Description: '描述',
  Keywords: '关键词',
  'Canonical URL': '规范网址',
  Author: '作者',
  Publisher: '发布者',
  Generator: '生成工具',
  'Theme Color': '主题颜色',
  'Twitter Site': 'Twitter 站点',
  Subject: '主体',
  Issuer: '签发者',
  Trusted: '是否受信任',
  Expires: '到期时间',
  Renewed: '生效时间',
  'Serial Num': '序列号',
  Fingerprint: '指纹',
  'Extended Key Usage': '扩展密钥用途',
  'Base Domain': '根域名',
  'Subdomains Found': '发现的子域名',
  Showing: '当前显示',
  'Google Safe Browsing': 'Google 安全浏览',
  'Threat Type': '威胁类型',
  'Phishing Status': '钓鱼状态',
  'Phish Info': '钓鱼信息',
  'Malware Status': '恶意软件状态',
  Status: '状态',
  'First Seen': '首次发现',
  'Bad URLs Count': '恶意网址数量',
  Protocol: '协议',
  'Cipher Suite': '密码套件',
  'Cipher Version': '密码版本',
  'Ephemeral Key': '临时密钥',
  'Forward Secrecy': '前向保密',
  'Session Resumption': '会话恢复',
  'OCSP Stapling': 'OCSP 装订',
  'Certificate Trust': '证书信任',
  Grade: '评级',
  'Grade (trust ignored)': '评级（忽略信任）',
  Protocols: '协议',
  'Known CVEs': '已知 CVE',
  Created: '创建时间',
  Updated: '更新时间',
  'Name Servers': '域名服务器',
  Domains: '域名',
  Hosts: '主机',
  Algorithm: '算法',
  Domain: '域名',
  Flags: '标志',
  'Public Key': '公钥',
  'Key Tag': '密钥标签',
  'Digest Type': '摘要类型',
  Digest: '摘要',
  'Recursion Available (RA)': '支持递归查询（RA）',
  'Recursion Desired (RD)': '请求递归查询（RD）',
  'TrunCation (TC)': '响应已截断（TC）',
  'Authentic Data (AD)': '认证数据（AD）',
  'Checking Disabled (CD)': '禁用验证（CD）',
  'Change Frequency': '更新频率',
  'Last Modified': '最后修改',
  Priority: '优先级',
  'Date Added': '添加日期',
  'File Path': '文件路径',
  'Reported By': '报告来源',
  'Takedown Time': '下线耗时',
  Reference: '参考链接',
  Tags: '标签',
  'No redirects': '无重定向',
  'No TXT Records': '没有 TXT 记录',
  '✅ Yes': '✅ 是',
  '❌ No': '❌ 否',
  '❌ No*': '❌ 否*',
  '✅ Safe': '✅ 安全',
  '❌ Unsafe': '❌ 不安全',
  '✅ No Malwares Found': '✅ 未发现恶意软件',
  '❌ Malware Identified': '❌ 发现恶意软件',
  '✅ No Phishing Found': '✅ 未发现钓鱼',
  '❌ Phishing Identified': '❌ 发现钓鱼',
  Unknown: '未知',
  'No crawl rules found.': '未发现爬虫规则。',
  'View Full Policy': '查看完整策略',
  'Expand Results': '展开结果',
  'Unable to calculate carbon footprint for host': '无法计算该主机的碳足迹',
  'This site returns a sitemap index, which is a list of sitemaps.':
    '该站点返回的是站点地图索引，其中包含多个站点地图。',
  'Not on any tested DNS blocklist': '未出现在已检测的 DNS 拦截名单中',
  'All cookies use Secure/HttpOnly/SameSite': '所有 Cookie 均设置了 Secure、HttpOnly 和 SameSite',
  'DNSSEC enabled': '已启用 DNSSEC',
  'DNSSEC not enabled': '未启用 DNSSEC',
  'No web application firewall detected': '未检测到 Web 应用防火墙',
  'No HSTS header': '未设置 HSTS 响应头',
  'HSTS missing includeSubDomains': 'HSTS 缺少 includeSubDomains',
  'HSTS missing preload directive': 'HSTS 缺少 preload 指令',
  'HSTS preload compatible': '符合 HSTS 预加载要求',
  'No SPF record found': '未发现 SPF 记录',
  'SPF record published': '已发布 SPF 记录',
  'No DMARC record found': '未发现 DMARC 记录',
  'DMARC policy: reject': 'DMARC 策略：拒绝',
  'DMARC policy: quarantine': 'DMARC 策略：隔离',
  'DKIM key found': '已发现 DKIM 密钥',
  'HTTP requests are redirected to HTTPS': 'HTTP 请求会重定向到 HTTPS',
  'Site does not enforce HTTPS': '站点未强制使用 HTTPS',
  'No security.txt published': '未发布 security.txt',
  'security.txt found': '已发现 security.txt',
  'security.txt not PGP signed': 'security.txt 未使用 PGP 签名',
  'Social share metadata complete': '社交分享元数据完整',
  'SSL certificate invalid': 'SSL 证书无效',
  'SSL certificate valid': 'SSL 证书有效',
  'SSL certificate expired': 'SSL 证书已过期',
  'SSL certificate expiring within a week': 'SSL 证书将在一周内到期',
  'SSL certificate expiring soon': 'SSL 证书即将到期',
  'Listed by Google Safe Browsing': '已被 Google 安全浏览列出',
  'Listed on URLhaus malware feed': '已被 URLhaus 恶意软件源列出',
  'Listed on PhishTank': '已被 PhishTank 列出',
  'No threat feed matches': '未命中威胁情报源',
  'TLS 1.2 in use, consider enabling TLS 1.3': '当前使用 TLS 1.2，建议启用 TLS 1.3',
  'TLS 1.3 negotiated': '已协商使用 TLS 1.3',
  'No forward secrecy in negotiated cipher': '协商的密码套件不支持前向保密',
  'OCSP stapling not enabled': '未启用 OCSP 装订',
  'HTTP/2 negotiated via ALPN': '已通过 ALPN 协商 HTTP/2',
  'Root SPF record is overly permissive': '根域名 SPF 记录过于宽松',
  'Domain registration expired': '域名注册已过期',
  'Domain expires within a week': '域名将在一周内到期',
  'Domain expires within a month': '域名将在一个月内到期',
  'Domain registration is valid': '域名注册状态有效',
  success: '成功',
  loading: '加载中',
  skipped: '已跳过',
  error: '失败',
  'timed-out': '已超时',
  successful: '成功',
  failed: '失败',
  'timed out': '超时',
  Critical: '严重',
  Issues: '问题',
  Warnings: '警告',
  Informational: '提示',
  Passes: '通过',
  'Identify Infostealer infection data related to domains and emails':
    '查询与域名和邮箱有关的信息窃取恶意软件数据',
  'Analyzes the SSL configuration of a server and grades it': '分析服务器 SSL 配置并给出评级',
  'Checks a URL against multiple antivirus engines': '使用多个反病毒引擎检查网址',
  'Search engine for Internet-connected devices': '面向联网设备的搜索引擎',
  'View previous versions of a site via the Internet Archive': '通过互联网档案馆查看网站历史版本',
  'Scans a URL and provides information about the page': '扫描网址并提供页面相关信息',
  'Checks a URL against blacklists and known threats': '根据黑名单和已知威胁检查网址',
  'Run a WhoIs lookup on a domain': '查询域名 WHOIS 信息',
  'View DNS records for a domain': '查看域名 DNS 记录',
  'Check global DNS propagation across multiple servers': '检查 DNS 记录在全球多个服务器的传播情况',
  'Lookup hosts associated with a domain': '查询与域名关联的主机',
  'Checks the performance, accessibility and SEO of a page on mobile + desktop':
    '检查页面在移动端和桌面端的性能、可访问性与 SEO',
  'View the tech stack of a website': '查看网站使用的技术栈',
  "DNS recon tool, to map out a domain from it's DNS records": '根据 DNS 记录绘制域名资产关系',
  'View realtime BGP data for any ASN, Prefix or DNS': '查看 ASN、网段或 DNS 的实时 BGP 数据',
  'View approx traffic and engagement stats for a website': '查看网站流量与互动情况估算',
  'Check if a domain, IP or email is present on the top blacklists':
    '检查域名、IP 或邮箱是否出现在主流黑名单中',
  'View traffic source locations for a domain through Cloudflare':
    '通过 Cloudflare 查看域名的流量来源地区',
  'Assesses website security posture by analyzing various security headers and practices':
    '通过安全响应头和最佳实践评估网站安全状态',
  "Checks a website against Zscaler's dynamic risk scoring engine": '查询网站的动态风险评分',
  'View shared human and machine generated threat intelligence': '查看人工与自动化共享威胁情报',
  'Checks a website across 30+ blocklist engines and website reputation services':
    '通过 30 多个拦截引擎和信誉服务检查网站',
  "Checks if the site is in URLhaus's malware URL exchange":
    '检查网站是否出现在 URLhaus 恶意网址库中',
  'An interactive malware and web sandbox': '交互式恶意软件与网页沙箱',
  Online: '在线',
  Offline: '离线',
  'ⓘ Present': 'ⓘ 已提供',
  'ⓘ Not Present (may impact visitor privacy)': 'ⓘ 未提供（可能影响访客隐私）',
  '✅ Trusted': '✅ 受信任',
  Untrusted: '不受信任',
  Renegotiation: '重新协商',
  'Fallback SCSV (downgrade protection)': 'Fallback SCSV（降级保护）',
  'Certificate Transparency': '证书透明度',
  'HTTP -> HTTPS Forwarding': 'HTTP → HTTPS 跳转',
  'ChaCha20 Preferred': '优先使用 ChaCha20',
  'AEAD Cipher Support': '支持 AEAD 密码套件',
  'Legacy CBC Cipher Support': '支持旧版 CBC 密码套件',
  'TLS Compression': 'TLS 压缩',
  'Static DH Key Reuse': '静态 DH 密钥复用',
  'Weak DH Primes': '弱 DH 素数',
  'Static ECDH Parameter Reuse': '静态 ECDH 参数复用',
  '⚠️ Vulnerable': '⚠️ 存在风险',
  '✅ With all browsers': '✅ 支持所有浏览器',
  '⚠️ With most modern browsers': '⚠️ 支持大多数现代浏览器',
  '⚠️ Limited': '⚠️ 有限支持',
  '✅ Not supported': '✅ 不支持',
  '⚠️ Insecure client-initiated': '⚠️ 允许不安全的客户端发起重新协商',
  '✅ Supported': '✅ 支持',
  '⚠️ IDs returned, not resumed': '⚠️ 返回会话 ID，但未恢复',
  '❌ Not enabled': '❌ 未启用',
  '⚠️ Supported (CRIME risk)': '⚠️ 已启用（存在 CRIME 风险）',
  '✅ Disabled': '✅ 已禁用',
  Cipher: '密码套件',
  'Key Exchange': '密钥交换',
  'Key Exchange Strength': '密钥交换强度',
  'DH Strength': 'DH 强度',
  'Key Algorithm': '密钥算法',
  'Key Size': '密钥长度',
  'Signature Algorithm': '签名算法',
  Attempts: '尝试次数',
};

export interface LocalizedDoc {
  title: string;
  description: string;
  use: string;
}

export const chineseDocs: Record<string, LocalizedDoc> = {
  'get-ip': {
    title: 'IP 信息',
    description: '查询域名对应的 IP 地址，并确认目标服务器在网络中的地址。',
    use: 'IP 是后续定位、端口探测、主机关系分析和基础设施调查的起点。',
  },
  ssl: {
    title: 'SSL 证书链',
    description: '读取目标站点提供的证书、签发者、有效期和信任状态。',
    use: '用于验证 HTTPS 身份、发现证书配置问题，并了解关联域名和组织信息。',
  },
  dns: {
    title: 'DNS 记录',
    description: '查询 A、AAAA、MX、NS、CNAME、TXT 等域名系统记录。',
    use: '用于理解网站基础设施、邮件服务、托管关系及可能暴露的配置。',
  },
  cookies: {
    title: 'Cookie',
    description: '检查服务器响应与浏览器脚本设置的 Cookie 及其安全属性。',
    use: '可判断会话、跟踪机制，以及 Secure、HttpOnly、SameSite 等安全配置。',
  },
  'robots-txt': {
    title: '爬虫规则',
    description: '读取 robots.txt 中针对搜索引擎和自动化爬虫的访问规则。',
    use: '可了解站点索引策略，并发现未在导航中公开的路径。',
  },
  headers: {
    title: 'HTTP 响应头',
    description: '提取服务器返回的缓存、内容类型、技术标识和安全相关响应头。',
    use: '用于分析服务器技术、缓存策略、安全控制和可能泄露的信息。',
  },
  quality: {
    title: '网站质量指标',
    description: '通过 Lighthouse 评估性能、可访问性、最佳实践和 SEO。',
    use: '用于快速定位网页质量、用户体验和搜索优化方面的问题。',
  },
  location: {
    title: '服务器位置',
    description: '根据 IP 地理数据库估算服务器所在城市、国家、网络和时区。',
    use: '用于了解托管区域、数据驻留、网络延迟和服务提供商。',
  },
  hosts: {
    title: '关联主机',
    description: '列出与目标 IP 或域名关联的主机名和域名。',
    use: '用于扩展攻击面地图，发现相关服务、测试环境或历史资产。',
  },
  redirects: {
    title: '重定向链',
    description: '逐步记录目标请求经过的 HTTP 重定向。',
    use: '用于发现过长跳转、错误目标，以及 HTTP 到 HTTPS 的升级策略。',
  },
  'txt-records': {
    title: 'TXT 记录',
    description: '读取域名发布的 TXT 文本记录。',
    use: '常用于检查 SPF、站点验证信息及可能暴露的基础设施配置。',
  },
  status: {
    title: '服务器状态',
    description: '测试目标是否可访问，并记录响应状态和耗时。',
    use: '用于快速判断可用性、延迟和异常响应。',
  },
  ports: {
    title: '开放端口',
    description: '探测目标主机上一组常见 TCP 端口。',
    use: '用于了解对外暴露的服务，并识别不必要或高风险的网络入口。',
  },
  'trace-route': {
    title: '路由追踪',
    description: '记录当前服务器到目标主机之间的网络跳点。',
    use: '用于诊断路由、延迟和网络边界。',
  },
  carbon: {
    title: '碳足迹',
    description: '根据页面传输大小估算一次加载的能耗和二氧化碳排放。',
    use: '用于比较页面体积和环境影响，辅助前端性能优化。',
  },
  'server-info': {
    title: '服务器信息',
    description: '汇总组织、ISP、ASN、操作系统、端口和位置等主机信息。',
    use: '用于理解目标的托管环境和网络归属。',
  },
  vulnerabilities: {
    title: '已知漏洞',
    description: '显示威胁情报服务报告的 CVE 和已知暴露问题。',
    use: '用于确定补丁和服务加固的优先级，结果仍需人工复核。',
  },
  domain: {
    title: 'WHOIS 查询',
    description: '查询域名注册商、注册日期、到期日期和注册局标识。',
    use: '用于核实域名归属、生命周期和注册状态。',
  },
  whois: {
    title: '域名信息',
    description: '整理 WHOIS 或 RDAP 返回的域名注册资料。',
    use: '用于调查域名历史、注册时间、到期风险和名称服务器。',
  },
  dnssec: {
    title: 'DNS 安全扩展',
    description: '检查 DNSKEY、DS、RRSIG 等 DNSSEC 记录。',
    use: '用于确认 DNS 响应是否具备签名验证能力，以降低伪造和缓存投毒风险。',
  },
  hsts: {
    title: 'HTTP 严格传输安全',
    description: '检查 Strict-Transport-Security 响应头及预加载兼容性。',
    use: '用于确认浏览器会强制使用 HTTPS，并保护子域名。',
  },
  'dns-server': {
    title: 'DNS 服务器',
    description: '查询目标域名的权威名称服务器及其地址。',
    use: '用于了解 DNS 托管结构和冗余配置。',
  },
  'tech-stack': {
    title: '技术栈',
    description: '识别网页使用的框架、服务器、分析工具和第三方服务。',
    use: '用于技术调研、资产盘点和攻击面分析。',
  },
  sitemap: {
    title: '站点页面',
    description: '读取站点地图及其页面、更新时间和优先级。',
    use: '用于了解网站结构、公开页面范围和搜索引擎索引策略。',
  },
  'security-txt': {
    title: 'Security.txt',
    description: '检查标准安全披露联系文件是否存在并有效。',
    use: '便于安全研究人员找到正确的漏洞报告渠道。',
  },
  'linked-pages': {
    title: '页面链接',
    description: '提取目标页面中的内部链接和外部链接。',
    use: '用于理解站点结构、依赖关系和对外连接。',
  },
  'social-tags': {
    title: '社交分享标签',
    description: '检查 Open Graph、Twitter 卡片和常用页面元数据。',
    use: '用于优化搜索结果与社交平台分享预览。',
  },
  'mail-config': {
    title: '邮件配置',
    description: '检查 MX、SPF、DKIM、DMARC 和 BIMI 等邮件相关配置。',
    use: '用于评估邮件投递、域名伪造和钓鱼防护能力。',
  },
  firewall: {
    title: '防火墙检测',
    description: '根据响应特征识别常见 Web 应用防火墙。',
    use: '用于了解目标是否部署了针对恶意请求的边界防护。',
  },
  'http-security': {
    title: 'HTTP 安全功能',
    description: '汇总 CSP、HSTS、Frame、Referrer、Permissions 等安全响应头。',
    use: '用于快速发现浏览器侧安全策略缺失。',
  },
  archives: {
    title: '历史归档',
    description: '通过 Wayback Machine 获取网站的历史快照统计。',
    use: '用于了解站点演变，并查找已删除或修改的历史内容。',
  },
  rank: {
    title: '全球排名',
    description: '根据 Tranco 数据显示站点在热门网站中的相对排名。',
    use: '用于粗略判断网站规模、流行度和历史趋势。',
  },
  'block-lists': {
    title: '拦截名单检测',
    description: '使用多个隐私、恶意软件和家长控制 DNS 服务测试目标是否被拦截。',
    use: '用于了解域名信誉和在不同过滤服务中的可访问性。',
  },
  threats: {
    title: '恶意软件与钓鱼检测',
    description: '查询多个恶意软件、钓鱼和安全浏览情报源。',
    use: '用于快速评估目标信誉；命中结果需要结合情报源进一步确认。',
  },
  'tls-connection': {
    title: 'TLS 连接',
    description: '执行真实 TLS 握手，显示协议、密码套件、ALPN 和证书信任状态。',
    use: '用于确认客户端当前实际协商到的加密配置。',
  },
  'tls-security-audit': {
    title: 'TLS 安全审计',
    description: '基于 SSL Labs 报告汇总评级、协议、前向保密和历史漏洞。',
    use: '用于快速识别弱 TLS 配置和已知风险。',
  },
  'tls-client-compat': {
    title: 'TLS 客户端兼容性',
    description: '模拟常见浏览器、系统和运行库与目标的 TLS 握手。',
    use: '用于确认旧版或受限客户端是否仍能连接。',
  },
  screenshot: {
    title: '网页截图',
    description: '从扫描服务器所在网络访问目标并生成页面截图。',
    use: '用于快速确认目标页面外观、地域差异或无头浏览器中的呈现结果。',
  },
  subdomains: {
    title: '子域名',
    description: '通过证书透明度日志和公开数据源发现目标域名下的子域名。',
    use: '用于梳理公开攻击面，发现开发、测试、管理或历史服务。',
  },
};

export const chineseAbout = [
  'Web Check 是一款用于发现网站或主机信息的一站式工具。只需输入网址，它就会收集、整理并呈现多种公开数据，供你进一步分析。',
  '报告会突出潜在攻击面、现有安全措施以及网站架构中的关联关系，也能帮助站点维护者优化服务器响应、重定向、Cookie 和 DNS 配置。',
  '无论你是开发者、系统管理员、安全研究人员、渗透测试人员，还是希望了解网站底层技术，都可以将它作为日常工具的一部分。',
];

export const chineseFeatureIntro = [
  '对网站或主机开展开源情报调查时，需要关注多个关键领域。下方逐项说明了这些检查，并提供继续研究所需的工具和资料。',
  'Web Check 可以自动收集这些数据，但仍需要由你结合场景解释结果并作出判断。',
];

export const chineseSupportUs = [
  'Web Check 可以不受限制地免费使用。',
  '所有代码均为开源，你可以部署自己的实例，也可以在个人或商业场景中派生、修改和分发。',
  "运行公共实例每月会产生费用。如果这个工具对你有帮助，可以考虑在 <a href='https://github.com/sponsors/Lissy93'>GitHub 上赞助项目</a>。每月 1 至 2 美元也能为持续维护提供很大帮助。",
  "你也可以通过向 <a href='https://github.com/lissy93/web-check'>GitHub 仓库</a>提交或审查代码、在 Product Hunt 投票，或向其他人分享项目来提供帮助。",
  '无需为此感到有压力；这个项目会一直保持免费和开源，我们也会尽力维持公共实例可用。',
];

export const chineseFairUse = [
  '请负责任地使用本工具。不要扫描未经授权的主机，也不要将它用于攻击或中断服务。',
  '为防止滥用，请求可能受到限流。如果需要更高额度，请部署自己的实例。',
  '公共服务不保证正常运行时间或可用性。如有稳定性要求，请部署自己的实例。',
  '请合理使用。过量请求会迅速耗尽 Serverless 配额，影响其他用户。',
];

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: MessageKey, values?: Record<string, string | number>) => string;
}>({
  language: 'en',
  setLanguage: () => undefined,
  t: (key) => messages.en[key],
});

const detectLanguage = (): Language => {
  if (
    typeof document !== 'undefined' &&
    document.documentElement.lang.toLowerCase().startsWith('zh')
  ) {
    return 'zh-CN';
  }
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh')) {
    return 'zh-CN';
  }
  return 'en';
};

const interpolate = (message: string, values?: Record<string, string | number>) =>
  Object.entries(values || {}).reduce(
    (result, [key, value]) => result.split(`{${key}}`).join(String(value)),
    message,
  );

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    document.documentElement.lang = next;
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent('web-check-language-change', { detail: next }));
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'zh-CN') setLanguageState(stored);

    const onLanguageChange = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === 'en' || next === 'zh-CN') setLanguageState(next);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && (event.newValue === 'en' || event.newValue === 'zh-CN')) {
        setLanguageState(event.newValue);
      }
    };
    window.addEventListener('web-check-language-change', onLanguageChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('web-check-language-change', onLanguageChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key: MessageKey, values?: Record<string, string | number>) =>
      interpolate(messages[language][key], values),
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);

export const localizeCardTitle = (id: string, fallback: string, language: Language) =>
  language === 'zh-CN' ? cardTitles[id] || fallback : fallback;

export const localizeText = (text: unknown, language: Language): string => {
  const value = String(text ?? '');
  if (language !== 'zh-CN') return value;
  const direct = chineseText[value];
  if (direct) return direct;

  const dynamic: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
    [/^First (\d+)$/, (m) => `前 ${m[1]} 项`],
    [/^(\d+) records$/, (m) => `${m[1]} 条记录`],
    [/^Record #(\d+)$/, (m) => `记录 #${m[1]}`],
    [/^(.+) - Present\?$/, (m) => `${m[1]} - 是否存在`],
    [/^Blocked by (\d+) DNS resolver\(s\)$/, (m) => `被 ${m[1]} 个 DNS 解析服务拦截`],
    [/^Long redirect chain: (\d+) hops$/, (m) => `重定向链过长：${m[1]} 跳`],
    [/^(\d+) redirect hop\(s\)$/, (m) => `${m[1]} 次重定向`],
    [/^Site responded with (\d+)$/, (m) => `站点响应状态码 ${m[1]}`],
    [/^Response time over (\d+)ms$/, (m) => `响应时间超过 ${m[1]} 毫秒`],
    [/^SSL Labs grade (.+)$/, (m) => `SSL Labs 评级 ${m[1]}`],
    [/^Missing (.+)$/, (m) => `缺少 ${m[1]}`],
    [/^(.+) set$/, (m) => `已设置 ${m[1]}`],
    [/^Port (\d+) open: (.+)$/, (m) => `端口 ${m[1]} 开放：${m[2]}`],
    [/^Cookie "(.+)" missing Secure flag$/, (m) => `Cookie“${m[1]}”缺少 Secure 标志`],
    [/^Cookie "(.+)" missing HttpOnly flag$/, (m) => `Cookie“${m[1]}”缺少 HttpOnly 标志`],
    [/^Cookie "(.+)" missing SameSite flag$/, (m) => `Cookie“${m[1]}”缺少 SameSite 标志`],
    [/^WAF detected: (.+)$/, (m) => `检测到 WAF：${m[1]}`],
    [/^Server discloses (.+)$/, (m) => `服务器暴露 ${m[1]}`],
    [/^Missing social tags: (\d+)$/, (m) => `缺少 ${m[1]} 个社交分享标签`],
    [/^Outdated TLS protocol negotiated: (.+)$/, (m) => `协商了过时的 TLS 协议：${m[1]}`],
    [/^Shodan reports (\d+) CVE\(s\) on this host$/, (m) => `Shodan 报告该主机存在 ${m[1]} 个 CVE`],
  ];
  for (const [pattern, translate] of dynamic) {
    const match = value.match(pattern);
    if (match) return translate(match);
  }
  return value;
};

export const localizeDoc = <
  T extends { id: string; title: string; description: string; use: string },
>(
  doc: T,
  language: Language,
): T => {
  if (language !== 'zh-CN' || !chineseDocs[doc.id]) return doc;
  return { ...doc, ...chineseDocs[doc.id] };
};
