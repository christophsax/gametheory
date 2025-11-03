import { GameEngine } from './game-engine';
import { ALL_STRATEGIES } from './strategies';
import { SCENARIOS, Scenario } from './scenarios';
import { GameResult, TournamentResult } from './types';
import { createChart } from './visualization';

export class UI {
  private engine: GameEngine;
  private currentScenario: Scenario;
  private chart: any = null;

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
      </div>

      <div class="controls">
        <div class="control-group">
          <label for="scenario">Scenario</label>
          <select id="scenario">
            ${SCENARIOS.map((s, i) => `
              <option value="${i}">${s.name}</option>
            `).join('')}
          </select>
          <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);" id="scenario-description">
            ${this.currentScenario.description}
          </p>
        </div>

        <div class="control-group">
          <label for="strategy1">Player 1 Strategy</label>
          <select id="strategy1">
            ${ALL_STRATEGIES.map((s, i) => `
              <option value="${i}" ${i === 0 ? 'selected' : ''}>${s.name}</option>
            `).join('')}
          </select>
          <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);" id="strategy1-description">
            ${ALL_STRATEGIES[0].description}
          </p>
        </div>

        <div class="control-group">
          <label for="strategy2">Player 2 Strategy</label>
          <select id="strategy2">
            ${ALL_STRATEGIES.map((s, i) => `
              <option value="${i}" ${i === 1 ? 'selected' : ''}>${s.name}</option>
            `).join('')}
          </select>
          <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);" id="strategy2-description">
            ${ALL_STRATEGIES[1].description}
          </p>
        </div>

        <div class="control-group">
          <label for="rounds">Number of Rounds</label>
          <input type="number" id="rounds" value="20" min="1" max="200">
        </div>

        <div class="button-group">
          <button class="primary" id="play-game">Play Game</button>
          <button class="primary" id="run-tournament">Run Tournament</button>
          <button class="secondary" id="export-data">Export Data</button>
        </div>
      </div>

      <div id="results-container"></div>
      <div id="visualization-container"></div>
      <div id="tournament-container"></div>
    `;
  }

  private attachEventListeners(): void {
    // Scenario change
    document.getElementById('scenario')!.addEventListener('change', (e) => {
      const index = parseInt((e.target as HTMLSelectElement).value);
      this.currentScenario = SCENARIOS[index];
      this.engine.setPayoffMatrix(this.currentScenario.payoffMatrix);
      document.getElementById('scenario-description')!.textContent = this.currentScenario.description;
    });

    // Strategy descriptions
    document.getElementById('strategy1')!.addEventListener('change', (e) => {
      const index = parseInt((e.target as HTMLSelectElement).value);
      document.getElementById('strategy1-description')!.textContent = ALL_STRATEGIES[index].description;
    });

    document.getElementById('strategy2')!.addEventListener('change', (e) => {
      const index = parseInt((e.target as HTMLSelectElement).value);
      document.getElementById('strategy2-description')!.textContent = ALL_STRATEGIES[index].description;
    });

    // Play game button
    document.getElementById('play-game')!.addEventListener('click', () => {
      this.playGame();
    });

    // Run tournament button
    document.getElementById('run-tournament')!.addEventListener('click', () => {
      this.runTournament();
    });

    // Export data button
    document.getElementById('export-data')!.addEventListener('click', () => {
      this.exportData();
    });
  }

  private playGame(): void {
    const strategy1Index = parseInt((document.getElementById('strategy1') as HTMLSelectElement).value);
    const strategy2Index = parseInt((document.getElementById('strategy2') as HTMLSelectElement).value);
    const rounds = parseInt((document.getElementById('rounds') as HTMLInputElement).value);

    const result = this.engine.playGame(
      ALL_STRATEGIES[strategy1Index],
      ALL_STRATEGIES[strategy2Index],
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
      const strategy1Index = parseInt((document.getElementById('strategy1') as HTMLSelectElement).value);
      const strategy2Index = parseInt((document.getElementById('strategy2') as HTMLSelectElement).value);
      const rounds = parseInt((document.getElementById('rounds') as HTMLInputElement).value);

      const result = this.engine.playGame(
        ALL_STRATEGIES[strategy1Index],
        ALL_STRATEGIES[strategy2Index],
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
