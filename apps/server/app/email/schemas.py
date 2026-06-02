from pydantic import BaseModel, EmailStr, Field


class ContactRequest(BaseModel):
    email: EmailStr
    subject: str = Field(min_length=2, max_length=120)
    message: str = Field(min_length=5, max_length=4000)


class EmailSendResult(BaseModel):
    sent: bool
    dry_run: bool
    recipient: EmailStr
