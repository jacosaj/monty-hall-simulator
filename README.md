# 🚗 Monty Hall Simulator

A premium, interactive 3D simulation of the famous Monty Hall probability paradox, built with React, Three.js, and modern web technologies. Features animated 3D models, real-time statistics, and an Apple/Nike-inspired design.

![Monty Hall Simulator](https://img.shields.io/badge/React-18-blue) ![Three.js](https://img.shields.io/badge/Three.js-Latest-green) ![Tailwind](https://img.shields.io/badge/Tailwind-Latest-blue)

## ✨ Features

- **🎮 Interactive 3D Experience**: Animated doors with realistic lighting and shadows
- **🚗 Detailed 3D Models**: Animated luxury car and goat models
- **📊 Real-time Statistics**: Live win rate tracking with beautiful charts
- **🎨 Premium UI/UX**: Apple/Nike-inspired clean design
- **🤖 Auto-simulation**: Run hundreds of games automatically to demonstrate probability
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **🎊 Visual Effects**: Confetti animations and smooth transitions
- **📚 Educational Content**: Mathematical explanation of the paradox

## 🏗️ Architecture & Clean Code Principles

This project follows industry-standard clean code practices:

### **Separation of Concerns**
- **Custom Hooks**: `useGameState`, `useGameStats`, `useAutoSimulation`
- **Component Separation**: `StatsCard`, `GameControls`, `ExplanationSection`, `Confetti`
- **Utility Functions**: Pure functions for game logic calculations
- **3D Model Creators**: Separate functions for car and goat models

### **Clean Code Principles Applied**
- ✅ **Single Responsibility Principle**: Each function/component has one clear purpose
- ✅ **DRY (Don't Repeat Yourself)**: Common logic extracted to utilities
- ✅ **Constants**: All magic numbers moved to `GAME_CONSTANTS`
- ✅ **Descriptive Naming**: Functions and variables clearly describe their purpose
- ✅ **Small Functions**: No function exceeds 30 lines
- ✅ **Pure Functions**: Utility functions have no side effects
- ✅ **Consistent Formatting**: Uniform code style throughout

### **Project Structure**
```
src/
├── components/
│   ├── MontyHallSimulator.jsx    # Main component
│   ├── StatsCard.jsx             # Statistics display
│   ├── GameControls.jsx          # Game interaction UI
│   └── Confetti.jsx              # Animation effects
├── hooks/
│   ├── useGameState.js           # Game state management
│   ├── useGameStats.js           # Statistics tracking
│   └── useAutoSimulation.js      # Auto-simulation logic
├── utils/
│   ├── gameLogic.js              # Pure game logic functions
│   └── constants.js              # Application constants
└── models/
    ├── carModel.js               # 3D car creation
    └── goatModel.js              # 3D goat creation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/monty-hall-simulator.git
cd monty-hall-simulator
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.155.0",
    "recharts": "^2.8.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24"
  }
}
```

## 🌐 Deployment to zenbox.pl

### Method 1: Using Vite Build (Recommended)

1. **Build the project**
```bash
npm run build
```

2. **Upload to zenbox.pl**
```bash
# The build creates a 'dist' folder with static files
# Upload the contents of 'dist' folder to your zenbox.pl public_html directory

# Using SCP (if you have SSH access):
scp -r dist/* username@yourserver.zenbox.pl:/home/username/public_html/

# Using FTP client:
# Upload all files from 'dist' folder to your domain's root directory
```

3. **Configure .htaccess** (create in public_html):
```apache
# Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Enable browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>

# Handle React Router (if you add routing later)
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

### Method 2: Using CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to zenbox.pl

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to zenbox.pl
      uses: SamKirkland/FTP-Deploy-Action@4.3.3
      with:
        server: yourserver.zenbox.pl
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
        server-dir: /public_html/
```

### Environment Setup for zenbox.pl

1. **Create `vite.config.js`**:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Change to '/subdirectory/' if deploying to a subdirectory
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three'],
          charts: ['recharts']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
```

2. **Create `package.json` scripts**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && echo 'Built successfully! Upload dist/ folder to zenbox.pl'"
  }
}
```

## 🔧 Development

### Adding New Features

1. **Add a new game mode**:
```javascript
// In constants.js
export const GAME_MODES = {
  CLASSIC: 'classic',
  FOUR_DOORS: 'four_doors',
  TIMED: 'timed'
};

// Create new hook: useFourDoorGame.js
export const useFourDoorGame = () => {
  // Implementation for 4-door variant
};
```

2. **Add new 3D models**:
```javascript
// In models/newModel.js
export const createNewModel = () => {
  const group = new THREE.Group();
  // Model creation logic
  return group;
};
```

### Testing

```bash
# Run tests (if you add them)
npm test

# Build and preview
npm run build
npm run preview
```

### Code Quality

```bash
# Add ESLint and Prettier
npm install --save-dev eslint prettier eslint-plugin-react

# Add to package.json:
"scripts": {
  "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
  "format": "prettier --write src/**/*.{js,jsx,ts,tsx,css,md}"
}
```

## 📱 Performance Optimization

- **Bundle size**: ~200KB gzipped
- **Three.js optimization**: Efficient geometry reuse
- **React optimization**: useCallback and useMemo where needed
- **Lazy loading**: Components load on demand
- **Asset optimization**: Compressed textures and models

## 🎮 Usage Guide

1. **Choose a door** by clicking one of the three door buttons
2. **Watch the host** open a door revealing a goat
3. **Make your decision**: Stay with your original choice or switch
4. **See the results** with animated reveals
5. **Track statistics** to see the 2/3 vs 1/3 probability emerge
6. **Use auto-simulation** to run hundreds of games quickly

## 🧮 The Mathematics

The Monty Hall problem demonstrates:
- **Staying**: 1/3 (33.3%) chance of winning
- **Switching**: 2/3 (66.7%) chance of winning
- **Why**: When host opens a door, the unopened door inherits the combined probability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the established clean code patterns
- Add tests for new features
- Update documentation
- Maintain consistent styling
- Ensure mobile responsiveness

## 📄 License

MIT License - see [LICENSE.md](LICENSE.md) for details

## 🙏 Acknowledgments

- Three.js community for 3D capabilities
- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- The original Monty Hall problem creators

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/monty-hall-simulator/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/monty-hall-simulator/discussions)
- 📧 **Contact**: your.email@example.com

---

**Built with ❤️ and modern web technologies**

*Experience the famous probability paradox in a whole new dimension!*