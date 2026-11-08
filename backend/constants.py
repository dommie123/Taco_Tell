import os
from dotenv import load_dotenv

load_dotenv()

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    os.getenv("CLIENT_IP")
]

TWILIO_TRIAL_PHONE_NUMBER = "+17372583742"  # Keep this in case I need to revert back to the Twilio trial account
TWILIO_PHONE_NUMBER = "+13855270354"