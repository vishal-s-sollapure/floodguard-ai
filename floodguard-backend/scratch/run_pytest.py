import sys
import pytest

if __name__ == "__main__":
    sys.path.insert(0, "c:/Users/vinay/OneDrive/Desktop/FloodRescue/floodguard-backend")
    exit_code = pytest.main(["-v", "c:/Users/vinay/OneDrive/Desktop/FloodRescue/floodguard-backend/tests/test_core_system.py"])
    sys.exit(exit_code)
