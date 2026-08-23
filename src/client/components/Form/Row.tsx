import type { ReactNode } from 'react';
import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import Heading from 'client/components/Form/Heading';
import { localizeText, useLanguage, type Language } from 'client/i18n';

export interface RowProps {
  lbl: string;
  val: string;
  key?: string | number;
  children?: ReactNode;
  rowList?: RowProps[];
  title?: string;
  open?: boolean;
  plaintext?: string;
  listResults?: string[];
}

export const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0.25rem;
  &li {
    border-bottom: 1px dashed ${colors.primaryTransparent} !important;
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${colors.primaryTransparent};
  }
  span.lbl {
    font-weight: bold;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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

export const Details = styled.details`
  transition: all 0.2s ease-in-out;
  summary {
    padding-left: 1rem;
    cursor: pointer;
  }
  summary:before {
    content: '►';
    position: absolute;
    margin-left: -1rem;
    color: ${colors.primary};
    cursor: pointer;
  }
  &[open] summary:before {
    content: '▼';
  }
`;

const SubRowList = styled.ul`
  margin: 0;
  padding: 0.25rem;
  background: ${colors.primaryTransparent};
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
    &:first-letter {
      text-transform: capitalize;
    }
    &::marker {
      color: ${colors.primary};
    }
  }
`;

// Only date-format strings that actually look like dates, not bare numbers
const isDateLike = (value: any): boolean => {
  if (typeof value !== 'string' || value.length < 8 || !/[-/: ]/.test(value)) return false;
  const date = new Date(value);
  if (isNaN(date.getTime())) return false;
  return date >= new Date('1995-01-01') && date <= new Date('2030-12-31');
};

const formatDate = (dateString: string, language: Language): string => {
  return new Intl.DateTimeFormat(language === 'zh-CN' ? 'zh-CN' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
};

const formatValue = (value: any, language: Language): string => {
  if (isDateLike(value)) return formatDate(value, language);
  if (typeof value === 'boolean') return value ? '✅' : '❌';
  return localizeText(value, language);
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const snip = (text: string, length: number = 80) => {
  if (text.length < length) return text;
  return `${text.substring(0, length)}...`;
};

export const ExpandableRow = (props: RowProps) => {
  const { language } = useLanguage();
  const { lbl, val, title, rowList, open } = props;
  return (
    <Details open={open}>
      <StyledRow as="summary" key={`${lbl}-${val}`}>
        <span className="lbl" title={title?.toString()}>
          {localizeText(lbl, language)}
        </span>
        <span className="val" title={val?.toString()}>
          {localizeText(val, language)}
        </span>
      </StyledRow>
      {rowList && (
        <SubRowList>
          {rowList?.map((row: RowProps, index: number) => {
            return (
              <StyledRow as="li" key={`${row.lbl}-${index}`}>
                <span className="lbl" title={row.title?.toString()}>
                  {localizeText(row.lbl, language)}
                </span>
                <span
                  className="val"
                  title={row.val?.toString()}
                  onClick={() => copyToClipboard(row.val)}
                >
                  {formatValue(row.val, language)}
                </span>
                {row.plaintext && <PlainText>{row.plaintext}</PlainText>}
                {row.listResults && (
                  <List>
                    {row.listResults.map((listItem: string) => (
                      <li key={listItem}>{snip(listItem)}</li>
                    ))}
                  </List>
                )}
              </StyledRow>
            );
          })}
        </SubRowList>
      )}
    </Details>
  );
};

export const ListRow = (props: { list: string[]; title: string }) => {
  const { language } = useLanguage();
  const { list, title } = props;
  return (
    <>
      <Heading as="h4" size="small" align="left" color={colors.primary}>
        {localizeText(title, language)}
      </Heading>
      {list.map((entry: string, index: number) => {
        return (
          <Row lbl="" val="" key={`${entry}-${title.toLocaleLowerCase()}-${index}`}>
            <span>{entry}</span>
          </Row>
        );
      })}
    </>
  );
};

const Row = (props: RowProps) => {
  const { language } = useLanguage();
  const { lbl, val, title, plaintext, listResults, children } = props;
  if (children) return <StyledRow key={`${lbl}-${val}`}>{children}</StyledRow>;
  return (
    <StyledRow key={`${lbl}-${val}`}>
      {lbl && (
        <span className="lbl" title={title?.toString()}>
          {localizeText(lbl, language)}
        </span>
      )}
      <span className="val" title={val?.toString()} onClick={() => copyToClipboard(val)}>
        {formatValue(val, language)}
      </span>
      {plaintext && <PlainText>{plaintext}</PlainText>}
      {listResults && (
        <List>
          {listResults.map((listItem: string, listIndex: number) => (
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
