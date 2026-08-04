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
    """Send a contact-form submission to GMAIL_ADDRESS with automatic system theme adaptation (Light Mode & Dark Mode)."""
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
        topic_badge_bg = "#FFEBEE"
        topic_border = "#FF5D73"
        topic_color = "#D32F2F"
        topic_icon = "🐛"
    elif "Feature" in topic:
        topic_badge_bg = "#FFF8E1"
        topic_border = "#FFBE3D"
        topic_color = "#B78103"
        topic_icon = "💡"
    elif "Partner" in topic:
        topic_badge_bg = "#F3E8FF"
        topic_border = "#9B6DFF"
        topic_color = "#6B21A8"
        topic_icon = "🤝"
    else:
        topic_badge_bg = "#E0F7FA"
        topic_border = "#00C9FF"
        topic_color = "#00838F"
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

    # 2. System Theme Adaptive HTML Email Body (Light Theme & Dark Theme)
    html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>StupidPDF Contact Submission</title>
  <style type="text/css">
    :root {{
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }}

    /* DEFAULT LIGHT MODE THEME */
    body, .email-wrapper {{
      margin: 0;
      padding: 0;
      background-color: #F1F5F9 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A !important;
      -webkit-font-smoothing: antialiased;
    }}
    .email-card {{
      background-color: #FFFFFF !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
    }}
    .email-header {{
      background-color: #F8FAFC !important;
      border-bottom: 1px solid #E2E8F0 !important;
    }}
    .info-surface {{
      background-color: #F8FAFC !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 12px;
    }}
    .message-box {{
      background-color: #F8FAFC !important;
      border: 1.5px solid #00C9FF !important;
      border-radius: 12px;
      color: #0F172A !important;
    }}
    .text-title {{
      color: #0F172A !important;
    }}
    .text-muted {{
      color: #64748B !important;
    }}
    .reply-link {{
      color: #00838F !important;
    }}

    /* SYSTEM DARK MODE THEME (@media prefers-color-scheme: dark) */
    @media (prefers-color-scheme: dark) {{
      body, .email-wrapper {{
        background-color: #0B0F17 !important;
        color: #FFFFFF !important;
      }}
      .email-card {{
        background-color: #141A26 !important;
        border: 1px solid #2A3447 !important;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;
      }}
      .email-header {{
        background-color: #1A2233 !important;
        border-bottom: 1px solid #2A3447 !important;
      }}
      .info-surface {{
        background-color: #1E2738 !important;
        border: 1px solid #2D3A52 !important;
      }}
      .message-box {{
        background-color: #0F141F !important;
        border: 1.5px solid #14F195 !important;
        color: #FFFFFF !important;
      }}
      .text-title {{
        color: #FFFFFF !important;
      }}
      .text-muted {{
        color: #94A3B8 !important;
      }}
      .reply-link {{
        color: #14F195 !important;
      }}
    }}

    /* GMAIL DARK MODE OVERRIDES ([data-ogsc]) */
    [data-ogsc] body, [data-ogsc] .email-wrapper {{ background-color: #0B0F17 !important; color: #FFFFFF !important; }}
    [data-ogsc] .email-card {{ background-color: #141A26 !important; border: 1px solid #2A3447 !important; }}
    [data-ogsc] .email-header {{ background-color: #1A2233 !important; border-bottom: 1px solid #2A3447 !important; }}
    [data-ogsc] .info-surface {{ background-color: #1E2738 !important; border: 1px solid #2D3A52 !important; }}
    [data-ogsc] .message-box {{ background-color: #0F141F !important; border: 1.5px solid #14F195 !important; color: #FFFFFF !important; }}
    [data-ogsc] .text-title {{ color: #FFFFFF !important; }}
    [data-ogsc] .text-muted {{ color: #94A3B8 !important; }}
    [data-ogsc] .reply-link {{ color: #14F195 !important; }}
  </style>
</head>
<body className="email-wrapper">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" className="email-wrapper" style="padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; overflow: hidden; border-radius: 16px;" cellspacing="0" cellpadding="0" border="0" className="email-card">
          
          <!-- BRAND HEADER WITH ORIGINAL LOGO -->
          <tr>
            <td style="padding: 24px 28px;" className="email-header">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle">
                    <table cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 10px;">
                          <!-- Original StupidPDF Logo Image attached via CID -->
                          <img src="cid:stupidpdf_logo" alt="StupidPDF Logo" width="36" height="36" style="display: block; border-radius: 8px; border: none;" />
                        </td>
                        <td valign="middle">
                          <span style="font-size: 18px; font-weight: 800; letter-spacing: -0.01em;" className="text-title">
                            Stupid<span style="color: #14F195;">PDF</span>
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; padding: 5px 14px; background-color: rgba(20, 241, 149, 0.12); border: 1px solid #14F195; border-radius: 99px; font-size: 11px; font-weight: 800; color: #14F195; letter-spacing: 0.05em; text-transform: uppercase;">
                      ⚡ DISPATCH
                    </span>
                  </td>
                </tr>
              </table>

              <h1 style="margin: 16px 0 4px; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25;" className="text-title">
                New Contact Message
              </h1>
              <p style="margin: 0; font-size: 13px;" className="text-muted">
                Received on {timestamp}
              </p>
            </td>
          </tr>

          <!-- SENDER & TOPIC DETAILS -->
          <tr>
            <td style="padding: 24px 28px 16px;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="padding: 18px;" className="info-surface">
                <tr>
                  <td>
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <!-- Topic Line -->
                      <tr>
                        <td style="padding-bottom: 14px;">
                          <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 6px;" className="text-muted">
                            TOPIC CATEGORY
                          </span>
                          <span style="display: inline-block; padding: 6px 14px; background-color: {topic_badge_bg}; border: 1px solid {topic_border}; border-radius: 8px; font-size: 13px; font-weight: 800; color: {topic_color};">
                            {topic_icon} {safe_topic}
                          </span>
                        </td>
                      </tr>
                      <!-- Sender Info Grid -->
                      <tr>
                        <td style="padding-top: 14px; border-top: 1px solid rgba(128, 128, 128, 0.2);">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td width="50%" valign="top">
                                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 4px;" className="text-muted">
                                  SENDER NAME
                                </span>
                                <span style="font-size: 15px; font-weight: 800;" className="text-title">
                                  👤 {safe_name}
                                </span>
                              </td>
                              <td width="50%" valign="top">
                                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 4px;" className="text-muted">
                                  REPLY ADDRESS
                                </span>
                                <a href="mailto:{safe_email}" style="font-size: 14px; font-weight: 800; text-decoration: underline;" className="reply-link">
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

          <!-- USER MESSAGE CONTENT BOX -->
          <tr>
            <td style="padding: 0 28px 24px;">
              <span style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;" className="text-muted">
                USER MESSAGE CONTENT
              </span>
              <div style="padding: 20px; font-size: 15px; line-height: 1.6; font-weight: 500; word-break: break-word;" className="message-box">
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
            <td style="padding: 16px 28px; background-color: rgba(0, 0, 0, 0.05); border-top: 1px solid rgba(128, 128, 128, 0.15); text-align: center;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5;" className="text-muted">
                Sent via <strong className="text-title">StupidPDF Contact Gateway</strong>.<br/>
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
