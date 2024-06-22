import React from 'react';
import styled from '@emotion/styled';

import colors from 'web-check-live/styles/colors';
import Heading from 'web-check-live/components/Form/Heading';
import Footer from 'web-check-live/components/misc/Footer';
import Nav from 'web-check-live/components/Form/Nav';
import Button from 'web-check-live/components/Form/Button';
import { StyledCard } from 'web-check-live/components/Form/Card';
import { Link } from 'react-router-dom';

interface ErrorBoundaryState {
  hasError: boolean;
  errorCount: number;
  errorMessage: string | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
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
  h3 { font-size: 6rem; }
`;

const ErrorDetails = styled.div`
  background: ${colors.primaryTransparent};
  padding: 1rem;
  border-radius: 0.5rem;
`;

const ErrorMessageText = styled.p`
  color: ${colors.danger};
`;

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorCount: 0, errorMessage: null };
  }

  static getDerivedStateFromError(err: Error): ErrorBoundaryState {
    return { hasError: true, errorCount: 0, errorMessage: err.message };
  }
  

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    console.error(
      `%cCritical Error%c\n\nRoute or component failed to mount%c:%c\n`
      +`${this.state.errorCount < 1? 'Will attempt a page reload' : ''}. `
      + `Error Details:\n${error}\n\n${JSON.stringify(errorInfo || {})}`,
      `background: ${colors.danger}; color:${colors.background}; padding: 4px 8px; font-size: 16px;`,
      `font-weight: bold; color: ${colors.danger};`,
      `color: ${colors.danger};`,
      `color: ${colors.warning};`,
    );
    if (this.state.errorCount < 1) {
      this.setState(prevState => ({ errorCount: prevState.errorCount + 1 }));
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPageContainer>
          <Nav>
            <HeaderLinkContainer>
              <Link to="/"><Button>Go back Home</Button></Link>
              <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check"><Button>View on GitHub</Button></a>
            </HeaderLinkContainer>
          </Nav>
          <ErrorInner>
            <Heading as="h1" size="medium" color={colors.primary}>Something's gone wrong</Heading>
            <Heading as="h2" size="small" color={colors.textColor}>An unexpected error occurred.</Heading>
            <Heading as="h3" size="large" color={colors.textColor}>🤯</Heading>
            <ErrorDetails>
              <p>
                We're sorry this happened.
                Usually reloading the page will resolve this, but if it doesn't, please raise a bug report.
              </p>
              {this.state.errorMessage && (
              <p>
                Below is the error message we received:<br /><br />
                <ErrorMessageText>{this.state.errorMessage}</ErrorMessageText>
              </p>
              )}
            </ErrorDetails>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
            <a target="_blank" rel="noreferrer" href="github.com/lissy93/web-check/issues/choose">
              Report Issue
            </a>
          </ErrorInner>
          <Footer isFixed={true} />
        </ErrorPageContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
