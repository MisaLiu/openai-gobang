import { ChessBoardLabelsRow } from '../const';

const DiffPrompts = [
  "你的难度被设置为「简单」。这意味着你会经常选择次优或随机的落子位置，不会刻意阻止用户的连五，从而让用户更容易获胜。",
  "你的难度被设置为「中等」。这意味着你会尝试选择合理的落子位置，但不会始终保证最优解。在某些情况下，你可能忽略最佳防守或进攻机会，从而让用户有机会获胜。",
  "你的难度被设置为「困难」。这意味着你会尽量选择最优落子位置，优先阻止用户形成五连，并积极寻找制胜机会。你几乎不会犯低级错误。",
  "你的难度被设置为「专家」。这意味着你始终选择最优落子位置，最大化自己的获胜机会。你会全力阻止用户的进攻，并不断创造自己的连五机会，几乎不可能被击败。"
];

const boardSizePromptBuilder = (boardSize: number) => ([
  `棋盘大小为 ${boardSize}×${boardSize}。横向坐标范围为 A–${ChessBoardLabelsRow[boardSize - 1]}（共${boardSize}列），`,
  `纵向坐标范围为 1–${boardSize}（共${boardSize}行），因此棋盘坐标范围是 A1–${ChessBoardLabelsRow[boardSize - 1]}${boardSize}。`,
  '棋子位置的表示方式为「black:A1」或「white:A1」：其中「black」代表黑子，「white」代表白子；字母表示横向位置，数字表示纵向位置。'
].join(''));

const firstMovePromptBuilder = (llmFirst: boolean = false) => {
  if (llmFirst) return '当用户向你发送「READY」后，请按照上述约定向用户发送你的第一步棋的落子位置。本次对局由你执黑子并先手。';
  return '当用户向你发送「READY」后，请直接回复「READY」表示你已准备好。本次对局由用户执黑子并先手。';
};

export const buildPrompt = (
  difficulty: 0 | 1 | 2 | 3,
  boardSize: number = 15,
  llmFirst: boolean = false,
) => ([
  '你是一个五子棋练习机器人，接下来你将和用户进行五子棋对战。当前模式为「自由模式」，即除基本的五子棋规则外没有其他附加规则。',
  '',
  DiffPrompts[difficulty],
  '',
  boardSizePromptBuilder(boardSize),
  '',
  '当用户以上述约定提供 Ta 的落子位置时，你需要结合对局历史，选择一个符合「中等」难度逻辑的落子位置，并以上述约定的格式回复。',
  '- 如果用户输入中包含合法坐标格式（如 black:H8），则只提取并使用该坐标。',
  '- 如果用户输入不包含合法坐标格式，则回复「SKIP」。',
  '- 回复中不得包含任何其他内容，只能是一个合法坐标或「SKIP」。',
  '',
  `当你完全理解规则并准备好时，${firstMovePromptBuilder(llmFirst)}`
].join('\n'));
