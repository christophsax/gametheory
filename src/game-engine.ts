import { Strategy, PayoffMatrix, RoundResult, GameResult, TournamentResult } from './types';

export class GameEngine {
  private payoffMatrix: PayoffMatrix;

  constructor(payoffMatrix: PayoffMatrix) {
    this.payoffMatrix = payoffMatrix;
  }

  setPayoffMatrix(matrix: PayoffMatrix): void {
    this.payoffMatrix = matrix;
  }

  getPayoff(player1Action: 'cooperate' | 'defect', player2Action: 'cooperate' | 'defect'): [number, number] {
    if (player1Action === 'cooperate' && player2Action === 'cooperate') {
      return this.payoffMatrix.both_cooperate;
    } else if (player1Action === 'cooperate' && player2Action === 'defect') {
      return this.payoffMatrix.cooperate_defect;
    } else if (player1Action === 'defect' && player2Action === 'cooperate') {
      return this.payoffMatrix.defect_cooperate;
    } else {
      return this.payoffMatrix.both_defect;
    }
  }

  playGame(strategy1: Strategy, strategy2: Strategy, numRounds: number): GameResult {
    const rounds: RoundResult[] = [];
    let player1TotalScore = 0;
    let player2TotalScore = 0;

    for (let i = 0; i < numRounds; i++) {
      const player1Action = strategy1.decide(rounds, 1);
      const player2Action = strategy2.decide(rounds, 2);

      const [player1Payoff, player2Payoff] = this.getPayoff(player1Action, player2Action);

      player1TotalScore += player1Payoff;
      player2TotalScore += player2Payoff;

      rounds.push({
        round: i + 1,
        player1Action,
        player2Action,
        player1Payoff,
        player2Payoff,
        player1TotalScore,
        player2TotalScore
      });
    }

    return {
      rounds,
      player1FinalScore: player1TotalScore,
      player2FinalScore: player2TotalScore,
      player1Strategy: strategy1.name,
      player2Strategy: strategy2.name
    };
  }

  runTournament(strategies: Strategy[], roundsPerMatch: number): TournamentResult[] {
    const results: TournamentResult[] = [];

    // Each strategy plays against every other strategy
    for (let i = 0; i < strategies.length; i++) {
      for (let j = i + 1; j < strategies.length; j++) {
        const game = this.playGame(strategies[i], strategies[j], roundsPerMatch);

        results.push({
          strategy1: strategies[i].name,
          strategy2: strategies[j].name,
          strategy1Score: game.player1FinalScore,
          strategy2Score: game.player2FinalScore,
          rounds: roundsPerMatch
        });
      }
    }

    return results;
  }

  calculateTournamentStandings(results: TournamentResult[]): Map<string, number> {
    const standings = new Map<string, number>();

    for (const result of results) {
      standings.set(result.strategy1, (standings.get(result.strategy1) || 0) + result.strategy1Score);
      standings.set(result.strategy2, (standings.get(result.strategy2) || 0) + result.strategy2Score);
    }

    return standings;
  }
}
