import { useState, useEffect, useRef } from 'preact/compat';
import { memo } from 'preact/compat';
import SettingsStore from '../state/settings';
import GameStore, { placePiece } from '../state/game';
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
}

const ChessPieces = ({
  size,
}: ChessPieces) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ pieces, setPieces ] = useState<ChessPiece[]>([]);
  const [ allowPlace, setAllowPlace ] = useState<boolean>(false);
  const [ placeType, setPlaceType ] = useState<'black' | 'white'>('black');
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

    placePiece({
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

  const updateAllowPlace = () => {
    const { isStarted, allowPlace } = GameStore.getState();
    setAllowPlace(isStarted && allowPlace);
  };

  useEffect(() => {
    const unsubGame = GameStore.subscribe((s, p) => {
      if (s.pieces !== p.pieces) setPieces(s.pieces);
      if (s.isStarted !== p.isStarted) updateAllowPlace();
      if (s.allowPlace !== p.allowPlace) updateAllowPlace();
    });

    const unsubSettings = SettingsStore.subscribe((s, p) => {
      if (s.llmFirst !== p.llmFirst) setPlaceType(s.llmFirst ? 'white' : 'black');
    });

    return (() => {
      unsubGame();
      unsubSettings();
    });
  }, []);

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
