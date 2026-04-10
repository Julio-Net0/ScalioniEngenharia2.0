"""Serviço de e-mail — abstração SMTP/SendGrid."""

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from backend.core.config import settings

logger = logging.getLogger(__name__)


async def _send_email(to_email: str, subject: str, html_body: str) -> None:
    """Envia e-mail via SMTP. Lança exceção em caso de falha."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.smtp_user
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:  # pragma: no cover
        server.ehlo()  # pragma: no cover
        server.starttls()  # pragma: no cover
        server.login(settings.smtp_user, settings.smtp_password)  # pragma: no cover
        server.sendmail(settings.smtp_user, to_email, msg.as_string())  # pragma: no cover


async def send_contact_confirmation(to_email: str, nome: str) -> None:
    """E-mail de confirmação para o lead que enviou mensagem."""
    subject = "Recebemos sua mensagem — Scalioni Engenharia"
    body = f"""
    <h2>Olá, {nome}!</h2>
    <p>Recebemos sua mensagem e entraremos em contato em breve.</p>
    <p>Atenciosamente,<br><strong>Scalioni Engenharia</strong></p>
    """
    await _send_email(to_email, subject, body)


async def send_contact_admin_notification(nome: str, email: str, mensagem: str) -> None:
    """Notificação ao admin sobre novo lead."""
    subject = f"Nova mensagem de contato: {nome}"
    body = f"""
    <h2>Nova mensagem de contato</h2>
    <p><strong>Nome:</strong> {nome}</p>
    <p><strong>E-mail:</strong> {email}</p>
    <p><strong>Mensagem:</strong></p>
    <blockquote>{mensagem}</blockquote>
    <p><a href="{settings.frontend_url}/admin/mensagens">Ver no painel</a></p>
    """
    await _send_email(settings.admin_email, subject, body)


async def send_download_email(to_email: str, nome: str, download_token: str) -> None:
    """E-mail com link de download após pagamento aprovado."""
    subject = "Seu arquivo está pronto — Scalioni Engenharia"
    download_url = f"{settings.frontend_url}/api/download/{download_token}"
    body = f"""
    <h2>Olá, {nome}!</h2>
    <p>Seu pagamento foi confirmado. Baixe sua planta pelo link abaixo:</p>
    <p><a href="{download_url}" style="color:#C9A55A; font-weight:bold;">Baixar arquivo (válido por 72h)</a></p>
    <p>Atenciosamente,<br><strong>Scalioni Engenharia</strong></p>
    """
    await _send_email(to_email, subject, body)


async def send_payment_failed_email(email: str, nome: str) -> None:
    """E-mail notificando falha/cancelamento do pagamento."""
    subject = "Problema com seu pagamento — Scalioni Engenharia"
    retry_url = f"{settings.frontend_url}/loja"
    body = f"""
    <h2>Olá, {nome}!</h2>
    <p>Houve um problema com seu pagamento. Tente novamente:</p>
    <p><a href="{retry_url}" style="color:#C9A55A; font-weight:bold;">Tentar novamente</a></p>
    <p>Atenciosamente,<br><strong>Scalioni Engenharia</strong></p>
    """
    await _send_email(email, subject, body)
