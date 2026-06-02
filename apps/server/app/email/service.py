from email.message import EmailMessage
import smtplib

from app.core.config import Settings
from app.email.schemas import ContactRequest, EmailSendResult


def send_contact_email(settings: Settings, payload: ContactRequest) -> EmailSendResult:
    recipient = settings.smtp_from_email
    if not settings.smtp_host:
        return EmailSendResult(sent=True, dry_run=True, recipient=recipient)

    message = EmailMessage()
    message["From"] = settings.smtp_from_email
    message["To"] = recipient
    message["Reply-To"] = payload.email
    message["Subject"] = payload.subject
    message.set_content(payload.message)

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as smtp:
        if settings.smtp_use_tls:
            smtp.starttls()
        if settings.smtp_username and settings.smtp_password:
            smtp.login(settings.smtp_username, settings.smtp_password)
        smtp.send_message(message)

    return EmailSendResult(sent=True, dry_run=False, recipient=recipient)
