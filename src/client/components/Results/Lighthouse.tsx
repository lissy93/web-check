import { Card } from 'client/components/Form/Card';
import { ExpandableRow } from 'client/components/Form/Row';

const processScore = (percentile: number) => {
  return `${Math.round(percentile * 100)}%`;
};

interface Audit {
  id: string;
  score?: number | string;
  scoreDisplayMode?: string;
  title?: string;
  description?: string;
  displayValue?: string;
}

const makeValue = (audit: Audit) => {
  if (audit.displayValue) return audit.displayValue;
  if (audit.score == null) return 'N/A';
  if (audit.scoreDisplayMode === 'binary') return audit.score === 1 ? '✅ Pass' : '❌ Fail';
  return audit.score;
};

const LighthouseCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const lighthouse = props.data;
  const categories = lighthouse?.categories || {};
  const audits = lighthouse?.audits || [];

  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {Object.keys(categories).map((key: string, index: number) => {
        const scoreIds = categories[key].auditRefs.map((ref: { id: string }) => ref.id);
        const scoreList = scoreIds.map((id: string) => {
          return {
            lbl: audits[id].title,
            val: makeValue(audits[id]),
            title: audits[id].description,
            key: id,
          };
        });
        return (
          <ExpandableRow
            key={`lighthouse-${index}`}
            lbl={categories[key].title || key}
            val={processScore(categories[key].score)}
            rowList={scoreList}
          />
        );
      })}
    </Card>
  );
};

export default LighthouseCard;
