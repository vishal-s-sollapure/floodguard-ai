$env:Path += ";$env:APPDATA\Python\Python314\Scripts;$env:LOCALAPPDATA\Programs\Python\Python314\Scripts"
Write-Host "Starting FloodGuard AI Backend Server..." -ForegroundColor Green
python -m uvicorn main:app --reload --port 8000
