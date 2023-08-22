import dotenv
import os

# Load environment variables
# from .env file
dotenv.load_dotenv()

host = os.environ.get("HOST", "0.0.0.0")
port = os.environ.get("PORT", "8003")
bind = f"{host}:{port}"
workers = 1
