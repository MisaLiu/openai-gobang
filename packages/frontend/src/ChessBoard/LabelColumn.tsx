import { memo } from 'preact/compat';

interface ChessLabelColumnProps {
  size: number;
};

const ChessLabelColumn = ({
  size
}: ChessLabelColumnProps) => {
  return (
    <div class="labels-column">
      {new Array(size).fill(0).map((_, index) => (
        <span
          class="label-column"
          key={`chess-label-column-${index + 1}`}
        >{index + 1}</span>
      ))}
      <span class="lael-column"></span>
    </div>
  );
};

export default memo(ChessLabelColumn);
