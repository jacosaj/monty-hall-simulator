# Monty Hall Simulator

An interactive 3D simulation of the famous Monty Hall probability paradox, built with React, Three.js, and modern web technologies. Features animated 3D models, real-time statistics, and a clean, minimalist design.

![React](https://img.shields.io/badge/React-18.2.0-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.155.0-green) ![Vite](https://img.shields.io/badge/Vite-4.4.5-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-blue)

**Live Demo:** [https://montyhall.sajnog.pl](https://montyhall.sajnog.pl)

## Features

- **Interactive 3D Experience**: Animated doors with realistic lighting and shadows
- **Detailed 3D Models**: Animated luxury car and goat models with smooth animations
- **Real-time Statistics**: Live win rate tracking with responsive charts
- **Clean UI/UX**: Apple-inspired minimalist design with smooth transitions
- **Auto-simulation**: Run hundreds of games automatically to demonstrate probability
- **Responsive Design**: Works on desktop and mobile devices
- **Educational Content**: Mathematical explanation of the probability paradox

## Architecture

This project follows clean code principles with a modular architecture:

### Component Structure
- **Custom Hooks**: `useGameState`, `useGameStats`, `useAutoSimulation`
- **UI Components**: `StatsCard`, `GameControls`, `ExplanationSection`, `Confetti`
- **3D Models**: Separate functions for car and goat model creation
- **Utility Functions**: Pure functions for game logic calculations

### Clean Code Principles
- Single Responsibility Principle: Each component has one clear purpose
- DRY (Don't Repeat Yourself): Common logic extracted to reusable utilities
- Descriptive Naming: Functions and variables clearly describe their purpose
- Pure Functions: Utility functions have no side effects
- Consistent Code Style: Uniform formatting throughout the project

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jacosaj/monty-hall-simulator.git
cd monty-hall-simulator
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

## Dependencies

### Runtime Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "three": "^0.155.0",
  "recharts": "^2.8.0"
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^4.0.3",
  "vite": "^4.4.5",
  "tailwindcss": "^3.3.0",
  "autoprefixer": "^10.4.14",
  "postcss": "^8.4.24",
  "eslint": "^8.45.0"
}
```

## Deployment

### GitHub Pages (Current Setup)

This project is automatically deployed to GitHub Pages using GitHub Actions:

1. **Automatic Deployment**: Every push to `main` branch triggers deployment
2. **Custom Domain**: Configured for `montyhall.sajnog.pl`
3. **HTTPS**: Automatically enabled with SSL certificate

### Local Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build outputs to the `dist/` directory with optimized assets.

### GitHub Actions Configuration

The project uses GitHub Actions for automatic deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - uses: actions/configure-pages@v4
    - uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
    - uses: actions/deploy-pages@v4
      id: deployment
```

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production  
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Project Structure

```
src/
├── main.jsx                    # Application entry point
├── index.css                   # Global styles with Tailwind
├── MontyHallSimulator.jsx      # Main application component
├── components/                 # Reusable UI components
├── hooks/                      # Custom React hooks
├── utils/                      # Utility functions
└── models/                     # 3D model creators

public/
├── CNAME                       # Custom domain configuration
└── index.html                  # HTML template

.github/
└── workflows/
    └── deploy.yml              # GitHub Actions deployment
```

### Adding New Features

1. **New Game Modes**: Extend the game logic in custom hooks
2. **3D Models**: Add new model creators in the models directory
3. **UI Components**: Create new components following the existing patterns
4. **Statistics**: Extend the stats tracking in `useGameStats` hook

## Usage Guide

1. **Choose a door** by clicking one of the three door buttons
2. **Watch the host** open a door revealing a goat
3. **Make your decision**: Stay with your original choice or switch
4. **See the results** with animated 3D reveals
5. **Track statistics** to observe the probability pattern emerge
6. **Use auto-simulation** to run multiple games quickly

## The Mathematics

The Monty Hall problem demonstrates a counterintuitive probability result:

- **Staying with original choice**: 1/3 (33.3%) chance of winning
- **Switching to remaining door**: 2/3 (66.7%) chance of winning

**Why switching works**: When you initially pick a door, there's a 1/3 chance it has the car and a 2/3 chance the car is behind one of the other two doors. When the host opens one of those doors (always revealing a goat), the remaining unopened door inherits the full 2/3 probability.

## Performance Optimization

- **Bundle Size**: Approximately 200KB gzipped
- **Three.js Optimization**: Efficient geometry reuse and object pooling
- **React Optimization**: Strategic use of `useCallback` and `useMemo`
- **Asset Optimization**: Minified JavaScript and CSS
- **Lazy Loading**: Components load on demand

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

Requires WebGL support for 3D rendering.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following the existing code style
4. Add tests for new functionality
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Open a Pull Request

### Development Guidelines

- Follow the established clean code patterns
- Maintain consistent code formatting
- Add appropriate comments for complex logic
- Ensure responsive design compatibility
- Test across different browsers

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Three.js](https://threejs.org/) community for 3D graphics capabilities
- [React](https://reactjs.org/) team for the component framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Recharts](https://recharts.org/) for data visualization components
- Original Monty Hall problem contributors

## Support

- **Issues**: [GitHub Issues](https://github.com/jacosaj/monty-hall-simulator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jacosaj/monty-hall-simulator/discussions)

---

Built with modern web technologies to demonstrate probability theory through interactive 3D simulation.