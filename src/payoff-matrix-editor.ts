import { PayoffMatrix } from './types';
import { sounds } from './sounds';

export class PayoffMatrixEditor {
  private container: HTMLElement;
  private matrix: PayoffMatrix;
  private onChange: (matrix: PayoffMatrix) => void;

  constructor(container: HTMLElement, initialMatrix: PayoffMatrix, onChange: (matrix: PayoffMatrix) => void) {
    this.container = container;
    this.matrix = { ...initialMatrix };
    this.onChange = onChange;
  }

  render(): void {
    this.container.innerHTML = `
      <div class="matrix-editor">
        <div class="matrix-header">
          <h3>Payoff Matrix</h3>
          <p>Adjust the payoffs for each outcome. Values represent benefits (positive) or costs (negative).</p>
        </div>

        <div class="matrix-grid">
          <div class="matrix-labels">
            <div class="corner-label"></div>
            <div class="col-label">Player 2: Cooperate</div>
            <div class="col-label">Player 2: Defect</div>
          </div>

          <div class="matrix-row">
            <div class="row-label">Player 1: Cooperate</div>
            <div class="matrix-cell cell-cooperate-cooperate">
              <div class="cell-header">Both Cooperate</div>
              <div class="cell-description">🤝 Mutual cooperation</div>
              <div class="payoff-inputs">
                <div class="payoff-input-group">
                  <label>Player 1</label>
                  <input type="range" id="cc-p1" min="-5" max="10" value="${this.matrix.both_cooperate[0]}" step="0.5">
                  <span class="value">${this.matrix.both_cooperate[0]}</span>
                </div>
                <div class="payoff-input-group">
                  <label>Player 2</label>
                  <input type="range" id="cc-p2" min="-5" max="10" value="${this.matrix.both_cooperate[1]}" step="0.5">
                  <span class="value">${this.matrix.both_cooperate[1]}</span>
                </div>
              </div>
            </div>

            <div class="matrix-cell cell-cooperate-defect">
              <div class="cell-header">Cooperate vs Defect</div>
              <div class="cell-description">😔 You cooperate, they defect</div>
              <div class="payoff-inputs">
                <div class="payoff-input-group">
                  <label>Player 1</label>
                  <input type="range" id="cd-p1" min="-5" max="10" value="${this.matrix.cooperate_defect[0]}" step="0.5">
                  <span class="value">${this.matrix.cooperate_defect[0]}</span>
                </div>
                <div class="payoff-input-group">
                  <label>Player 2</label>
                  <input type="range" id="cd-p2" min="-5" max="10" value="${this.matrix.cooperate_defect[1]}" step="0.5">
                  <span class="value">${this.matrix.cooperate_defect[1]}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="matrix-row">
            <div class="row-label">Player 1: Defect</div>
            <div class="matrix-cell cell-defect-cooperate">
              <div class="cell-header">Defect vs Cooperate</div>
              <div class="cell-description">😎 You defect, they cooperate</div>
              <div class="payoff-inputs">
                <div class="payoff-input-group">
                  <label>Player 1</label>
                  <input type="range" id="dc-p1" min="-5" max="10" value="${this.matrix.defect_cooperate[0]}" step="0.5">
                  <span class="value">${this.matrix.defect_cooperate[0]}</span>
                </div>
                <div class="payoff-input-group">
                  <label>Player 2</label>
                  <input type="range" id="dc-p2" min="-5" max="10" value="${this.matrix.defect_cooperate[1]}" step="0.5">
                  <span class="value">${this.matrix.defect_cooperate[1]}</span>
                </div>
              </div>
            </div>

            <div class="matrix-cell cell-defect-defect">
              <div class="cell-header">Both Defect</div>
              <div class="cell-description">💥 Mutual defection</div>
              <div class="payoff-inputs">
                <div class="payoff-input-group">
                  <label>Player 1</label>
                  <input type="range" id="dd-p1" min="-5" max="10" value="${this.matrix.both_defect[0]}" step="0.5">
                  <span class="value">${this.matrix.both_defect[0]}</span>
                </div>
                <div class="payoff-input-group">
                  <label>Player 2</label>
                  <input type="range" id="dd-p2" min="-5" max="10" value="${this.matrix.both_defect[1]}" step="0.5">
                  <span class="value">${this.matrix.both_defect[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="matrix-insights">
          <div class="insight-box" id="nash-equilibrium">
            <strong>Nash Equilibrium:</strong> <span id="nash-text">Calculating...</span>
          </div>
          <div class="insight-box" id="pareto-optimal">
            <strong>Pareto Optimal:</strong> <span id="pareto-text">Calculating...</span>
          </div>
        </div>
      </div>
    `;

    this.attachListeners();
    this.updateInsights();
  }

  private attachListeners(): void {
    const inputs = this.container.querySelectorAll('input[type="range"]') as NodeListOf<HTMLInputElement>;

    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        sounds.playBlip(); // Play sound on slider change

        const target = e.target as HTMLInputElement;
        const value = parseFloat(target.value);
        const valueSpan = target.nextElementSibling as HTMLElement;
        valueSpan.textContent = value.toString();

        // Update matrix
        const id = target.id;
        if (id === 'cc-p1') this.matrix.both_cooperate[0] = value;
        else if (id === 'cc-p2') this.matrix.both_cooperate[1] = value;
        else if (id === 'cd-p1') this.matrix.cooperate_defect[0] = value;
        else if (id === 'cd-p2') this.matrix.cooperate_defect[1] = value;
        else if (id === 'dc-p1') this.matrix.defect_cooperate[0] = value;
        else if (id === 'dc-p2') this.matrix.defect_cooperate[1] = value;
        else if (id === 'dd-p1') this.matrix.both_defect[0] = value;
        else if (id === 'dd-p2') this.matrix.both_defect[1] = value;

        this.updateCellColors();
        this.updateInsights();
        this.onChange(this.matrix);
      });
    });
  }

  private updateCellColors(): void {
    const cells = this.container.querySelectorAll('.matrix-cell') as NodeListOf<HTMLElement>;

    cells.forEach(cell => {
      const inputs = cell.querySelectorAll('input[type="range"]') as NodeListOf<HTMLInputElement>;
      const values = Array.from(inputs).map(i => parseFloat(i.value));
      const avg = values.reduce((a, b) => a + b, 0) / values.length;

      // Color based on average payoff
      if (avg >= 3) {
        cell.style.background = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
      } else if (avg >= 1) {
        cell.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
      } else if (avg >= -1) {
        cell.style.background = 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)';
      } else {
        cell.style.background = 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)';
      }
    });
  }

  private updateInsights(): void {
    const nashText = this.container.querySelector('#nash-text') as HTMLElement;
    const paretoText = this.container.querySelector('#pareto-text') as HTMLElement;

    // Find Nash equilibrium
    const cc = this.matrix.both_cooperate;
    const cd = this.matrix.cooperate_defect;
    const dc = this.matrix.defect_cooperate;
    const dd = this.matrix.both_defect;

    let nash = '';

    // Check if (Defect, Defect) is Nash equilibrium
    if (dd[0] >= cd[0] && dd[1] >= dc[1]) {
      nash = 'Both Defect (mutual defection is stable)';
    }
    // Check if (Cooperate, Cooperate) is Nash equilibrium
    else if (cc[0] >= dc[0] && cc[1] >= cd[1]) {
      nash = 'Both Cooperate (mutual cooperation is stable)';
    } else {
      nash = 'Mixed or no pure strategy Nash equilibrium';
    }

    nashText.textContent = nash;

    // Find Pareto optimal outcome
    const outcomes = [
      { name: 'Both Cooperate', values: cc, sum: cc[0] + cc[1] },
      { name: 'Cooperate vs Defect', values: cd, sum: cd[0] + cd[1] },
      { name: 'Defect vs Cooperate', values: dc, sum: dc[0] + dc[1] },
      { name: 'Both Defect', values: dd, sum: dd[0] + dd[1] }
    ];

    const best = outcomes.reduce((max, curr) => curr.sum > max.sum ? curr : max);
    paretoText.textContent = `${best.name} (total: ${best.sum})`;
  }

  getMatrix(): PayoffMatrix {
    return { ...this.matrix };
  }
}
