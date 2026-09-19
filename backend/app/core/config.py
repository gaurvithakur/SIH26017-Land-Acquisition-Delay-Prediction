import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://landpredict:landpredict123@localhost:5432/landpredict"
)
