import os
import time
from datetime import datetime
from enum import Enum
from dotenv import load_dotenv

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from twilio.rest import Client

from constants import CORS_ALLOWED_ORIGINS, TWILIO_PHONE_NUMBER
from utils.cooldown import CooldownManager
from utils.strings import parse_phone_number

load_dotenv()

api_key = os.getenv("TWILIO_API_KEY")
api_secret = os.getenv("TWILIO_API_SECRET")
account_sid = os.getenv("TWILIO_SID")
client = Client(api_key, api_secret, account_sid)

class NotifStatus(Enum):
    READY = 0
    UNKNOWN = 1
    QUEUED = 2
    SENDING = 3
    SENT = 4
    FAILED = 5
    DELIVERED = 6
    UNDELIVERED = 7
    ACCEPTED = 8
    SCHEDULED = 9
    READ = 10

cooldown_manager = CooldownManager()
notifications_bp = Blueprint('notifications', __name__, url_prefix='/notification')

# Centralized, single-source mapping for Twilio string statuses -> Enum
_STATUS_MAP = {
    'ready': NotifStatus.READY,
    'queued': NotifStatus.QUEUED,
    'sending': NotifStatus.SENDING,
    'sent': NotifStatus.SENT,
    'failed': NotifStatus.FAILED,
    'undeliverable': NotifStatus.UNDELIVERED,
    'accepted': NotifStatus.ACCEPTED,
    'scheduled': NotifStatus.SCHEDULED,
    'read': NotifStatus.READ
}

def _resolve_status(status_input: str) -> NotifStatus:
    """Safely converts Twilio string statuses (or local Enum states) to NotifStatus."""
    return _STATUS_MAP.get(str(status_input), NotifStatus.UNKNOWN)

def _poll_for_final_status(sid: str, max_retries: int = 40, base_delay: float = 0.5) -> tuple:
    """Polls Twilio until the message reaches a terminal state or times out."""
    terminal_statuses = {'delivered', 'failed', 'undeliverable', 'accepted', 'scheduled', 'read'}
    in_progress = {'queued', 'sending', 'processing', 'retrying'}

    for attempt in range(max_retries):
        try:
            msg = client.messages(sid).fetch()
            status_str = msg.status
            print(f"Status in Poll Function: {status_str}")

            # If terminal or not actively processing, return immediately
            if status_str in terminal_statuses or status_str not in in_progress:
                return status_str, msg.error_code, msg.error_message


        except Exception as e:
            print(f"Polling failed for SID {sid}: {str(e)}")
            # Return string to maintain type consistency with normal flow
            return 'failed', 500, str(e)

        time.sleep(base_delay * (1 + attempt / 30))

    # Fallback: fetch latest status from Twilio anyway
    try:
        msg = client.messages(sid).fetch()
        return msg.status, msg.error_code, msg.error_message
    except Exception as e:
        print(f"Final polling fallback failed for SID {sid}: {str(e)}")
        return 'unknown', None, str(e)

@notifications_bp.route('/', methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def update_employees() -> tuple:
    # enforce cooldown, if active
    is_allowed, retry_after = cooldown_manager.allow()
    
    if not is_allowed:
        return jsonify({
            "message": "Rate limit exceeded. Please wait 5 minutes before updating employees again.",
            "retry_after_seconds": retry_after
        }), 429

    # otherwise, update employees in the list
    employees = request.json.get('employees')
    if not employees: 
        return jsonify({ "message": "There are no employees to update!" }), 202
    
    phone_numbers = [employee["phone"] for employee in employees]
    
    with open(f"logs/sms_log_{datetime.now()}.txt", "a") as file:
        delivery_errors = 0
        
        for number in phone_numbers:
            status = NotifStatus.READY
            try:
                # print(f"Sending SMS message to {number}...")
                sms_message = generate_sms_message(number)
                
                # Fire Twilio request
                twilio_resp = client.messages.create(
                    from_=sms_message["from"],
                    to=sms_message["to"],
                    body=sms_message["body"]
                )
                
                # Poll for final status (always returns string)
                final_status_str, error_code, error_message = _poll_for_final_status(twilio_resp.sid)
                print(f"Status String in Update Employees Function: {final_status_str}")
                
                # Normalize to Enum using single source of truth
                status = _resolve_status(final_status_str)
                print(f"Parsed Status in Update Employees Function: {status}")

                if not is_status_positive(status):
                    delivery_errors += 1

                write_status_to_log_file(file, number, status, error_code, error_message)
                    
            except Exception as e:
                delivery_errors += 1
                error_code = 500
                error_message = f"Failed to process message delivery to {number}! Reason: {str(e)}"

                print(error_message)
                write_status_to_log_file(number, NotifStatus.FAILED, error_code, error_message)

        file.close()

    # return appropriate response
    if delivery_errors == 0:
        output = jsonify({ "message": "Employees updated successfully!"}), 200
    elif delivery_errors > 0 and delivery_errors < len(employees):
        output = jsonify({ "message": f"Failed to update {delivery_errors} employees! Please check the log file for more information." }), 500
    else:
        output = jsonify({ "message": "A critical error occurred while trying to notify employees! Please check the log file for more information." }), 500

    return output


def deliver_sms_message(message: str) -> tuple:
    """Kept for backward compatibility if called directly elsewhere."""
    print(f"From: {message["from"]}\nTo: {message["to"]}\nMessage: {message["body"]}\n")
    
    twilio_msg = client.messages.create(from_=message["from"], to=message["to"], body=message["body"])
    
    final_status_str, error_code, error_message = _poll_for_final_status(twilio_msg.sid)
    status = _resolve_status(final_status_str)
    return status.value, error_code, error_message

def generate_sms_message(phone_number: str) -> object:
    message = {
        "body": "Taco Tell - ATTENTION: The work schedule has been changed. Please contact your manager for more information.",
        # "body": "sms_appointment_reminders",
        "from": f"{TWILIO_PHONE_NUMBER}",
        "to": f"{parse_phone_number(phone_number)}"
    }
    return message

def generate_log_message(phone_number: str, status: NotifStatus, error_code: int = 0, error_message: str = "") -> str:
    # Ensure we're comparing Enums consistently
    status_enum = status.value    
    status_message = ""

    if status_enum == NotifStatus.READY.value:
        status_message = f"Initialized message addressed to {phone_number}."
    elif status_enum == NotifStatus.QUEUED.value:
        status_message = "Message queued for delivery."
    elif status_enum == NotifStatus.SENDING.value:
        status_message = f"Sending message to {phone_number}..."
    elif status_enum == NotifStatus.SENT.value:
        status_message = "Message sent!"
    elif status_enum == NotifStatus.FAILED.value:
        status_message = f"Failed to deliver message to {phone_number}! Reason: {error_message} | Error Code: {error_code}"
    elif status_enum == NotifStatus.DELIVERED.value:
        status_message = "Message delivered!"
    elif status_enum == NotifStatus.UNDELIVERED.value:
        status_message = f"Could not deliver message to {phone_number}! Reason: {error_message} | Error Code: {error_code}"
    elif status_enum == NotifStatus.ACCEPTED.value:
        status_message = "API request received!"
    elif status_enum == NotifStatus.SCHEDULED.value:
        status_message = f"Message scheduled for delivery to {phone_number}."
    elif status_enum == NotifStatus.READ.value:  # Fixed comparison bug from before
        status_message = f"Recipient {phone_number} has read your message!"
    elif status_enum == NotifStatus.UNKNOWN.value:
        status_message = f"Unknown status occurred for message delivery to {phone_number}! Please contact the developer for more information!"
    else:
        status_message = f"Unusual status occurred for message delivery to {phone_number}! Please contact the developer for more information!"

    return f"[{datetime.now()}] - {status_message}"


def is_status_positive(status) -> bool:
    """Returns True if Twilio considers this a successful or pending-delivery state."""
    actual_enum = _resolve_status(status)
    return (actual_enum != NotifStatus.FAILED.value and 
            actual_enum != NotifStatus.UNDELIVERED.value and 
            actual_enum != NotifStatus.UNKNOWN.value)


def write_status_to_log_file(file, number, status, error_code, error_message):
    log_message = generate_log_message(number, status, error_code, error_message)
    print(log_message)
    file.write(f"{log_message}\n")
