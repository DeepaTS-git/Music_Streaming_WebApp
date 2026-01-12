from flask_mail import Message, Mail
from flask import current_app as app

mail = Mail()

def init_app(app):
    mail.init_app(app)

def send_email(subject, to, html_body):
    msg = Message(subject, sender="music@stream.com", html=html_body, recipients=[to])
    # msg = Message(subject, sender="music@stream.com", body=html_body, recipients=[to])
    mail.send(msg)
