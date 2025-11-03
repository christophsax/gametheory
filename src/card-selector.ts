import { sounds } from './sounds';

export interface CardOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export class CardSelector {
  private container: HTMLElement;
  private options: CardOption[];
  private selectedId: string;
  private onChange: (id: string, index: number) => void;
  private label: string;

  constructor(
    container: HTMLElement,
    label: string,
    options: CardOption[],
    selectedId: string,
    onChange: (id: string, index: number) => void
  ) {
    this.container = container;
    this.label = label;
    this.options = options;
    this.selectedId = selectedId;
    this.onChange = onChange;
  }

  render(): void {
    this.container.innerHTML = `
      <div class="card-selector">
        <label class="card-selector-label">${this.label}</label>
        <div class="card-selector-grid">
          ${this.options.map((option, index) => `
            <div
              class="card-option ${option.id === this.selectedId ? 'selected' : ''}"
              data-id="${option.id}"
              data-index="${index}"
            >
              <div class="card-icon">${option.icon}</div>
              <div class="card-title">${option.title}</div>
              <div class="card-description">${option.description}</div>
              <div class="card-selected-indicator">✓</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.attachListeners();
  }

  private attachListeners(): void {
    const cards = this.container.querySelectorAll('.card-option') as NodeListOf<HTMLElement>;

    cards.forEach(card => {
      card.addEventListener('click', () => {
        sounds.playJump();

        const id = card.dataset.id!;
        const index = parseInt(card.dataset.index!);

        // Remove selected class from all cards
        cards.forEach(c => c.classList.remove('selected'));

        // Add selected class to clicked card
        card.classList.add('selected');

        this.selectedId = id;
        this.onChange(id, index);
      });

      // Hover sound (subtle)
      card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('selected')) {
          // Could add subtle hover sound here if desired
        }
      });
    });
  }

  setSelected(id: string): void {
    this.selectedId = id;
    const cards = this.container.querySelectorAll('.card-option') as NodeListOf<HTMLElement>;
    cards.forEach(card => {
      if (card.dataset.id === id) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
  }
}
