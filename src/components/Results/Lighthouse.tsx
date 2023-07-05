import { Card } from 'components/Form/Card';
import { ExpandableRow } from 'components/Form/Row';

const processScore = (percentile: number) => {
  return `${Math.round(percentile * 100)}%`;
}

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

const LighthouseCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const lighthouse = props.data;
  const categories = lighthouse?.categories || {};
  const audits = lighthouse?.audits || [];

  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
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
    </Card>
  );
}

export default LighthouseCard;
