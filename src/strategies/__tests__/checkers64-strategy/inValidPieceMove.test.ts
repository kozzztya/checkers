import { Checkers64Strategy } from '../../checkers64-strategy';
import { createBoard } from '../../../common/test-utils/board';
import { Color, GameState, Position } from '../../../common/types';

describe('isValidPieceCapture', () => {
  describe('a regular piece', () => {
    it('should return true for a valid moves', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ];
      const boardState = createBoard(board);

      const from: Position = [1, 1];
      const destinations: Position[] = [
        [0, 0],
        [0, 2],
      ];

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: from,
      };

      destinations.forEach((to) => {
        expect(strategy.isValidMove(from, to, gameState)).toBe(true);
      });
    });

    it('should return false for a invalid moves', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ];
      const boardState = createBoard(board);

      const from: Position = [1, 1];
      const destinations: Position[] = [
        [0, 1],
        [1, 0],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
      ];

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: from,
      };

      destinations.forEach((to) => {
        expect(strategy.isValidMove(from, to, gameState)).toBe(false);
      });
    });

    it('should return false for an invalid moves by black piece', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 0],
      ];
      const boardState = createBoard(board);

      const from: Position = [1, 1];
      const destinations: Position[] = [
        [0, 1],
        [1, 0],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
      ];

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: from,
      };

      destinations.forEach((to) => {
        expect(strategy.isValidMove(from, to, gameState)).toBe(false);
      });
    });

    it('should return false for a move to not empty square', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 1],
        [0, 1, 0],
        [0, 0, 0],
      ];
      const boardState = createBoard(board);

      const from: Position = [1, 1];
      const to: Position = [0, 2];

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: from,
      };

      expect(strategy.isValidMove(from, to, gameState)).toBe(false);
    });

    it('should return false for a move over the board', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 1],
      ];
      const boardState = createBoard(board);

      const from: Position = [2, 2];
      const to: Position = [1, 3];

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: from,
      };

      expect(strategy.isValidMove(from, to, gameState)).toBe(false);
    });

    it('should return false for a move by empty square', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      const boardState = createBoard(board);

      const from: Position = [1, 1];
      const to: Position = [0, 0];

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: from,
      };

      expect(strategy.isValidMove(from, to, gameState)).toBe(false);
    });

    it('should return false for a move by a piece of other player', () => {
      const strategy = new Checkers64Strategy();

      const board = [
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 0],
      ];
      const boardState = createBoard(board);

      const from: Position = [1, 1];
      const to: Position = [2, 2];

      const gameState: GameState = {
        boardState,
        currentPlayer: Color.White,
        hasMadeCapture: false,
        selectedPiece: from,
      };

      expect(strategy.isValidMove(from, to, gameState)).toBe(false);
    });
  });
});
