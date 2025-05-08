# Manual Deployment Instructions for GitHub Pages

Since automated deployment might encounter authentication issues, here's a manual way to deploy the app to GitHub Pages:

## One-time Setup

1. Create a GitHub repository named `wordfuel`
2. Initialize git in your project folder if not already done:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VoPta/wordfuel.git
   ```

## Deployment Process

1. Build the web version of your app:
   ```
   npx expo export --platform web
   ```
   This will create a `dist` folder with your web build.

2. Create and switch to a gh-pages branch:
   ```
   git checkout --orphan gh-pages
   ```

3. Remove everything except the dist folder:
   ```
   git rm -rf .
   git clean -fxd
   ```

4. Move dist contents to root:
   ```
   xcopy /E /H /C /I dist\* .
   rmdir /S /Q dist
   ```

5. Add all files and commit:
   ```
   git add .
   git commit -m "Deploy to GitHub Pages"
   ```

6. Push to the gh-pages branch:
   ```
   git push -u origin gh-pages -f
   ```

7. Switch back to main branch:
   ```
   git checkout main
   ```

## After Deployment

1. Go to your GitHub repository settings
2. Navigate to Pages section
3. Make sure the source is set to "gh-pages" branch
4. Your site should be available at: https://VoPta.github.io/wordfuel

## Troubleshooting

If you encounter 404 errors:
- Check if your GitHub Pages is properly configured
- Verify the `scope` in app.json is set to `/wordfuel/`
- Make sure all links in your app use relative paths 