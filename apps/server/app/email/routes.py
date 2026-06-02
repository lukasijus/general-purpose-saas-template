import smtplib

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.config import Settings
from app.core.dependencies import current_settings
from app.email.schemas import ContactRequest, EmailSendResult
from app.email.service import send_contact_email

router = APIRouter(tags=["contact"])


@router.post("/contact", response_model=EmailSendResult)
def contact(
    payload: ContactRequest,
    settings: Settings = Depends(current_settings),
) -> EmailSendResult:
    try:
        return send_contact_email(settings, payload)
    except smtplib.SMTPException as exc:
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY,
            "Contact email delivery failed",
        ) from exc
