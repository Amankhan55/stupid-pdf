import logging
import re

from fastapi import APIRouter, Form, HTTPException, Request

from rate_limit import limiter
from services.email_service import send_contact_email

router = APIRouter(prefix="/api")
logger = logging.getLogger("contact_routes")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

MAX_NAME_LEN = 100
MAX_EMAIL_LEN = 200
MAX_TOPIC_LEN = 100
MAX_MESSAGE_LEN = 5000


@router.post("/contact")
@limiter.limit("5/hour")
async def contact_route(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    message: str = Form(...),
    topic: str = Form("General Question"),
):
    """Send a contact-form message to the site owner's inbox."""
    name = name.strip()
    email = email.strip()
    message = message.strip()
    topic = topic.strip() or "General Question"

    if not name or len(name) > MAX_NAME_LEN:
        raise HTTPException(status_code=400, detail="Please enter a valid name.")
    if not email or len(email) > MAX_EMAIL_LEN or not EMAIL_RE.match(email):
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")
    if not message or len(message) > MAX_MESSAGE_LEN:
        raise HTTPException(status_code=400, detail=f"Please enter a message (up to {MAX_MESSAGE_LEN} characters).")

    try:
        send_contact_email(name, email, message, topic)
    except Exception:
        logger.exception("Failed to send contact form email")
        raise HTTPException(status_code=500, detail="Failed to send your message. Please try again later.")

    return {"status": "sent"}
