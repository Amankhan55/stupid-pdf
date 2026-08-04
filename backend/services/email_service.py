import html
import os
import smtplib
from datetime import datetime
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

GMAIL_ADDRESS = os.getenv("GMAIL_ADDRESS", "")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")

# Path to the original StupidPDF logo image
LOGO_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "logo.png")
)


def send_contact_email(name: str, sender_email: str, message: str, topic: str = "General Question") -> None:
    """Send a contact-form submission to GMAIL_ADDRESS with maximum contrast & readability for Gmail dark/light modes."""
    if not GMAIL_ADDRESS or not GMAIL_APP_PASSWORD:
        raise RuntimeError("Email sending is not configured (missing GMAIL_ADDRESS/GMAIL_APP_PASSWORD).")

    # Clean up topic & message text
    clean_message = message.strip()
    if clean_message.startswith("[Topic:"):
        first_line, _, rest = clean_message.partition("\n\n")
        if not topic or topic == "General Question":
            topic = first_line.replace("[Topic:", "").replace("]", "").strip()
        clean_message = rest.strip() if rest.strip() else clean_message

    if not topic:
        topic = "General Question"

    safe_name = html.escape(name)
    safe_email = html.escape(sender_email)
    safe_topic = html.escape(topic)
    safe_message = html.escape(clean_message).replace("\n", "<br/>")
    timestamp = datetime.now().strftime("%B %d, %Y at %I:%M %p")

    # Topic badge styling
    if "Bug" in topic:
        topic_badge_bg = "#3D1720"
        topic_border = "#FF5D73"
        topic_color = "#FF8093"
        topic_icon = "🐛"
    elif "Feature" in topic:
        topic_badge_bg = "#3D2B10"
        topic_border = "#FFBE3D"
        topic_color = "#FFD166"
        topic_icon = "💡"
    elif "Partner" in topic:
        topic_badge_bg = "#2B1A4A"
        topic_border = "#9B6DFF"
        topic_color = "#B894FF"
        topic_icon = "🤝"
    else:
        topic_badge_bg = "#0D3342"
        topic_border = "#00C9FF"
        topic_color = "#4DE1FF"
        topic_icon = "💬"

    msg = MIMEMultipart("related")
    msg["From"] = f"StupidPDF Dispatch <{GMAIL_ADDRESS}>"
    msg["To"] = GMAIL_ADDRESS
    msg["Reply-To"] = sender_email
    msg["Subject"] = f"⚡ [{topic}] New Message from {name} via StupidPDF"

    msg_alternative = MIMEMultipart("alternative")
    msg.attach(msg_alternative)

    # 1. Plain Text Fallback
    plain_text = f"""
======================================================
STUPIDPDF CONTACT DISPATCH
======================================================

Topic: {topic}
From: {name} ({sender_email})
Date: {timestamp}

------------------------------------------------------
MESSAGE CONTENT:
------------------------------------------------------
{clean_message}

------------------------------------------------------
Reply directly to this email to respond to {name}.
======================================================
"""

    # 2. Maximum Readability HTML Email Body (Gmail Dark Mode Safe)
    html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <title>StupidPDF Contact Submission</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0F17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0B0F17; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #141A26; border: 1px solid #2A3447; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- BRAND HEADER -->
          <tr>
            <td style="padding: 24px 28px; background-color: #1A2233; border-bottom: 1px solid #2A3447;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle">
                    <table cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 10px;">
                          <!-- Original Logo Image -->
                          <img src="cid:stupidpdf_logo" alt="StupidPDF Logo" width="36" height="36" style="display: block; border-radius: 8px; border: none;" />
                        </td>
                        <td valign="middle">
                          <span style="font-size: 18px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.01em;">
                            Stupid<span style="color: #14F195;">PDF</span>
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; padding: 5px 14px; background-color: #0A3A27; border: 1px solid #14F195; border-radius: 99px; font-size: 11px; font-weight: 800; color: #14F195; letter-spacing: 0.05em; text-transform: uppercase;">
                      ⚡ DISPATCH
                    </span>
                  </td>
                </tr>
              </table>

              <h1 style="margin: 16px 0 4px; font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em; line-height: 1.25;">
                New Contact Message
              </h1>
              <p style="margin: 0; font-size: 13px; color: #CBD5E1;">
                Received on {timestamp}
              </p>
            </td>
          </tr>

          <!-- SENDER & TOPIC DETAILS -->
          <tr>
            <td style="padding: 24px 28px 16px;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1E2738; border: 1px solid #2D3A52; border-radius: 12px; padding: 18px;">
                <tr>
                  <td>
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <!-- Topic Line -->
                      <tr>
                        <td style="padding-bottom: 14px;">
                          <span style="font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 6px;">
                            TOPIC CATEGORY
                          </span>
                          <span style="display: inline-block; padding: 6px 14px; background-color: {topic_badge_bg}; border: 1px solid {topic_border}; border-radius: 8px; font-size: 13px; font-weight: 800; color: {topic_color};">
                            {topic_icon} {safe_topic}
                          </span>
                        </td>
                      </tr>
                      <!-- Sender Info Grid -->
                      <tr>
                        <td style="padding-top: 14px; border-top: 1px solid #2D3A52;">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td width="50%" valign="top">
                                <span style="font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 4px;">
                                  SENDER NAME
                                </span>
                                <span style="font-size: 15px; font-weight: 800; color: #FFFFFF;">
                                  👤 {safe_name}
                                </span>
                              </td>
                              <td width="50%" valign="top">
                                <span style="font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 4px;">
                                  REPLY ADDRESS
                                </span>
                                <a href="mailto:{safe_email}" style="font-size: 14px; font-weight: 800; color: #14F195; text-decoration: underline;">
                                  ✉️ {safe_email}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- USER MESSAGE CONTENT BOX (High Contrast White Text on Solid Dark Background) -->
          <tr>
            <td style="padding: 0 28px 24px;">
              <span style="display: block; font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">
                USER MESSAGE CONTENT
              </span>
              <div style="background-color: #0F141F; border: 1.5px solid #14F195; border-radius: 12px; padding: 20px; font-size: 15px; line-height: 1.6; color: #FFFFFF; font-weight: 500; word-break: break-word;">
                {safe_message}
              </div>
            </td>
          </tr>

          <!-- CTA REPLY BUTTON -->
          <tr>
            <td style="padding: 0 28px 28px;" align="center">
              <a href="mailto:{safe_email}?subject=Re:%20StupidPDF%20[{safe_topic}]" style="display: inline-block; padding: 14px 32px; background-color: #14F195; border-radius: 10px; font-size: 15px; font-weight: 900; color: #0B0F17; text-decoration: none; letter-spacing: 0.01em;">
                Reply to {safe_name} →
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 16px 28px; background-color: #0F141F; border-top: 1px solid #2A3447; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94A3B8; line-height: 1.5;">
                Sent via <strong style="color: #FFFFFF;">StupidPDF Contact Gateway</strong>.<br/>
                Files processed in-memory. Zero persistent data storage.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    msg_alternative.attach(MIMEText(plain_text, "plain"))
    msg_alternative.attach(MIMEText(html_body, "html"))

    # Attach original StupidPDF logo image as inline CID attachment
    if os.path.exists(LOGO_PATH):
        try:
            with open(LOGO_PATH, "rb") as f:
                img_data = f.read()
            img = MIMEImage(img_data, name="logo.png")
            img.add_header("Content-ID", "<stupidpdf_logo>")
            img.add_header("Content-Disposition", "inline", filename="logo.png")
            msg.attach(img)
        except Exception:
            pass

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        server.send_message(msg)
