import { Strategy, RoundResult } from './types';

// Always Cooperate
export const alwaysCooperate: Strategy = {
  name: 'Always Cooperate',
  description: 'Always chooses to cooperate (free trade)',
  decide: () => 'cooperate'
};

// Always Defect
export const alwaysDefect: Strategy = {
  name: 'Always Defect',
  description: 'Always imposes tariffs (protectionism)',
  decide: () => 'defect'
};

// Tit for Tat - The classic Axelrod winner
export const titForTat: Strategy = {
  name: 'Tit for Tat',
  description: 'Start with cooperation, then copy opponent\'s last move',
  decide: (history: RoundResult[], playerIndex: 1 | 2) => {
    if (history.length === 0) return 'cooperate';
    const lastRound = history[history.length - 1];
    const opponentAction = playerIndex === 1 ? lastRound.player2Action : lastRound.player1Action;
    return opponentAction;
  }
};

// Grim Trigger
export const grimTrigger: Strategy = {
  name: 'Grim Trigger',
  description: 'Cooperate until opponent defects once, then defect forever',
  decide: (history: RoundResult[], playerIndex: 1 | 2) => {
    for (const round of history) {
      const opponentAction = playerIndex === 1 ? round.player2Action : round.player1Action;
      if (opponentAction === 'defect') {
        return 'defect';
      }
    }
    return 'cooperate';
  }
};

// Pavlov (Win-Stay, Lose-Shift)
export const pavlov: Strategy = {
  name: 'Pavlov',
  description: 'If last round was good, repeat; if bad, switch',
  decide: (history: RoundResult[], playerIndex: 1 | 2) => {
    if (history.length === 0) return 'cooperate';

    const lastRound = history[history.length - 1];
    const myAction = playerIndex === 1 ? lastRound.player1Action : lastRound.player2Action;
    const opponentAction = playerIndex === 1 ? lastRound.player2Action : lastRound.player1Action;

    // Win-stay: if both cooperated or both defected, repeat
    if ((myAction === 'cooperate' && opponentAction === 'cooperate') ||
        (myAction === 'defect' && opponentAction === 'defect')) {
      return myAction;
    }

    // Lose-shift: switch action
    return myAction === 'cooperate' ? 'defect' : 'cooperate';
  }
};

// Generous Tit for Tat
export const generousTitForTat: Strategy = {
  name: 'Generous Tit for Tat',
  description: 'Like Tit for Tat, but sometimes forgives defection (30% chance)',
  decide: (history: RoundResult[], playerIndex: 1 | 2) => {
    if (history.length === 0) return 'cooperate';

    const lastRound = history[history.length - 1];
    const opponentAction = playerIndex === 1 ? lastRound.player2Action : lastRound.player1Action;

    if (opponentAction === 'defect' && Math.random() < 0.3) {
      return 'cooperate'; // Forgive
    }

    return opponentAction;
  }
};

// Random
export const random: Strategy = {
  name: 'Random',
  description: 'Randomly cooperate or defect (50/50)',
  decide: () => Math.random() < 0.5 ? 'cooperate' : 'defect'
};

// Export all strategies
export const ALL_STRATEGIES: Strategy[] = [
  titForTat,
  alwaysCooperate,
  alwaysDefect,
  grimTrigger,
  pavlov,
  generousTitForTat,
  random
];
