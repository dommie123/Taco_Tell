import os

from flask import g, request
from app import app
from db import db
from dotenv import load_dotenv

db.init_app(app)

load_dotenv()

@app.before_request
def create_tables():
    if not getattr(g, '_initialized', False):
        db.create_all()
        g._initialized = True
    
@app.before_request
def log_request():
    with open('access.log', 'a') as log:
        log.write(f"{request.remote_addr} - {request.method} {request.path}\n")

app.run(host=os.getenv("SERVER_IP"), port=5000, debug=True)
