import { memo } from 'preact/compat';
import { ChessBoardLabelsRow } from '../const';

interface ChessLabelRowProps {
  size: number;
};

const ChessLabelRow = ({
  size
}: ChessLabelRowProps) => {
  return (
    <div class="labels-row">
      {new Array(size).fill(0).map((_, index) => {
        const label = ChessBoardLabelsRow[index];

        return (
          <span
            class="label-row"
            key={`chess-label-row-${label}`}
          >{label}</span>
        );
      })}
      <span class="lael-row"></span>
    </div>
  );
};

export default memo(ChessLabelRow);
