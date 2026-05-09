import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import styled from '@emotion/styled';

interface Props {
  minColWidth: number;
  gap?: number;
  className?: string;
  children: ReactNode;
}

const Grid = styled.div<{ gap: number }>`
  display: flex;
  gap: ${(props) => props.gap}px;
`;

const Column = styled.div<{ gap: number }>`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap}px;
`;

// Round-robin distribution so we keep each item's column position stable as new items append
const ResultsMasonryGrid = ({ minColWidth, gap = 16, className, children }: Props): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateColumnCount = () => {
      const width = container.clientWidth;
      if (!width) return;
      setColumnCount(Math.max(1, Math.floor((width + gap) / (minColWidth + gap))));
    };
    updateColumnCount();
    const observer = new ResizeObserver(updateColumnCount);
    observer.observe(container);
    return () => observer.disconnect();
  }, [minColWidth, gap]);

  const items = Children.toArray(children);
  const columns: ReactNode[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => columns[index % columnCount].push(item));

  return (
    <Grid ref={containerRef} className={className} gap={gap}>
      {columns.map((column, index) => (
        <Column key={index} gap={gap}>
          {column}
        </Column>
      ))}
    </Grid>
  );
};

export default ResultsMasonryGrid;
