import { Card } from 'client/components/Form/Card';
import Row, { Details } from 'client/components/Form/Row';
import colors from 'client/styles/colors';
import { localizeText, useLanguage } from 'client/i18n';

const cardStyles = `
small {
  margin-top: 1rem;
  opacity: 0.5;
  display: block;
  a { color: ${colors.primary}; }
}
summary {
  padding: 0.5rem 0 0 0.5rem !important;
  cursor: pointer;
  font-weight: bold;
}
pre {
  background: ${colors.background};
  padding: 0.5rem 0.25rem;
  border-radius: 4px;
  overflow: auto;
}
`;

const getPagePath = (url: string): string => {
  try {
    return new URL(url).pathname;
  } catch (error) {
    return url;
  }
};

const SecurityTxtCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const { language } = useLanguage();
  const securityTxt = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      <Row lbl="Present" val={securityTxt.isPresent ? '✅ Yes' : '❌ No'} />
      {securityTxt.isPresent && (
        <>
          <Row lbl="File Location" val={securityTxt.foundIn} />
          <Row lbl="PGP Signed" val={securityTxt.isPgpSigned ? '✅ Yes' : '❌ No'} />
          {securityTxt.fields &&
            Object.keys(securityTxt.fields).map((field: string, index: number) => {
              if (securityTxt.fields[field].includes('http'))
                return (
                  <Row lbl="" val="" key={`policy-url-row-${index}`}>
                    <span className="lbl">{field}</span>
                    <span className="val">
                      <a href={securityTxt.fields[field]}>
                        {getPagePath(securityTxt.fields[field])}
                      </a>
                    </span>
                  </Row>
                );
              return (
                <Row lbl={field} val={securityTxt.fields[field]} key={`policy-row-${index}`} />
              );
            })}
          <Details>
            <summary>{localizeText('View Full Policy', language)}</summary>
            <pre>{securityTxt.content}</pre>
          </Details>
        </>
      )}
      {!securityTxt.isPresent && (
        <small>
          {language === 'zh-CN'
            ? '发布 security.txt 可以让安全研究人员知道如何通过正确渠道报告漏洞。'
            : 'Having a security.txt ensures security researchers know how and where to safely report vulnerabilities.'}
        </small>
      )}
    </Card>
  );
};

export default SecurityTxtCard;
