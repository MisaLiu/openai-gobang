
const StarPointPosition = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'center'
];

const ChessBoardGrid = () => {
  return (
    <div class="chessboard-grid">
      {StarPointPosition.map((pos) => (
        <div
          class={`star-point ${pos}`}
          key={`chess-block-start-point-${pos}`}
        ></div>
      ))}
    </div>
  )
};

export default ChessBoardGrid;
