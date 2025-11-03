# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

```bash
# Clone or navigate to the project
cd gametheory

# Install dependencies (only takes a few seconds)
npm install
```

## Development

```bash
# Start development server
npm run dev
```

Open http://localhost:5173/gametheory/ in your browser.

Changes to source files will hot-reload automatically!

## Try It Out

### 1. Run Your First Game

- **Scenario**: Leave on "Tariff War" (default)
- **Player 1**: Tit for Tat (default)
- **Player 2**: Always Cooperate
- **Rounds**: 20 (default)
- Click **"Play Game"**

**Observation**: Tit for Tat starts with cooperation and maintains it. Both players end up with high scores (mutual free trade).

### 2. See the "Shoot Yourself in the Foot" Effect

- **Player 1**: Always Defect (change this)
- **Player 2**: Always Defect (change this)
- Click **"Play Game"**

**Observation**: Both players end up with low scores (mutual tariffs). This is the Nash equilibrium but it's terrible for both countries!

### 3. Run a Tournament

- Keep default settings
- Click **"Run Tournament"**

**Observation**: Tit for Tat usually wins or places very high. Cooperation-oriented strategies dominate.

### 4. Try Different Scenarios

- Change **Scenario** to "Classic Prisoner's Dilemma"
- Run the same experiments
- See how different payoff structures affect outcomes

### 5. Export Your Data

- After running a game or tournament
- Click **"Export Data"**
- Get JSON file for analysis in R, Python, or Excel

## Understanding the Results

### Game Results

- **Score cards**: Show final scores for both players
- **Visualization**: Line chart showing score evolution over time
- **Table**: Round-by-round breakdown of actions and payoffs

### Tournament Results

- **Standings**: Strategies ranked by total score across all matches
- **Match Results**: Every head-to-head matchup with scores

### Key Insights to Look For

1. **Tit for Tat dominates**: It's "nice" (starts cooperating), "retaliatory" (punishes defection), and "forgiving" (returns to cooperation)

2. **Always Defect does poorly**: In repeated games, pure selfishness backfires

3. **Always Cooperate gets exploited**: Pure altruism loses to defectors

4. **Tariff wars hurt both sides**: The Nash equilibrium (mutual tariffs) is worse than cooperation

## Customization

### Change Number of Rounds

More rounds (50-100) show clearer patterns. Strategies like Tit for Tat need time to establish cooperation.

### Compare Strategies

Try these matchups to see interesting dynamics:

- **Tit for Tat vs Grim Trigger**: Both cooperative but Grim never forgives
- **Tit for Tat vs Pavlov**: Two winning strategies with different logic
- **Generous Tit for Tat vs Tit for Tat**: See the value of forgiveness
- **Always Cooperate vs Always Defect**: Pure exploitation

### Edit Payoff Matrix

Want to experiment with different payoffs? Edit `src/scenarios.ts`:

```typescript
export const myScenario: PayoffMatrix = {
  both_cooperate: [X, X],    // Both cooperate
  cooperate_defect: [Y, Z],  // I cooperate, they defect
  defect_cooperate: [Z, Y],  // I defect, they cooperate
  both_defect: [W, W]        // Both defect
};
```

Then add it to the `SCENARIOS` array.

## Common Questions

### Why does Tit for Tat win?

It follows four principles:
1. **Nice**: Never defects first
2. **Retaliatory**: Immediately punishes defection
3. **Forgiving**: Returns to cooperation after one retaliation
4. **Clear**: Easy for opponent to understand

### Why is the tariff scenario interesting?

It shows that trade wars are lose-lose. Even though imposing tariffs while others don't gives you advantage (+4), mutual tariffs (+1, +1) is much worse than free trade (+3, +3).

### What's the Nash Equilibrium?

In tariff scenario: Both countries imposing tariffs (1, 1). This is "stable" because neither can improve by unilaterally changing strategy. But it's **Pareto inferior** to mutual free trade (3, 3).

### Can I add my own strategy?

Yes! Edit `src/strategies.ts` and add:

```typescript
export const myStrategy: Strategy = {
  name: 'My Strategy',
  description: 'What it does',
  decide: (history: RoundResult[], playerIndex: 1 | 2) => {
    // Your logic here
    return 'cooperate'; // or 'defect'
  }
};
```

Then add it to `ALL_STRATEGIES` array.

## Next Steps

1. **Deploy to GitHub Pages**: See DEPLOYMENT.md
2. **Customize scenarios**: Edit src/scenarios.ts
3. **Add strategies**: Edit src/strategies.ts
4. **Write blog post**: Use exported data for analysis
5. **Academic research**: Export data to R/Python for statistical tests

## Getting Help

- Check README.md for full documentation
- Check DEPLOYMENT.md for GitHub Pages setup
- See code comments for implementation details
- Open GitHub issue for bugs/questions

## Performance

The app is fast:
- Loads in <1 second on good connection
- Runs 100 rounds in milliseconds
- Tournament with 7 strategies completes instantly
- Works great on iPhone/Android

Enjoy exploring game theory!
