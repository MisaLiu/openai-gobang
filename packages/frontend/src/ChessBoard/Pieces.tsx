import { useState, useRef } from 'preact/compat';
import { memo } from 'preact/compat';
import type { ChessPiece, Point } from '../types';

const calcPiecePosition = (
  boardSize: number,
  pointer: PointerEvent,
  container: HTMLDivElement
): Point => ({
  x: Math.round((boardSize - 1) * (pointer.offsetX / container.clientWidth)),
  y: Math.round((boardSize - 1) * (pointer.offsetY / container.clientHeight)),
});

interface ChessPieceProps extends ChessPiece {
  isPointer?: boolean;
};

const ChessPiece = memo(({
  type,
  row,
  column,
  isPointer = false
}: ChessPieceProps) => {
  return (
    <div
      class={`piece ${type} ${isPointer ? 'pointing' : ''}`}
      style={{
        '--pos-row': row,
        '--pos-column': column,
      }}
    ></div>
  );
});

interface ChessPieces {
  size: number;
  pieces: ChessPiece[],
  onPlace: (piece: ChessPiece) => void;
  allowPlace?: boolean;
  placeType?: 'black' | 'white';
}

const ChessPieces = ({
  size,
  pieces,
  onPlace,
  allowPlace = true,
  placeType = 'black',
}: ChessPieces) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ pointerPiecePosX, setPointerPiecePosX ] = useState(-1);
  const [ pointerPiecePosY, setPointerPiecePosY ] = useState(-1);

  const handleMouseMove = (e: PointerEvent) => {
    if (!allowPlace) return;

    const containerDom = containerRef.current;
    if (!containerDom) return;

    const { x, y } = calcPiecePosition(size, e, containerDom);

    setPointerPiecePosX(x);
    setPointerPiecePosY(y);
  };

  const handleMouseDown = (e: PointerEvent) => {
    if (!allowPlace) return;

    const containerDom = containerRef.current;
    if (!containerDom) return;

    const point = calcPiecePosition(size, e, containerDom);

    const existedPiece = pieces.findIndex(e => e.row === point.x && e.column === point.y);
    if (existedPiece !== -1) return;

    onPlace({
      type: placeType,
      row: point.x,
      column: point.y,
    });

    handleMouseLeave();
  };

  const handleMouseLeave = () => {
    setPointerPiecePosX(-1);
    setPointerPiecePosY(-1);
  };

  return (
    <div
      class="pieces"
      onPointerMove={handleMouseMove}
      onPointerDown={handleMouseDown}
      onPointerLeave={handleMouseLeave}
      ref={containerRef}
    >
      {pieces.map((e) => (
        <ChessPiece
          type={e.type}
          row={e.row}
          column={e.column}
          isPointer={false}
          key={`chess-piece-${e.type}-${e.row}-${e.column}`}
        />
      ))}
      {(pointerPiecePosX != -1 && pointerPiecePosY != -1) && (
        <ChessPiece
          type={placeType}
          row={pointerPiecePosX}
          column={pointerPiecePosY}
          isPointer
        />
      )}
    </div>
  )
};

export default ChessPieces;
