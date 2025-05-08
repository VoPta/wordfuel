/**
 * Manual GitHub Pages deployment script
 * This script will help deploy your app to GitHub Pages without authentication issues
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Starting GitHub Pages deployment process...');

// Helper function to execute commands
function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    return false;
  }
}

// Build the web app
console.log('🔨 Building the web application...');
if (!runCommand('npx expo export --platform web')) {
  console.error('❌ Failed to build the web application');
  process.exit(1);
}

// Process web files
console.log('🔄 Processing web files...');
if (!runCommand('node scripts/copy-web-files.js')) {
  console.error('❌ Failed to process web files');
  process.exit(1);
}

// Create a temporary branch for the build
console.log('🌿 Creating a temporary branch for GitHub Pages...');
try {
  // Save current branch
  const currentBranch = execSync('git branch --show-current').toString().trim();
  console.log(`Current branch: ${currentBranch}`);
  
  // Create and switch to a temporary branch
  console.log('Creating temporary branch...');
  runCommand('git checkout --orphan gh-pages-temp');
  
  // Remove all tracked files
  console.log('Cleaning repository...');
  runCommand('git rm -rf .');
  
  // Copy dist contents to root
  console.log('📋 Copying built files...');
  const distDir = path.join(__dirname, '../dist');
  const files = fs.readdirSync(distDir);
  
  files.forEach(file => {
    const srcPath = path.join(distDir, file);
    const destPath = path.join(__dirname, '..', file);
    
    if (fs.lstatSync(srcPath).isDirectory()) {
      // Copy directory
      runCommand(`xcopy /E /I /Y "${srcPath}" "${destPath}"`);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  // Add all files
  console.log('📝 Committing files...');
  runCommand('git add .');
  runCommand('git commit -m "Deploy to GitHub Pages"');
  
  // Force push to gh-pages branch
  console.log('🚀 Pushing to gh-pages branch...');
  runCommand('git push -f origin gh-pages-temp:gh-pages');
  
  // Switch back to original branch
  console.log(`🔙 Switching back to ${currentBranch} branch...`);
  runCommand(`git checkout ${currentBranch}`);
  
  // Delete temporary branch
  console.log('🧹 Cleaning up...');
  runCommand('git branch -D gh-pages-temp');
  
  console.log('✅ Deployment complete!');
  console.log('📱 Your app should now be available at: https://vopta.github.io/wordfuel/');
  console.log('⏱️ Note: It may take a few minutes for the changes to propagate.');
  
} catch (error) {
  console.error('❌ Deployment failed:');
  console.error(error);
  process.exit(1);
} 