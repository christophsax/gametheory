import { PayoffMatrix } from './types';

// Tariff War Scenario - Both countries hurt themselves with tariffs
// Cooperate = Free Trade, Defect = Impose Tariffs
export const tariffWarScenario: PayoffMatrix = {
  // Both choose free trade - optimal outcome
  both_cooperate: [3, 3],

  // I cooperate (free trade), they defect (tariffs)
  // I get flooded with their goods, can't export - worst outcome for me
  cooperate_defect: [0, 4],

  // I defect (tariffs), they cooperate (free trade)
  // I protect my market, access theirs - best outcome for me
  defect_cooperate: [4, 0],

  // Both impose tariffs - both shoot themselves in the foot
  // Trade war! Both economies suffer, but not as bad as being exploited
  both_defect: [1, 1]
};

// Classic Prisoner's Dilemma
export const classicPrisonersDilemma: PayoffMatrix = {
  both_cooperate: [3, 3],
  cooperate_defect: [0, 5],
  defect_cooperate: [5, 0],
  both_defect: [1, 1]
};

// Climate Cooperation Scenario
export const climateScenario: PayoffMatrix = {
  // Both reduce emissions
  both_cooperate: [4, 4],

  // I reduce, they don't - I pay costs, they free-ride
  cooperate_defect: [0, 5],

  // They reduce, I don't - I free-ride
  defect_cooperate: [5, 0],

  // Neither reduces - climate disaster
  both_defect: [-2, -2]
};

export interface Scenario {
  name: string;
  description: string;
  cooperateLabel: string;
  defectLabel: string;
  payoffMatrix: PayoffMatrix;
}

export const SCENARIOS: Scenario[] = [
  {
    name: 'Tariff War',
    description: 'Trade war where tariffs hurt both countries. Shows the self-destructive nature of protectionism.',
    cooperateLabel: 'Free Trade',
    defectLabel: 'Impose Tariffs',
    payoffMatrix: tariffWarScenario
  },
  {
    name: 'Classic Prisoner\'s Dilemma',
    description: 'The original scenario that started it all.',
    cooperateLabel: 'Stay Silent',
    defectLabel: 'Betray',
    payoffMatrix: classicPrisonersDilemma
  },
  {
    name: 'Climate Cooperation',
    description: 'Countries deciding whether to reduce emissions or free-ride.',
    cooperateLabel: 'Reduce Emissions',
    defectLabel: 'Pollute',
    payoffMatrix: climateScenario
  }
];
