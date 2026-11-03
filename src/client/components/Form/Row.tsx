import type { ReactNode } from 'react';
import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import Heading from 'client/components/Form/Heading';
import { StatusIcon, type Status } from 'client/components/misc/Icon';
import Tooltip from 'client/components/misc/Tooltip';
import CopyButton from 'client/components/misc/CopyButton';
import { formatDate } from 'client/utils/format';
import { termText, type TermId } from '@/data/glossary';

export interface RowProps {
  lbl?: string;
  val?: string | number | boolean;
  status?: Status;
  reason?: string;
  term?: TermId;
  yes?: string;
  no?: string;
  title?: string;
  link?: string;
  plaintext?: string;
  listResults?: string[];
  copyText?: string;
  children?: ReactNode;
}

export const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  column-gap: 0.5rem;
  padding: 0.25rem;
  &:not(:last-child) {
    border-bottom: 1px solid ${colors.primaryTransparent};
  }
  > a {
    color: ${colors.textColor};
    &:hover {
      color: ${colors.primaryIncreasedContrast};
    }
  }
  /* Labels keep a third of the row, so long values can't squash them */
  span.lbl {
    font-weight: bold;
    flex: 1;
    min-width: calc(35% - 0.5rem);
    white-space: var(--row-wrap, nowrap);
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span.val {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.4em;
    min-width: 0;
    max-width: var(--row-value-width, min(16rem, 65%));
    > span,
    > a {
      white-space: var(--row-wrap, nowrap);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    a {
      color: ${colors.primaryIncreasedContrast};
    }
  }
  /* Copy buttons wait for a hover or focus, unless there's no way to hover */
  @media (hover: hover) {
    &:not(:hover, :focus-within) .copy {
      opacity: 0;
    }
  }
`;

const Details = styled.details`
  transition: all 0.2s ease-in-out;
  > summary {
    padding-left: 1rem;
    list-style: none;
    cursor: pointer;
    &::-webkit-details-marker {
      display: none;
    }
  }
  > summary:before {
    content: '►';
    position: absolute;
    margin-left: -1rem;
    color: ${colors.primary};
    cursor: pointer;
  }
  &[open] > summary:before {
    content: '▼';
  }
`;

const Collapsible = styled(Details)`
  > summary {
    margin: 1rem 0 0.5rem 0;
  }
`;

const SubRows = styled.div`
  padding: 0.25rem;
  background: ${colors.primaryTransparent};
`;

const PlainText = styled.pre`
  background: ${colors.background};
  width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  border-radius: 4px;
  padding: 0.25rem;
  .copy {
    float: right;
  }
`;

const List = styled.ul`
  width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  border-radius: 4px;
  margin: 0;
  padding: 0.25rem 0.25rem 0.25rem 1rem;
  li {
    text-overflow: ellipsis;
    list-style: circle;
    &:first-letter {
      text-transform: capitalize;
    }
    &::marker {
      color: ${colors.primary};
    }
  }
`;

// Only date-format strings holding an ISO date or a time, not names with numbers in
const isDateLike = (value: any): boolean => {
  if (typeof value !== 'string' || !/\d{4}-\d\d-\d\d|\d\d?:\d\d:\d\d/.test(value)) return false;
  const date = new Date(value);
  if (isNaN(date.getTime())) return false;
  return date >= new Date('1995-01-01') && date <= new Date('2030-12-31');
};

// The text shown for a value, with dates formatted and booleans as yes or no
const valueText = ({ val, yes = 'Yes', no = 'No' }: RowProps): string => {
  if (typeof val === 'boolean') return val ? yes : no;
  return isDateLike(val) ? formatDate(val as string) : String(val ?? '');
};

// Why a row got its status, then what its term means, for the tooltip on its icon
const hint = ({ reason, term }: RowProps, status: Status) =>
  (reason || term) && (
    <>
      {reason && <b>{reason}</b>}
      {term && termText(term, status === 'pass')}
    </>
  );

// A value's copy button and text, as a link when given one, then its status icon
const Value = (props: RowProps) => {
  const { lbl, val, link, copyText } = props;
  const status = props.status || (typeof val === 'boolean' ? (val ? 'pass' : 'error') : undefined);
  const text = valueText(props);
  const copyValue = copyText ?? text;
  return (
    <>
      {copyValue && typeof val !== 'boolean' && <CopyButton text={copyValue} name={lbl} />}
      {link ? (
        <a href={link} target="_blank" rel="noreferrer">
          {text}
        </a>
      ) : (
        <span>{text}</span>
      )}
      {status && (
        <Tooltip content={hint(props, status)}>
          <StatusIcon status={status} />
        </Tooltip>
      )}
    </>
  );
};

const snip = (text: string, length: number = 80) => {
  if (text.length < length) return text;
  return `${text.substring(0, length)}...`;
};

// A titled group of rows, which can start collapsed
export const Section = (props: {
  title: ReactNode;
  collapsible?: boolean;
  children: ReactNode;
}) => {
  const { title, collapsible, children } = props;
  const heading = (
    <Heading
      as="h4"
      size="small"
      align="left"
      color={colors.primaryIncreasedContrast}
      inline={collapsible}
    >
      {title}
    </Heading>
  );
  if (!collapsible) {
    return (
      <>
        {title && heading}
        {children}
      </>
    );
  }
  return (
    <Collapsible>
      <summary>{heading}</summary>
      {children}
    </Collapsible>
  );
};

export const ExpandableRow = (props: RowProps & { rowList?: RowProps[]; open?: boolean }) => {
  const { lbl, val, title, rowList = [], open } = props;
  return (
    <Details open={open}>
      <StyledRow as="summary">
        <span className="lbl" title={title || lbl}>
          {lbl}
        </span>
        {val != null && (
          <span className="val" title={title || valueText(props)}>
            <Value {...props} />
          </span>
        )}
      </StyledRow>
      <SubRows>
        {rowList.map((row, index) => (
          <Row key={index} {...row} />
        ))}
      </SubRows>
    </Details>
  );
};

export const ListRow = (props: { list: string[]; title: string }) => {
  const { list, title } = props;
  return (
    <Section title={title}>
      {list.map((entry, index) => (
        <Row key={`${entry}-${index}`}>
          {entry}
          <CopyButton text={entry} />
        </Row>
      ))}
    </Section>
  );
};

const Row = (props: RowProps) => {
  const { lbl, val, title, plaintext, listResults, children } = props;
  if (children) return <StyledRow>{children}</StyledRow>;
  const text = valueText(props);
  return (
    <StyledRow>
      {lbl && (
        <span className="lbl" title={title || lbl}>
          {lbl}
        </span>
      )}
      {val != null && (
        <span className="val" title={title || text}>
          <Value {...props} />
        </span>
      )}
      {plaintext && (
        <PlainText>
          <CopyButton text={plaintext} name={lbl} />
          {plaintext}
        </PlainText>
      )}
      {listResults && (
        <List>
          {listResults.map((listItem, listIndex) => (
            <li key={listIndex} title={listItem}>
              {snip(listItem)}
            </li>
          ))}
        </List>
      )}
    </StyledRow>
  );
};

export default Row;
