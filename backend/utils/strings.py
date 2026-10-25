def parse_phone_number(phone_number: str) -> str:
    output = "+1"
    for digit in phone_number:
        output += digit if digit.isnumeric() else ""

    return output