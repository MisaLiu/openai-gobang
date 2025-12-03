
const StarPointPosition = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'center'
];

const ChessStarPoint = () => {
  return (
    <div class="star-points">
      {StarPointPosition.map((pos) => (
        <div
          class={`star-point ${pos}`}
          key={`chess-block-start-point-${pos}`}
        ></div>
      ))}
    </div>
  )
};

export default ChessStarPoint;
