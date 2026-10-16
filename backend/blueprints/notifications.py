# import twilio # This will be used later once mock systems pass tests

from enum import Enum
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from datetime import datetime

from constants import CORS_ALLOWED_ORIGINS

class NotifStatus(Enum):
    PENDING = 1
    PROCESSING = 2
    SUCCESS = 3
    FAILURE = 4

notifications_bp = Blueprint('notifications', __name__, url_prefix='/notification')

@notifications_bp.route('/', methods=['POST'])
@cross_origin(origins=CORS_ALLOWED_ORIGINS)
def update_employees():
    employees = request.json.get('employees')
    phone_numbers = [employee["phone"] for employee in employees]
    output = None

    with open(f"logs/sms_log_{datetime.now()}.txt", "a") as file:
        delivery_errors = 0
        for number in phone_numbers:
            print(f"Sending SMS message to {number}...")
            sms_message = generate_sms_message(number)
            sms_status = deliver_sms_message(sms_message)

            if sms_status == NotifStatus.FAILURE.value:
                delivery_errors += 1
            # print(f"From: {sms_message["from"]}\nTo: {sms_message["to"]}\nMessage: {sms_message["body"]}")

            log_message = generate_log_message(number, sms_status) # TODO replace hardcoded status with actual Twilio status codes
            print(log_message)
            file.write(f"{log_message}\n")

        file.close()

    if delivery_errors == 0:
        output = { "message": "Employees updated successfully!"}, 200
    elif delivery_errors > 0 and delivery_errors < len(employees):
        output = { "message": f"Failed to update {delivery_errors} employees! Please check the log file for more information."}, 500
    else:
        output = { "message": "A critical error occurred while trying to notify employees! Please check the log file for more information."}, 500

    return output

def deliver_sms_message(message) -> NotifStatus:
    print(f"From: {message["from"]}\nTo: {message["to"]}\nMessage: {message["body"]}")
    return NotifStatus.SUCCESS.value


def generate_sms_message(phone_number) -> object:
    message = {
        "body": "ATTENTION: The work schedule has been changed. Please contact your manager for more information.",
        "from": "+15555555555",
        "to": f"{phone_number}"
    }

    return message


def generate_log_message(phone_number: int, status: NotifStatus) -> str:
    status_message = ""
    if status == NotifStatus.SUCCESS.value:
        status_message = "Message sent!"
    elif status == NotifStatus.FAILURE.value:
        status_message = f"Failed to deliver message to {phone_number}!"
    else:
        status_message = f"Unusual status occurred for message delivery to {phone_number}!"

    return f"[{datetime.now()}] - {status_message}"