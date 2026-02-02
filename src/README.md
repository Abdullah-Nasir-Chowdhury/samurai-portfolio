# Samurai Portfolio

A stunning samurai-themed portfolio with animated flame effects and Japanese aesthetics.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The terminal will show you a URL (usually `http://localhost:5173`)

## Project Structure

```
project/
├── src/
│   ├── App.jsx              # Main App component
│   ├── SamuraiPortfolio.jsx # Portfolio component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles with Tailwind
├── index.html               # HTML entry
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── postcss.config.js        # PostCSS configuration
```

## Common Issues

### White screen with just text:
- Make sure Tailwind CSS is properly installed: `npm install -D tailwindcss postcss autoprefixer`
- Ensure `index.css` has the Tailwind directives at the top
- Check that all files are in the `src/` folder

### Lucide icons not showing:
- Install lucide-react: `npm install lucide-react`

### Build errors:
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear your browser cache

## Customization

- Replace "YOUR NAME" in `SamuraiPortfolio.jsx`
- Add your photo by uncommenting the image tag and adding your image URL
- Modify the skills section to match your expertise
- Update the color scheme by changing the red-* Tailwind classes
