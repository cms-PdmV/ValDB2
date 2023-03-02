import multiprocessing
import os

host = os.environ.get('HOST', '0.0.0.0')
port = os.environ.get('PORT', '8003')
bind = f"{host}:{port}"
workers = multiprocessing.cpu_count() * 2 + 1
