import { useState, useEffect, useRef } from 'preact/compat';
import { memo } from 'preact/compat';
import SettingsStore from '../state/settings';
import GameStore, { placePiece } from '../state/game';
import { findPiece } from '../utils';
import type { ChessPiece, Point, PieceArray } from '../types';

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
  const { llmFirst } = SettingsStore.getState();
  const placeType = llmFirst ? 'white' : 'black';

  const containerRef = useRef<HTMLDivElement>(null);
  const [ pieces, setPieces ] = useState<PieceArray>([]);
  const [ allowPlace, setAllowPlace ] = useState<boolean>(false);
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
    if (findPiece(pieces, point.x, point.y) !== null) return;

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

    return (() => {
      unsubGame();
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
      {pieces.map((columnArr, rowId) => {
        if (!columnArr) return null;
        return columnArr.map((type, columnId) => (
          <ChessPiece
            type={type === 1 ? 'black' : 'white'}
            row={rowId}
            column={columnId}
            isPointer={false}
            key={`chess-piece-${type}-${rowId}-${columnId}`}
          />
        ));
      })}
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
