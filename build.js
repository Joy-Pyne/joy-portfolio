const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// Copy main files
const filesToCopy = ['index.html', 'style.css', 'script.js'];
filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(distDir, file));
    }
});

// Copy directories
const dirsToCopy = ['requiementportfolio', 'assets'];
dirsToCopy.forEach(dir => {
    const src = path.join(__dirname, dir);
    if (fs.existsSync(src)) {
        fs.cpSync(src, path.join(distDir, dir), { recursive: true });
    }
});

console.log("Build successfully created in dist/");
