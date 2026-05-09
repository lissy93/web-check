import { useMemo, type ReactNode } from 'react';
import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import Card from 'client/components/Form/Card';
import Heading from 'client/components/Form/Heading';
import type { Finding, Severity } from 'client/analysis/types';

const ORDER: Severity[] = ['critical', 'issue', 'warning', 'info', 'pass'];

const META: Record<Severity, { label: string; color: string; defaultOpen: boolean }> = {
  critical: { label: 'Critical', color: colors.danger, defaultOpen: true },
  issue: { label: 'Issues', color: colors.error, defaultOpen: true },
  warning: { label: 'Warnings', color: colors.warning, defaultOpen: true },
  info: { label: 'Informational', color: colors.info, defaultOpen: false },
  pass: { label: 'Passes', color: colors.success, defaultOpen: false },
};

const Wrapper = styled(Card)`
  margin: 0 auto 1rem auto;
  width: 95vw;
  details {
    margin: 0.25rem 0;
    summary {
      cursor: pointer;
      font-weight: bold;
      padding: 0.25rem 0;
      list-style: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      &::-webkit-details-marker {
        display: none;
      }
      &:before {
        content: '►';
        color: ${colors.primary};
        font-size: 0.75rem;
      }
    }
    &[open] summary:before {
      content: '▼';
    }
  }
  ul {
    list-style: none;
    margin: 0.25rem 0 0.5rem 0;
    padding: 0 0 0 1rem;
    li {
      padding: 0.25rem 0;
      display: grid;
      grid-template-columns: 0.5rem 1fr;
      gap: 0.5rem;
      align-items: baseline;
      .dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        display: inline-block;
        margin-top: 0.4rem;
      }
      .body {
        button.jump {
          background: none;
          border: none;
          color: ${colors.textColor};
          font-family: inherit;
          font-size: inherit;
          padding: 0;
          text-align: left;
          cursor: pointer;
          &:hover {
            color: ${colors.primary};
          }
        }
        .detail {
          color: ${colors.textColorSecondary};
          font-size: 0.85rem;
          display: block;
        }
      }
    }
  }
  .count {
    color: ${colors.textColorSecondary};
    font-weight: normal;
    font-size: 0.9rem;
  }
`;

interface Props {
  findings: Finding[];
  onJumpTo: (cardId: string) => void;
}

// Group findings by severity, render collapsible sections, hide when empty
const AdvisoryPanel = ({ findings, onJumpTo }: Props): ReactNode => {
  const grouped = useMemo(() => {
    const map: Record<Severity, Finding[]> = {
      critical: [],
      issue: [],
      warning: [],
      info: [],
      pass: [],
    };
    for (const f of findings) map[f.severity].push(f);
    return map;
  }, [findings]);

  if (!findings.length) return null;

  return (
    <Wrapper>
      <Heading as="h3" align="left" color={colors.primary}>
        Advisory
      </Heading>
      {ORDER.map((sev) => {
        const items = grouped[sev];
        if (!items.length) return null;
        const meta = META[sev];
        return (
          <details key={sev} open={meta.defaultOpen}>
            <summary style={{ color: meta.color }}>
              {meta.label}
              <span className="count">({items.length})</span>
            </summary>
            <ul>
              {items.map((f, i) => (
                <li key={`${f.cardId}-${sev}-${i}`}>
                  <span className="dot" style={{ background: meta.color }} aria-label={sev} />
                  <span className="body">
                    <button type="button" className="jump" onClick={() => onJumpTo(f.cardId)}>
                      {f.title}
                    </button>
                    {f.detail && <span className="detail">{f.detail}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </Wrapper>
  );
};

export default AdvisoryPanel;
