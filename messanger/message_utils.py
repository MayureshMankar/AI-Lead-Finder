# messanger/message_utils.py

def personalize_message(message: str) -> str:
    """
    Replaces placeholders in the message with actual values.

    Placeholders supported:
    - [Your Name]
    - [Your LinkedIn Profile]
    - [Your Contact Information]

    Returns:
        str: Personalized message
    """
    return (
    message
    .replace("[Your Name]", "Mayuresh Mankar")
    .replace("[Your LinkedIn Profile]", "https://www.linkedin.com/in/mayuresh-mankar")
    .replace("[Your Contact Information]", "mankar2045@gmail.com")
    .replace("[Your LinkedIn Profile or Contact Information]", "https://www.linkedin.com/in/mayuresh-mankar | mankar2045@gmail.com")
)
