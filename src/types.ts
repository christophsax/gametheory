// Core types for the game theory simulation

export type Action = 'cooperate' | 'defect';

export interface PayoffMatrix {
  both_cooperate: [number, number];
  cooperate_defect: [number, number];
  defect_cooperate: [number, number];
  both_defect: [number, number];
}

export interface RoundResult {
  round: number;
  player1Action: Action;
  player2Action: Action;
  player1Payoff: number;
  player2Payoff: number;
  player1TotalScore: number;
  player2TotalScore: number;
}

export interface GameResult {
  rounds: RoundResult[];
  player1FinalScore: number;
  player2FinalScore: number;
  player1Strategy: string;
  player2Strategy: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  icon: string;
  decide: (history: RoundResult[], playerIndex: 1 | 2) => Action;
}

export interface TournamentResult {
  strategy1: string;
  strategy2: string;
  strategy1Score: number;
  strategy2Score: number;
  rounds: number;
}
