# GitHub Pages Deployment Guide

This guide will help you deploy the BibTeX-to-Bibitem web application to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed on your local machine
- Repository: `imranpollob/BibTeX-to-Bibitem`

## Quick Deployment Steps

### 1. Commit and Push Changes

```bash
cd /home/pollmix/Coding/BibTeX-to-Bibitem

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Add professional web interface with GitHub Pages deployment"

# Push to GitHub (replace 'main' with 'master' if needed)
git push origin main
```

### 2. Enable GitHub Pages

1. Navigate to your repository on GitHub:
   ```
   https://github.com/imranpollob/BibTeX-to-Bibitem
   ```

2. Click on **Settings** (top navigation bar)

3. In the left sidebar, click **Pages**

4. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions**
   
5. The GitHub Actions workflow will automatically trigger and deploy your site

### 3. Monitor Deployment

1. Go to the **Actions** tab in your repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Click on it to see the deployment progress
4. Wait for the green checkmark (usually takes 1-2 minutes)

### 4. Access Your Live Site

Once deployment is complete, your site will be available at:

```
https://imranpollob.github.io/BibTeX-to-Bibitem/
```

> **Note**: It may take a few minutes for the site to be accessible after the first deployment.

## Automatic Deployment

The GitHub Actions workflow is configured to automatically deploy whenever you push to the `main` (or `master`) branch. This means:

- Any changes you push will automatically update the live site
- No manual deployment steps required after initial setup
- Deployment happens within 1-2 minutes of pushing

## Workflow Configuration

The deployment workflow is defined in:
```
.github/workflows/static.yml
```

It performs the following steps:
1. Checks out your code
2. Configures GitHub Pages
3. Uploads the `docs/` directory as an artifact
4. Deploys to GitHub Pages

## Troubleshooting

### Site Not Deploying

If your site doesn't deploy:

1. **Check GitHub Actions**:
   - Go to the **Actions** tab
   - Look for failed workflow runs
   - Click on the failed run to see error details

2. **Verify Pages Settings**:
   - Settings → Pages
   - Ensure **Source** is set to **GitHub Actions**

3. **Check Branch Name**:
   - If your default branch is `master` instead of `main`, update line 4 in `.github/workflows/static.yml`:
     ```yaml
     branches: ["master"]
     ```

### 404 Error

If you get a 404 error when accessing the site:

1. Ensure the deployment workflow completed successfully
2. Wait 5-10 minutes for DNS propagation
3. Try clearing your browser cache
4. Verify the URL is correct: `https://imranpollob.github.io/BibTeX-to-Bibitem/`

### Workflow Permission Error

If you see a permissions error:

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Click **Save**
5. Re-run the failed workflow

## Manual Re-deployment

To manually trigger a deployment without pushing new code:

1. Go to the **Actions** tab
2. Click **Deploy to GitHub Pages** in the left sidebar
3. Click **Run workflow** button
4. Select the branch and click **Run workflow**

## Testing Locally

Before deploying, you can test the site locally:

```bash
# Option 1: Using Python's built-in server
cd docs
python -m http.server 8000

# Option 2: Using Python 2
cd docs
python -m SimpleHTTPServer 8000

# Then open in browser:
# http://localhost:8000
```

## Updating the Live Site

To update your live site:

1. Make changes to files in the `docs/` directory
2. Commit your changes:
   ```bash
   git add docs/
   git commit -m "Update web interface"
   git push origin main
   ```
3. The site will automatically redeploy within 1-2 minutes

## Custom Domain (Optional)

To use a custom domain:

1. Add a file named `CNAME` in the `docs/` directory
2. Put your domain name in it (e.g., `bibconverter.com`)
3. Commit and push
4. In your domain registrar, add a CNAME record pointing to:
   ```
   imranpollob.github.io
   ```

## Verification

After deployment, verify:

- ✅ Site loads at `https://imranpollob.github.io/BibTeX-to-Bibitem/`
- ✅ All styles load correctly (no broken CSS)
- ✅ JavaScript works (conversion functionality)
- ✅ File upload works
- ✅ Copy and download buttons work
- ✅ Responsive design works on mobile

## Support

If you encounter issues:

1. Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Review the [GitHub Actions logs](https://github.com/imranpollob/BibTeX-to-Bibitem/actions)
3. Open an issue in the repository

---

**Ready to deploy?** Follow Step 1 above to get started! 🚀
