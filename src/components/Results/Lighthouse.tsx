
import styled from 'styled-components';

import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import { ExpandableRow } from 'components/Form/Row';

const processScore = (percentile: number) => {
  return `${Math.round(percentile * 100)}%`;
}

const Outer = styled(Card)``;

interface Audit {
  id: string,
  score?: number | string,
  scoreDisplayMode?: string,
  title?: string,
  description?: string,
  displayValue?: string,
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

const LighthouseCard = (lighthouse: any): JSX.Element => {
  const categories = lighthouse?.categories || {};
  const audits = lighthouse?.audits || [];

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
