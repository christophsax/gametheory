import { GameEngine } from './game-engine';
import { ALL_STRATEGIES } from './strategies';
import { SCENARIOS, Scenario } from './scenarios';
import { GameResult, TournamentResult } from './types';
import { createChart } from './visualization';
import { PayoffMatrixEditor } from './payoff-matrix-editor';
import { CardSelector, CardOption } from './card-selector';
import { sounds } from './sounds';

export class UI {
  private engine: GameEngine;
  private currentScenario: Scenario;
  private chart: any = null;
  private matrixEditor: PayoffMatrixEditor | null = null;
  private scenarioSelector: CardSelector | null = null;
  private strategy1Selector: CardSelector | null = null;
  private strategy2Selector: CardSelector | null = null;
  private selectedStrategy1Index: number = 0;
  private selectedStrategy2Index: number = 1;

  constructor() {
    this.currentScenario = SCENARIOS[0]; // Default to Tariff War
    this.engine = new GameEngine(this.currentScenario.payoffMatrix);
  }

  init(): void {
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    const app = document.getElementById('app')!;

    app.innerHTML = `
      <div class="header">
        <h1>Tariff Wars: A Game Theory Simulation</h1>
        <p>Explore the prisoner's dilemma in trade policy and see why cooperation beats protectionism</p>
        <button class="sound-toggle" id="sound-toggle" title="Toggle sound effects">
          🔊 Sound ON
        </button>
      </div>

      <div class="controls">
        <div id="scenario-selector"></div>
        <div id="strategy1-selector"></div>
        <div id="strategy2-selector"></div>

        <div class="control-group">
          <label for="rounds">Number of Rounds</label>
          <input type="number" id="rounds" value="20" min="1" max="200">
        </div>

        <div class="button-group">
          <button class="primary" id="play-game">Play Game</button>
          <button class="primary" id="run-tournament">Run Tournament</button>
          <button class="secondary" id="toggle-matrix">⚙️ Customize Payoffs</button>
          <button class="secondary" id="export-data">Export Data</button>
        </div>
      </div>

      <div id="matrix-container" style="display: none;"></div>
      <div id="results-container"></div>
      <div id="visualization-container"></div>
      <div id="tournament-container"></div>
    `;

    // Initialize scenario selector
    const scenarioOptions: CardOption[] = SCENARIOS.map(s => ({
      id: s.id,
      title: s.name,
      description: s.description,
      icon: s.icon
    }));

    this.scenarioSelector = new CardSelector(
      document.getElementById('scenario-selector')!,
      'Choose Scenario',
      scenarioOptions,
      this.currentScenario.id,
      (_id, index) => {
        this.currentScenario = SCENARIOS[index];
        this.engine.setPayoffMatrix(this.currentScenario.payoffMatrix);

        // Update matrix editor
        if (this.matrixEditor) {
          const container = document.getElementById('matrix-container')!;
          this.matrixEditor = new PayoffMatrixEditor(
            container,
            this.currentScenario.payoffMatrix,
            (matrix) => {
              this.engine.setPayoffMatrix(matrix);
            }
          );
          if (container.style.display !== 'none') {
            this.matrixEditor.render();
          }
        }
      }
    );
    this.scenarioSelector.render();

    // Initialize strategy selectors
    const strategyOptions: CardOption[] = ALL_STRATEGIES.map(s => ({
      id: s.id,
      title: s.name,
      description: s.description,
      icon: s.icon
    }));

    this.strategy1Selector = new CardSelector(
      document.getElementById('strategy1-selector')!,
      'Player 1 Strategy',
      strategyOptions,
      ALL_STRATEGIES[0].id,
      (_id, index) => {
        this.selectedStrategy1Index = index;
      }
    );
    this.strategy1Selector.render();

    this.strategy2Selector = new CardSelector(
      document.getElementById('strategy2-selector')!,
      'Player 2 Strategy',
      strategyOptions,
      ALL_STRATEGIES[1].id,
      (_id, index) => {
        this.selectedStrategy2Index = index;
      }
    );
    this.strategy2Selector.render();

    // Initialize matrix editor
    const matrixContainer = document.getElementById('matrix-container')!;
    this.matrixEditor = new PayoffMatrixEditor(
      matrixContainer,
      this.currentScenario.payoffMatrix,
      (matrix) => {
        this.engine.setPayoffMatrix(matrix);
      }
    );
    this.matrixEditor.render();
  }

  private attachEventListeners(): void {
    // Sound toggle
    document.getElementById('sound-toggle')!.addEventListener('click', () => {
      const button = document.getElementById('sound-toggle')!;
      const isEnabled = sounds.isEnabled();
      sounds.setEnabled(!isEnabled);

      if (!isEnabled) {
        button.textContent = '🔊 Sound ON';
        sounds.playJump(); // Test sound
      } else {
        button.textContent = '🔇 Sound OFF';
      }
    });

    // Event listeners for card selectors are handled in CardSelector class

    // Toggle matrix editor
    document.getElementById('toggle-matrix')!.addEventListener('click', () => {
      sounds.playJump();
      const container = document.getElementById('matrix-container')!;
      const button = document.getElementById('toggle-matrix')! as HTMLButtonElement;

      if (container.style.display === 'none') {
        container.style.display = 'block';
        button.textContent = '⚙️ Hide Payoffs';
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        container.style.display = 'none';
        button.textContent = '⚙️ Customize Payoffs';
      }
    });

    // Play game button
    document.getElementById('play-game')!.addEventListener('click', () => {
      sounds.playPowerUp();
      this.playGame();
    });

    // Run tournament button
    document.getElementById('run-tournament')!.addEventListener('click', () => {
      sounds.playStar();
      this.runTournament();
    });

    // Export data button
    document.getElementById('export-data')!.addEventListener('click', () => {
      sounds.playCoin();
      this.exportData();
    });
  }

  private playGame(): void {
    const rounds = parseInt((document.getElementById('rounds') as HTMLInputElement).value);

    const result = this.engine.playGame(
      ALL_STRATEGIES[this.selectedStrategy1Index],
      ALL_STRATEGIES[this.selectedStrategy2Index],
      rounds
    );

    this.displayGameResults(result);
    this.displayVisualization(result);

    // Clear tournament results
    document.getElementById('tournament-container')!.innerHTML = '';
  }

  private displayGameResults(result: GameResult): void {
    const container = document.getElementById('results-container')!;

    const winner = result.player1FinalScore > result.player2FinalScore
      ? result.player1Strategy
      : result.player2FinalScore > result.player1FinalScore
      ? result.player2Strategy
      : 'Tie';

    container.innerHTML = `
      <div class="results">
        <h2>Game Results</h2>

        <div class="score-display">
          <div class="score-card">
            <h3>${result.player1Strategy}</h3>
            <div class="score">${result.player1FinalScore}</div>
          </div>
          <div class="score-card">
            <h3>${result.player2Strategy}</h3>
            <div class="score">${result.player2FinalScore}</div>
          </div>
          <div class="score-card">
            <h3>Winner</h3>
            <div class="score" style="font-size: 1.5rem;">${winner}</div>
          </div>
        </div>

        <div class="rounds-table">
          <table>
            <thead>
              <tr>
                <th>Round</th>
                <th>${result.player1Strategy}</th>
                <th>${result.player2Strategy}</th>
                <th>Payoffs</th>
                <th>Total Scores</th>
              </tr>
            </thead>
            <tbody>
              ${result.rounds.map(round => `
                <tr>
                  <td>${round.round}</td>
                  <td class="action-${round.player1Action}">${this.formatAction(round.player1Action)}</td>
                  <td class="action-${round.player2Action}">${this.formatAction(round.player2Action)}</td>
                  <td>${round.player1Payoff}, ${round.player2Payoff}</td>
                  <td>${round.player1TotalScore}, ${round.player2TotalScore}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private formatAction(action: 'cooperate' | 'defect'): string {
    if (action === 'cooperate') {
      return this.currentScenario.cooperateLabel;
    } else {
      return this.currentScenario.defectLabel;
    }
  }

  private displayVisualization(result: GameResult): void {
    const container = document.getElementById('visualization-container')!;

    container.innerHTML = `
      <div class="visualization">
        <h2>Score Evolution</h2>
        <div id="chart-container">
          <canvas id="myChart"></canvas>
        </div>
      </div>
    `;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = createChart('myChart', result);
  }

  private runTournament(): void {
    const rounds = parseInt((document.getElementById('rounds') as HTMLInputElement).value);

    const results = this.engine.runTournament(ALL_STRATEGIES, rounds);
    const standings = this.engine.calculateTournamentStandings(results);

    // Sort by score
    const sortedStandings = Array.from(standings.entries())
      .sort((a, b) => b[1] - a[1]);

    this.displayTournamentResults(sortedStandings, results);

    // Clear game results
    document.getElementById('results-container')!.innerHTML = '';
    document.getElementById('visualization-container')!.innerHTML = '';
  }

  private displayTournamentResults(
    standings: [string, number][],
    results: TournamentResult[]
  ): void {
    const container = document.getElementById('tournament-container')!;

    container.innerHTML = `
      <div class="tournament-results">
        <h2>Tournament Results</h2>
        <p style="margin-bottom: 1rem; color: var(--text-secondary);">
          Each strategy played against every other strategy.
        </p>

        <div class="tournament-standings">
          ${standings.map(([name, score], index) => `
            <div class="standing-item">
              <span class="standing-rank">#${index + 1}</span>
              <span class="standing-name">${name}</span>
              <span class="standing-score">${score}</span>
            </div>
          `).join('')}
        </div>

        <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Detailed Match Results</h3>
        <div class="rounds-table">
          <table>
            <thead>
              <tr>
                <th>Strategy 1</th>
                <th>Strategy 2</th>
                <th>Score 1</th>
                <th>Score 2</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              ${results.map(result => {
                const winner = result.strategy1Score > result.strategy2Score
                  ? result.strategy1
                  : result.strategy2Score > result.strategy1Score
                  ? result.strategy2
                  : 'Tie';

                return `
                  <tr>
                    <td>${result.strategy1}</td>
                    <td>${result.strategy2}</td>
                    <td>${result.strategy1Score}</td>
                    <td>${result.strategy2Score}</td>
                    <td style="font-weight: 600;">${winner}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private exportData(): void {
    // Get current game results or tournament results
    const resultsContainer = document.getElementById('results-container')!;
    const tournamentContainer = document.getElementById('tournament-container')!;

    let data: any = {
      scenario: this.currentScenario.name,
      timestamp: new Date().toISOString()
    };

    if (resultsContainer.innerHTML) {
      // Export game results
      const rounds = parseInt((document.getElementById('rounds') as HTMLInputElement).value);

      const result = this.engine.playGame(
        ALL_STRATEGIES[this.selectedStrategy1Index],
        ALL_STRATEGIES[this.selectedStrategy2Index],
        rounds
      );

      data.type = 'game';
      data.results = result;
    } else if (tournamentContainer.innerHTML) {
      // Export tournament results
      const rounds = parseInt((document.getElementById('rounds') as HTMLInputElement).value);
      const results = this.engine.runTournament(ALL_STRATEGIES, rounds);
      const standings = this.engine.calculateTournamentStandings(results);

      data.type = 'tournament';
      data.results = results;
      data.standings = Object.fromEntries(standings);
    } else {
      alert('No results to export. Please run a game or tournament first.');
      return;
    }

    // Download as JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gametheory-${data.type}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
