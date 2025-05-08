const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const webDir = path.join(__dirname, '../web');
const distDir = path.join(__dirname, '../dist');

if (!fs.existsSync(webDir)) {
  fs.mkdirSync(webDir, { recursive: true });
}

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('Dist directory does not exist. Make sure to run expo export first.');
  process.exit(1);
}

// Create 404.html file if it doesn't exist
const file404Path = path.join(webDir, '404.html');
if (!fs.existsSync(file404Path)) {
  const content404 = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>WordFuel</title>
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    var pathSegmentsToKeep = 1;

    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
</body>
</html>`;
  
  fs.writeFileSync(file404Path, content404);
  console.log('Created 404.html in web directory');
}

// Copy 404.html to dist directory
fs.copyFileSync(file404Path, path.join(distDir, '404.html'));
console.log('Copied 404.html to dist directory');

// Modify index.html to include SPA redirect script
const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Check if script is already added
  if (!indexContent.includes('Single Page Apps for GitHub Pages')) {
    // Find the head end tag
    const headCloseIndex = indexContent.indexOf('</head>');
    if (headCloseIndex !== -1) {
      const spaScript = `
  <!-- Start Single Page Apps for GitHub Pages -->
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    (function(l) {
      if (l.search[1] === '/' ) {
        var decoded = l.search.slice(1).split('&').map(function(s) { 
          return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
        );
      }
    }(window.location))
  </script>
  <!-- End Single Page Apps for GitHub Pages -->`;
      
      // Insert script before head close tag
      indexContent = indexContent.slice(0, headCloseIndex) + spaScript + indexContent.slice(headCloseIndex);
      fs.writeFileSync(indexPath, indexContent);
      console.log('Added SPA redirect script to index.html');
    } else {
      console.error('Could not find </head> tag in index.html');
    }
  } else {
    console.log('SPA redirect script already exists in index.html');
  }
} else {
  console.error('index.html does not exist in dist directory');
}

console.log('Web files processed successfully'); 