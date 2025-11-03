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
  id: string;
  name: string;
  description: string;
  icon: string;
  cooperateLabel: string;
  defectLabel: string;
  payoffMatrix: PayoffMatrix;
  realWorld?: boolean;
  countries?: [string, string];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'tariff-war',
    name: 'Tariff War',
    description: 'Trade war where tariffs hurt both countries. Shows the self-destructive nature of protectionism.',
    icon: '🏭',
    cooperateLabel: 'Free Trade',
    defectLabel: 'Impose Tariffs',
    payoffMatrix: tariffWarScenario
  },
  {
    id: 'prisoners-dilemma',
    name: 'Classic Prisoner\'s Dilemma',
    description: 'The original scenario that started it all.',
    icon: '⚖️',
    cooperateLabel: 'Stay Silent',
    defectLabel: 'Betray',
    payoffMatrix: classicPrisonersDilemma
  },
  {
    id: 'climate',
    name: 'Climate Cooperation',
    description: 'Countries deciding whether to reduce emissions or free-ride.',
    icon: '🌍',
    cooperateLabel: 'Reduce Emissions',
    defectLabel: 'Pollute',
    payoffMatrix: climateScenario
  },
  {
    id: 'usa-china',
    name: 'USA 🇺🇸 vs China 🇨🇳',
    description: '2025 trade war: tariffs on imports creating lose-lose outcome for both economies.',
    icon: '🇺🇸🇨🇳',
    cooperateLabel: 'Free Trade',
    defectLabel: 'Impose Tariffs',
    payoffMatrix: tariffWarScenario,
    realWorld: true,
    countries: ['USA', 'China']
  },
  {
    id: 'usa-switzerland',
    name: 'USA 🇺🇸 vs Switzerland 🇨🇭',
    description: 'Small neutral country facing US tariff threats. Should Switzerland retaliate or stay cooperative?',
    icon: '🇺🇸🇨🇭',
    cooperateLabel: 'Free Trade',
    defectLabel: 'Impose Tariffs',
    payoffMatrix: {
      both_cooperate: [3, 3],
      cooperate_defect: [0, 2],  // Switzerland hurt more by US tariffs
      defect_cooperate: [2, 0],  // US less affected by Swiss tariffs
      both_defect: [1, 0.5]      // Switzerland suffers more in trade war
    },
    realWorld: true,
    countries: ['USA', 'Switzerland']
  }
];
