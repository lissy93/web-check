import { ReactNode } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import Heading from 'components/Form/Heading';

export interface RowProps {
  lbl: string,
  val: string,
  key?: string | number,
  children?: ReactNode,
  rowList?: RowProps[],
  title?: string,
  open?: boolean,
  plaintext?: string,
  listResults?: string[],
}

export const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0.25rem;
  &:not(:last-child) { border-bottom: 1px solid ${colors.primary}; }
  span.lbl { font-weight: bold; }
  span.val {
    max-width: 16rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    a {
      color: ${colors.primary};
    }
  }  
`;

const StyledExpandableRow = styled(StyledRow).attrs({
  as: "summary"
})``;

export const Details = styled.details`
  transition: all 0.2s ease-in-out;
  summary {
    padding-left: 1rem;
    cursor: pointer;
  }
  summary:before {
    content: "►";
    position: absolute;
    margin-left: -1rem;
    color: ${colors.primary};
    cursor: pointer;
  }
  &[open] summary:before {
    content: "▼";
  }
`;

const SubRowList = styled.ul`
  margin: 0;
  padding: 0.25rem;
  background: ${colors.primaryTransparent};
`;

const SubRow = styled(StyledRow).attrs({
  as: "li"
})`
  border-bottom: 1px dashed ${colors.primaryTransparent} !important;
`;

const PlainText = styled.pre`
  background: ${colors.background};
  width: 95%;
  white-space: pre-wrap;
  word-wrap: break-word;
  border-radius: 4px;
  padding: 0.25rem;
`;

const List = styled.ul`
  // background: ${colors.background};
  width: 95%;
  white-space: pre-wrap;
  word-wrap: break-word;
  border-radius: 4px;
  margin: 0;
  padding: 0.25rem 0.25rem 0.25rem 1rem;
  li {
    // white-space: nowrap;
    // overflow: hidden;
    text-overflow: ellipsis;
    list-style: circle;
    &:first-letter{
      text-transform: capitalize
    }
    &::marker {
      color: ${colors.primary};
    }
  }
`;

const isValidDate = (date: any): boolean => {
  // Checks if a date is within reasonable range
  const isInRange = (date: Date): boolean => {
    return date >= new Date('1995-01-01') && date <= new Date('2030-12-31');
  };

  // Check if input is a timestamp
  if (typeof date === 'number') {
    const timestampDate = new Date(date);
    return !isNaN(timestampDate.getTime()) && isInRange(timestampDate);
  }

  // Check if input is a date string
  if (typeof date === 'string') {
    const dateStringDate = new Date(date);
    return !isNaN(dateStringDate.getTime()) && isInRange(dateStringDate);
  }

  // Check if input is a Date object
  if (date instanceof Date) {
    return !isNaN(date.getTime()) && isInRange(date);
  }

  return false;
};


const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(dateString));
}
const formatValue = (value: any): string => {
  if (isValidDate(new Date(value))) return formatDate(value);
  if (typeof value === 'boolean') return value ? '✅' : '❌';
  return value;
};


const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
}

const snip = (text: string, length: number = 80) => {
  if (text.length < length) return text;
  return `${text.substring(0, length)}...`;
};

export const ExpandableRow = (props: RowProps) => {
  const { lbl, val, title, rowList, open } = props;
  return (
    <Details open={open}>
      <StyledExpandableRow key={`${lbl}-${val}`}>
        <span className="lbl" title={title?.toString()}>{lbl}</span>
        <span className="val" title={val?.toString()}>{val.toString()}</span>
      </StyledExpandableRow>
      { rowList &&
        <SubRowList>
          { rowList?.map((row: RowProps, index: number) => {
            return (
              <SubRow key={`${row.lbl}-${index}`}>
                <span className="lbl" title={row.title}>{row.lbl}</span>
                <span className="val" title={row.val} onClick={() => copyToClipboard(row.val)}>
                  {formatValue(row.val)}
                </span>
                { row.plaintext && <PlainText>{row.plaintext}</PlainText> }
                { row.listResults && (<List>
                  {row.listResults.map((listItem: string, listIndex: number) => (
                    <li key={listItem}>{snip(listItem)}</li>
                  ))}
                </List>)}
              </SubRow>
            )
          })}
        </SubRowList>
      }
    </Details>
  );
};

export const ListRow = (props: { list: string[], title: string }) => {
  const { list, title } = props;
  return (
  <>
    <Heading as="h4" size="small" align="left" color={colors.primary}>{title}</Heading>
    { list.map((entry: string, index: number) => {
      return (
      <Row lbl="" val="" key={`${entry}-${title.toLocaleLowerCase()}-${index}`}>
        <span>{ entry }</span>
      </Row>
      )}
    )}
  </>
);
}

const Row = (props: RowProps) => {
  const { lbl, val, title, plaintext, listResults, children } = props;
  if (children) return <StyledRow key={`${lbl}-${val}`}>{children}</StyledRow>;
  return (
  <StyledRow key={`${lbl}-${val}`}>
    { lbl && <span className="lbl" title={title}>{lbl}</span> }
    <span className="val" title={val} onClick={() => copyToClipboard(val)}>
      {formatValue(val)}
    </span>
    { plaintext && <PlainText>{plaintext}</PlainText> }
    { listResults && (<List>
      {listResults.map((listItem: string, listIndex: number) => (
        <li key={listIndex} title={listItem}>{snip(listItem)}</li>
      ))}
    </List>)}
  </StyledRow>
  );
};

export default Row;
