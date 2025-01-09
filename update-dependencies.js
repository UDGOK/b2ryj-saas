const fs = require('fs');
const { execSync } = require('child_process');

// Read the current package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Update the versions
packageJson.dependencies = {
  ...packageJson.dependencies,
  "lucide-react": "^0.294.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
};

// Write the updated package.json
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

console.log('Updated package.json');

// Remove node_modules and package-lock.json
try {
  fs.rmSync('node_modules', { recursive: true, force: true });
  fs.unlinkSync('package-lock.json');
  console.log('Removed node_modules and package-lock.json');
} catch (error) {
  console.error('Error removing files:', error);
}

// Run npm install
try {
  console.log('Running npm install...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('Dependencies installed successfully');
} catch (error) {
  console.error('Error installing dependencies:', error);
}