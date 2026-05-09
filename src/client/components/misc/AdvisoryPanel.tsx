import { useMemo, type ReactNode } from 'react';
import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import Card from 'client/components/Form/Card';
import Heading from 'client/components/Form/Heading';
import type { Finding, Severity } from 'client/analysis/types';

const ORDER: Severity[] = ['critical', 'issue', 'warning', 'info', 'pass'];

interface SevMeta {
  label: string;
  color: string;
  glyph: string;
  defaultOpen: boolean;
}

const META: Record<Severity, SevMeta> = {
  critical: { label: 'Critical', color: colors.danger, glyph: '✕', defaultOpen: true },
  issue: { label: 'Issues', color: colors.error, glyph: '!', defaultOpen: true },
  warning: { label: 'Warnings', color: colors.warning, glyph: '△', defaultOpen: false },
  info: { label: 'Informational', color: colors.info, glyph: 'ⓘ', defaultOpen: false },
  pass: { label: 'Passes', color: colors.success, glyph: '✓', defaultOpen: false },
};

const Wrapper = styled(Card)`
  margin: 0 auto;
  width: 95vw;
  h2 {
    margin: 0 0 0.75rem 0;
  }
  details {
    border-radius: 4px;
    margin: 0.4rem 0;
    padding: 0.25rem 0.5rem;
    summary {
      cursor: pointer;
      font-weight: 600;
      padding: 0.35rem 0;
      list-style: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      &::-webkit-details-marker {
        display: none;
      }
      &:before {
        content: '►';
        color: currentColor;
        font-size: 0.85rem;
      }
      .count {
        color: ${colors.textColorSecondary};
        font-weight: 400;
        font-size: 0.9rem;
      }
    }
    &[open] summary:before {
      content: '▼';
    }
  }
  ul.findings {
    list-style: none;
    margin: 0.25rem 0 0.5rem 0;
    padding: 0;
    li {
      display: grid;
      grid-template-columns: 1.25rem 1fr;
      gap: 0.5rem;
      align-items: baseline;
      padding: 0.3rem 0;
      .glyph {
        font-weight: 700;
        line-height: 1;
        text-align: center;
        align-self: center;
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
          &:hover,
          &:focus-visible {
            color: ${colors.primary};
            outline: none;
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
`;

interface Props {
  findings: Finding[];
  onJumpTo: (cardId: string) => void;
}

// Group findings by severity, render summary + collapsible sections, hide when empty
const AdvisoryPanel = ({ findings, onJumpTo }: Props): ReactNode => {
  const { grouped, visible } = useMemo(() => {
    const grouped: Record<Severity, Finding[]> = {
      critical: [],
      issue: [],
      warning: [],
      info: [],
      pass: [],
    };
    for (const f of findings) grouped[f.severity].push(f);
    return { grouped, visible: ORDER.filter((sev) => grouped[sev].length) };
  }, [findings]);

  if (!findings.length) return null;

  return (
    <Wrapper>
      <Heading as="h2" align="left" color={colors.primary}>
        Advisory
      </Heading>
      {visible.map((sev) => {
        const meta = META[sev];
        const items = grouped[sev];
        return (
          <details
            key={sev}
            id={`advisory-${sev}`}
            open={meta.defaultOpen}
            style={{ background: `${meta.color}0D` }}
          >
            <summary style={{ color: meta.color }}>
              {meta.label}
              <span className="count">({items.length})</span>
            </summary>
            <ul className="findings">
              {items.map((f, i) => (
                <li key={`${f.cardId}-${i}`}>
                  <span className="glyph" style={{ color: meta.color }} aria-label={meta.label}>
                    {meta.glyph}
                  </span>
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
