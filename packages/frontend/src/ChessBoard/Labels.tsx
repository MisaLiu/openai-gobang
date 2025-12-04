import { memo, useMemo } from 'preact/compat';
import { ChessBoardLabelsRow } from '../const';

interface ChessLabelProps {
  label: string;
};

const ChessLabel = memo(({
  label
}: ChessLabelProps) => {
  return (
    <span
      class="label"
      data-label={label}
    />
  );
});

interface ChessLabelsProps {
  size: number;
};

const ChessLabels = ({
  size
}: ChessLabelsProps) => {
  const sizeArr = useMemo(() => Array.from({ length: size }, (_, i) => i), [ size ]);

  return (
    <>
      <div class="labels row">
        {sizeArr.map((i) => (
          <ChessLabel
            label={ChessBoardLabelsRow[i]}
            key={`chess-label-row-${ChessBoardLabelsRow[i]}`}
          />
        ))}
      </div>
      <div class="labels column">
        {sizeArr.map((i) => (
          <ChessLabel
            label={`${i + 1}`}
            key={`chess-label-column-${i + 1}`}
          />
        ))}
      </div>
    </>
  );
};

export default memo(ChessLabels);
