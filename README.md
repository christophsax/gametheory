# Tariff Wars: A Game Theory Simulation

An interactive web-based game theory simulation exploring the prisoner's dilemma in trade policy. Built with modern TypeScript and optimized for mobile devices.

## Features

- **Multiple Scenarios**: Tariff wars, classic prisoner's dilemma, climate cooperation
- **7 Built-in Strategies**: Tit-for-tat, always cooperate, always defect, grim trigger, Pavlov, generous tit-for-tat, and random
- **Interactive Visualization**: Real-time charts showing score evolution
- **Tournament Mode**: Run round-robin tournaments with all strategies
- **Mobile-Optimized**: Works perfectly on iPhone and Android
- **Data Export**: Export results as JSON for research
- **Fast & Modern**: Built with Vite and TypeScript (2025 tech stack)

## Live Demo

[View Live Demo](https://christophsax.github.io/gametheory/) (once deployed)

## Why This Project?

This project demonstrates:

1. **The Self-Destructive Nature of Tariffs**: When both countries impose tariffs, both lose (Nash equilibrium is suboptimal)
2. **Why Cooperation Wins**: Strategies like Tit-for-Tat that promote cooperation tend to win tournaments
3. **The Power of Game Theory**: Understanding incentives helps explain real-world behavior

Inspired by Robert Axelrod's classic "The Evolution of Cooperation" and tournaments, but with modern web technology and a focus on tariff policy.

## Quick Start

### Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Production Build

```bash
npm run build
```

Output goes to `/docs` folder (ready for GitHub Pages).

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Choose a Scenario**: Select from tariff wars, prisoner's dilemma, or climate cooperation
2. **Select Strategies**: Choose strategies for both players
3. **Set Number of Rounds**: Typically 20-100 rounds shows interesting patterns
4. **Play Game**: See head-to-head results with visualization
5. **Run Tournament**: See all strategies compete against each other
6. **Export Data**: Download results as JSON for analysis

## Strategy Descriptions

- **Tit for Tat**: Start cooperating, then copy opponent's last move (Axelrod's tournament winner)
- **Always Cooperate**: Always choose free trade
- **Always Defect**: Always impose tariffs
- **Grim Trigger**: Cooperate until opponent defects once, then defect forever
- **Pavlov**: Win-stay, lose-shift (repeat if successful, switch if not)
- **Generous Tit for Tat**: Like Tit for Tat but sometimes forgives defection
- **Random**: 50/50 random choice

## Key Insights from Tariff Scenario

The payoff matrix for tariffs shows:

```
Both Free Trade:     (+3, +3)  - Optimal outcome
Free Trade vs Tariff: (0, +4)  - Exploited vs protected
Tariff vs Free Trade: (+4, 0)  - Protected vs exploited
Both Tariff:         (+1, +1)  - Both suffer (Nash equilibrium)
```

The Nash equilibrium (both tariff) is Pareto inferior to mutual cooperation (both free trade). This demonstrates why protectionism is economically destructive even though it's individually "rational" in a one-shot game.

## Technology Stack

- **TypeScript**: Type-safe code
- **Vite**: Lightning-fast builds
- **Chart.js**: Beautiful, responsive visualizations
- **Modern CSS**: Mobile-first responsive design
- **No Framework**: Vanilla TypeScript for maximum performance and minimal bundle size

## Project Structure

```
src/
├── types.ts         # TypeScript interfaces
├── strategies.ts    # Game theory strategies
├── scenarios.ts     # Payoff matrices for different scenarios
├── game-engine.ts   # Core simulation logic
├── visualization.ts # Chart.js wrapper
├── ui.ts           # User interface logic
├── style.css       # Modern, mobile-first CSS
└── main.ts         # Entry point
```

## Academic Use

This simulation was created to support:

1. Research on trade policy and game theory
2. Blog posts explaining tariff economics
3. Interactive education about cooperation vs defection

Data can be exported as JSON for statistical analysis.

## Deployment

### GitHub Pages

This project is configured to deploy to GitHub Pages:

1. Build creates output in `/docs` folder
2. Enable GitHub Pages in repository settings
3. Set source to `/docs` on main branch
4. Site will be live at `https://username.github.io/gametheory/`

### Base URL Configuration

The Vite config uses `base: '/gametheory/'` for GitHub Pages. If deploying to a custom domain, change this in `vite.config.ts`.

## Comparison to Existing Tools

While "The Evolution of Trust" (ncase.me/trust, 2017) is excellent for storytelling, this project offers:

- Modern 2025 tech stack (faster, better mobile support)
- Specific tariff war scenario
- Full parameter customization
- Tournament mode with multiple strategies
- Data export for research
- Cleaner, more responsive mobile UI

## Future Enhancements

Potential additions:

- [ ] Custom strategy builder (user-defined logic)
- [ ] More scenarios (arms race, tech standards, etc.)
- [ ] Animated game visualization
- [ ] CSV export in addition to JSON
- [ ] Parameter presets (famous economic scenarios)
- [ ] Multi-player tournaments (3+ players)

## License

MIT License - feel free to use for education, research, or blog posts.

## Author

Created for vacation project exploring game theory in trade policy.

For academic collaboration or questions, see the GitHub repository.

## Acknowledgments

- Robert Axelrod's "The Evolution of Cooperation"
- Nicky Case's "The Evolution of Trust" for inspiration
- Economist friends for tariff scenario insights
