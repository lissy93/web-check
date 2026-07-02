export type Severity = 'critical' | 'issue' | 'warning' | 'info' | 'pass';

export interface Finding {
  cardId: string;
  severity: Severity;
  title: string;
  detail?: string;
}

export type Analyzer = (data: any) => Omit<Finding, 'cardId'>[];
