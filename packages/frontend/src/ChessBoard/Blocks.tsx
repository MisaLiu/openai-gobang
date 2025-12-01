import { memo } from 'preact/compat';
import { ChessBoardLabelsRow } from '../const';

interface ChessBlocksProps {
  size: number;
};

const ChessBlocks = ({
  size
}: ChessBlocksProps) => {
  return (
    <div class="blocks">
      {new Array(size - 1).fill(0).map((_, index) => (
        <div
          class="blocks-row"
          key={`chess-block-row-${index + 1}`}
        >
          {new Array(size - 1).fill(0).map((_, index) => {
            const label = ChessBoardLabelsRow[index];
            return (
              <div
                class="block"
                key={`chess-block-row-${label}${index + 1}`}
              ></div>
            )
          })}
        </div>
      ))}
    </div>
  )
};

export default memo(ChessBlocks);
