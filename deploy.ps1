Write-Host "Adding files to git..." -ForegroundColor Cyan
git add .
Write-Host "Committing changes..." -ForegroundColor Cyan
git commit -m "feat: complete rebuild and push JWT auth, Officer portal, Gemini Vision, shelters, and PDF export"
Write-Host "Pushing to GitHub main branch..." -ForegroundColor Cyan
git push origin main
Write-Host "Done! Push complete." -ForegroundColor Green
