import React from 'react';
import styled from '@emotion/styled';

import colors from 'client/styles/colors';
import Heading from 'client/components/Form/Heading';
import Footer from 'client/components/misc/Footer';
import Nav from 'client/components/Form/Nav';
import Button from 'client/components/Form/Button';
import { StyledCard } from 'client/components/Form/Card';
import { Link } from 'react-router';
import { useLanguage, type Language } from 'client/i18n';

interface ErrorBoundaryState {
  hasError: boolean;
  errorCount: number;
  errorMessage: string | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface InnerProps extends ErrorBoundaryProps {
  language: Language;
}

const ErrorPageContainer = styled.div`
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

const ErrorInner = styled(StyledCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  h3 {
    font-size: 6rem;
  }
`;

const ErrorDetails = styled.div`
  background: ${colors.primaryTransparent};
  padding: 1rem;
  border-radius: 0.5rem;
`;

const ErrorMessageText = styled.p`
  color: ${colors.danger};
`;

class ErrorBoundaryInner extends React.Component<InnerProps, ErrorBoundaryState> {
  constructor(props: InnerProps) {
    super(props);
    this.state = { hasError: false, errorCount: 0, errorMessage: null };
  }

  static getDerivedStateFromError(err: Error): ErrorBoundaryState {
    return { hasError: true, errorCount: 0, errorMessage: err.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    console.error(
      `%cCritical Error%c\n\nRoute or component failed to mount%c:%c\n` +
        `${this.state.errorCount < 1 ? 'Will attempt a page reload' : ''}. ` +
        `Error Details:\n${error}\n\n${JSON.stringify(errorInfo || {})}`,
      `background: ${colors.danger}; color:${colors.background}; padding: 4px 8px; font-size: 16px;`,
      `font-weight: bold; color: ${colors.danger};`,
      `color: ${colors.danger};`,
      `color: ${colors.warning};`,
    );
    if (this.state.errorCount < 1) {
      this.setState((prevState) => ({ errorCount: prevState.errorCount + 1 }));
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      const isChinese = this.props.language === 'zh-CN';
      return (
        <ErrorPageContainer>
          <Nav>
            <HeaderLinkContainer>
              <Link to="/">
                <Button>{isChinese ? '返回首页' : 'Go back Home'}</Button>
              </Link>
              <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check">
                <Button>{isChinese ? '在 GitHub 查看' : 'View on GitHub'}</Button>
              </a>
            </HeaderLinkContainer>
          </Nav>
          <ErrorInner>
            <Heading as="h1" size="medium" color={colors.primary}>
              {isChinese ? '出现了一些问题' : "Something's gone wrong"}
            </Heading>
            <Heading as="h2" size="small" color={colors.textColor}>
              {isChinese ? '发生了意外错误。' : 'An unexpected error occurred.'}
            </Heading>
            <Heading as="h3" size="large" color={colors.textColor}>
              🤯
            </Heading>
            <ErrorDetails>
              <p>
                {isChinese
                  ? '很抱歉出现这个问题。重新加载页面通常可以解决；如果仍未恢复，请提交错误报告。'
                  : "We're sorry this happened. Usually reloading the page will resolve this, but if it doesn't, please raise a bug report."}
              </p>
              {this.state.errorMessage && (
                <p>
                  {isChinese ? '收到的错误消息如下：' : 'Below is the error message we received:'}
                  <br />
                  <br />
                  <ErrorMessageText>{this.state.errorMessage}</ErrorMessageText>
                </p>
              )}
            </ErrorDetails>
            <Button onClick={() => window.location.reload()}>
              {isChinese ? '重新加载页面' : 'Reload Page'}
            </Button>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/lissy93/web-check/issues/choose"
            >
              {isChinese ? '报告问题' : 'Report Issue'}
            </a>
          </ErrorInner>
          <Footer isFixed={true} />
        </ErrorPageContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundary = (props: ErrorBoundaryProps) => {
  const { language } = useLanguage();
  return <ErrorBoundaryInner {...props} language={language} />;
};

export default ErrorBoundary;
