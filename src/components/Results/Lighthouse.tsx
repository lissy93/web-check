
import styled from 'styled-components';

import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import { ExpandableRow } from 'components/Form/Row';

const processScore = (percentile: number) => {
  return `${Math.round(percentile * 100)}%`;
}

const Outer = styled(Card)``;

const Row = styled.div`
  details summary {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem;
    cursor: pointer;
  }
  &:not(:last-child) { border-bottom: 1px solid ${colors.primary}; }
  span.lbl {
    font-weight: bold;
    text-transform: capitalize;
  }
  span.val {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ScoreRow = styled.li`
  list-style: none;
  margin: 0;
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem 0;
  justify-content: space-between;
  span { min-width: 5rem; max-width: 8rem; }
  border-bottom: 1px dashed ${colors.primaryTransparent};
`;

const ScoreList = styled.ul`
  margin: 0;
  padding: 0.25rem;
  border-top: 1px solid ${colors.primary};
  background: ${colors.primaryTransparent};
`;

interface Audit {
  id: string,
  score?: number | string,
  scoreDisplayMode?: string,
  title?: string,
  description?: string,
  displayValue?: string,
};

const ScoreItem = (props: { scoreId: any, audits: Audit[] }) => {
  const { scoreId, audits } = props;
  const audit = audits[scoreId];
  if (!audit.score) return null;

  let score = audit.score;
  if (audit.displayValue) {
    score = audit.displayValue;
  } else if (audit.scoreDisplayMode) {
    score = audit.score === 1 ? '✅ Pass' : '❌ Fail'; 
  }

  return (
    <ScoreRow title={audit.description}>
      <b>{ audit.title }</b>
      <span>{score}</span>
    </ScoreRow>
  );
};

const makeValue = (audit: Audit) => {
  let score = audit.score;
  if (audit.displayValue) {
    score = audit.displayValue;
  } else if (audit.scoreDisplayMode) {
    score = audit.score === 1 ? '✅ Pass' : '❌ Fail'; 
  }
  return score;
};

const LighthouseCard = (props: { lighthouse: any }): JSX.Element => {
  const categories = props.lighthouse?.categories || {};
  const audits = props.lighthouse?.audits || [];

  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>Performance</Heading>
      { Object.keys(categories).map((title: string, index: number) => {
        const scoreIds = categories[title].auditRefs.map((ref: { id: string }) => ref.id);
        const scoreList = scoreIds.map((id: string) => {
          return { lbl: audits[id].title, val: makeValue(audits[id]), title: audits[id].description, key: id }
        })
        return (
          <ExpandableRow
            key={`lighthouse-${index}`}
            lbl={title}
            val={processScore(categories[title].score)}
            rowList={scoreList}
          />
        );
      }) }
    </Outer>
  );
}

export default LighthouseCard;
