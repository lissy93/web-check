import React, { Component, ErrorInfo, ReactNode } from "react";
import styled from 'styled-components';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import colors from 'styles/colors';

interface Props {
  children: ReactNode;
  title?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

const ErrorText = styled.p`
  color: ${colors.danger};
`;

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: null
  };

  // Catch errors in any components below and re-render with error message
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }


  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Card>
          { this.props.title && <Heading color={colors.primary}>{this.props.title}</Heading> }
          <ErrorText>This component errored unexpectedly</ErrorText>
          <p>
            Usually this happens if the result from the server was not what was expected.
            Check the logs for more info. If you continue to experience this issue, please raise a ticket on the repository.
          </p>
          {
            this.state.errorMessage &&
            <details>
              <summary>Error Details</summary>
              <div>{this.state.errorMessage}</div>
            </details>
          }
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
