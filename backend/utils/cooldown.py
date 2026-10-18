import time
import threading

from functools import wraps
from flask import request

# Configuration
COOLDOWN_SECONDS = 300  # 5 minutes
RATE_LIMIT_KEY = 'update_employees'

class CooldownManager:
    def __init__(self):
        self.lock = threading.Lock()
        # Stores {ip_address: last_request_timestamp}
        self.last_request_times = {}

    def allow(self, client_ip=None):
        """Checks if the requested IP can make a new request within cooldown window."""
        now = time.time()
        ip = client_ip or request.remote_addr
        
        with self.lock:
            last_time = self.last_request_times.get(ip, 0)
            
            # If enough time has passed, reset the timer and allow
            if now - last_time >= COOLDOWN_SECONDS:
                self.last_request_times[ip] = now
                return True, None
            
            # Calculate remaining seconds until cooldown resets
            remaining = int(COOLDOWN_SECONDS - (now - last_time))
            return False, remaining

# # Instantiate once for the blueprint
# cooldown_manager = CooldownManager()
