import { useState, useEffect, useRef } from 'preact/compat';
import { memo } from 'preact/compat';
import SettingsStore from '../state/settings';
import GameStore, { placePiece } from '../state/game';
import { findPiece } from '../utils';
import type { ChessPiece, Point, PlaceHistory } from '../types';

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
  index?: number;
};

const ChessPiece = memo(({
  type,
  row,
  column,
  isPointer = false,
  index = (void 0),
}: ChessPieceProps) => {
  return (
    <div
      class={`piece ${isPointer ? 'pointing' : ''}`}
      style={{
        '--pos-row': row,
        '--pos-column': column,
      }}
      data-type={type}
      data-index={index !== (void 0) && index + 1}
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
  const [ histories, setHistories ] = useState<PlaceHistory[]>(GameStore.getState().histories);
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

    const { pieces } = GameStore.getState();
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
      if (s.histories !== p.histories) setHistories(s.histories);
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
      {histories.map(({ piece, index }) => (
        <ChessPiece
          type={piece.type}
          row={piece.row}
          column={piece.column}
          isPointer={false}
          index={index}
          key={`chess-piece-${piece.type}-${piece.row}-${piece.column}`}
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
