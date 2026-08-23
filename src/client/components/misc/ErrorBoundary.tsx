import { Component, type ErrorInfo, type ReactNode } from 'react';
import styled from '@emotion/styled';
import Card from 'client/components/Form/Card';
import Heading from 'client/components/Form/Heading';
import colors from 'client/styles/colors';
import { useLanguage, type Language } from 'client/i18n';

interface Props {
  children: ReactNode;
  title?: string;
  key?: string;
}

interface InnerProps extends Props {
  language: Language;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

const ErrorText = styled.p`
  color: ${colors.danger};
`;

class ErrorBoundaryInner extends Component<InnerProps, State> {
  public state: State = {
    hasError: false,
    errorMessage: null,
  };

  // Catch errors in any components below and re-render with error message
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const isChinese = this.props.language === 'zh-CN';
      return (
        <Card>
          {this.props.title && <Heading color={colors.primary}>{this.props.title}</Heading>}
          <ErrorText>
            {isChinese ? '此组件发生了意外错误' : 'This component errored unexpectedly'}
          </ErrorText>
          <p>
            {isChinese
              ? '这通常是因为服务器返回了非预期结果。请查看日志以了解详情；如果问题持续出现，请在项目仓库提交问题。'
              : 'Usually this happens if the result from the server was not what was expected. Check the logs for more info. If you continue to experience this issue, please raise a ticket on the repository.'}
          </p>
          {this.state.errorMessage && (
            <details>
              <summary>{isChinese ? '错误详情' : 'Error Details'}</summary>
              <div>{this.state.errorMessage}</div>
            </details>
          )}
        </Card>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundary = (props: Props) => {
  const { language } = useLanguage();
  return <ErrorBoundaryInner {...props} language={language} />;
};

export default ErrorBoundary;
