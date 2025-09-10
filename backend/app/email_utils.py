import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logger = logging.getLogger(__name__)

SMTP_SERVER = "smtp.gmail.com"  # ou smtp.office365.com, ou ton serveur
SMTP_PORT = 587
SMTP_USER = "ton.email@gmail.com"  # ton email
SMTP_PASSWORD = "ton_mot_de_passe_application"  # mot de passe d'application sécurisé

def send_email(to_email: str, subject: str, body: str):
    try:
        # Création du message
        msg = MIMEMultipart()
        msg["From"] = SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        # Connexion au serveur SMTP
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server
