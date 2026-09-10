import subprocess
import sys

def run_git():
    try:
        print("Running git add .")
        subprocess.run(["git", "add", "."], cwd="c:/Users/vinay/OneDrive/Desktop/FloodRescue", check=True)
        print("Running git commit")
        subprocess.run(["git", "commit", "-m", "feat: 10 production-grade refinements, disaster scenario simulator, system health panel, audit trail & pytest suite"], cwd="c:/Users/vinay/OneDrive/Desktop/FloodRescue", check=True)
        print("Running git push origin main")
        subprocess.run(["git", "push", "origin", "main"], cwd="c:/Users/vinay/OneDrive/Desktop/FloodRescue", check=True)
        print("SUCCESS: Code successfully committed and pushed to GitHub main branch!")
    except Exception as e:
        print(f"Git execution error: {e}")

if __name__ == "__main__":
    run_git()
