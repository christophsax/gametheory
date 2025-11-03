import { Strategy, RoundResult } from './types';

// Tit for Tat - The classic Axelrod winner
export const titForTat: Strategy = {
  id: 'tit-for-tat',
  name: 'Tit for Tat',
  description: 'Start with cooperation, then copy opponent\'s last move. Axelrod\'s tournament winner!',
  icon: '🤝',
  decide: (history: RoundResult[], playerIndex: 1 | 2) => {
    if (history.length === 0) return 'cooperate';
    const lastRound = history[history.length - 1];
    const opponentAction = playerIndex === 1 ? lastRound.player2Action : lastRound.player1Action;
    return opponentAction;
  }
};

// Always Cooperate
export const alwaysCooperate: Strategy = {
  id: 'always-cooperate',
  name: 'Always Cooperate',
  description: 'Pure altruism: always choose free trade. Gets exploited but promotes cooperation.',
  icon: '😇',
  decide: () => 'cooperate'
};

// Always Defect
export const alwaysDefect: Strategy = {
  id: 'always-defect',
  name: 'Always Defect',
  description: 'Pure selfishness: always impose tariffs. Short-term gains but fails in repeated games.',
  icon: '😈',
  decide: () => 'defect'
};

// Grim Trigger
export const grimTrigger: Strategy = {
  id: 'grim-trigger',
  name: 'Grim Trigger',
  description: 'Cooperate until opponent defects once, then defect forever. Unforgiving.',
  icon: '😠',
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
  id: 'pavlov',
  name: 'Pavlov',
  description: 'Win-stay, lose-shift: repeat if successful, switch if not. Adapts to outcomes.',
  icon: '🧠',
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
  id: 'generous-tit-for-tat',
  name: 'Generous Tit for Tat',
  description: 'Like Tit for Tat but sometimes forgives defection (30% chance). More robust.',
  icon: '🤗',
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
  id: 'random',
  name: 'Random',
  description: 'Unpredictable: randomly cooperate or defect (50/50). Baseline for comparison.',
  icon: '🎲',
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
