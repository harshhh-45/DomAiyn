import psycopg2
import os
from decouple import config

def test_connection():
    try:
        host = config('DB_HOST')
        port = config('DB_PORT', default='5432')
        username = config('DB_USER')
        password = config('DB_PASSWORD')
        database = config('DB_NAME', default='postgres')
        
        print(f"Attempting to connect to: {host}")
        print(f"User: {username}")
        print(f"Database: {database}")
        print(f"Port: {port}")
        
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=username,
            password=password,
            dbname=database,
            sslmode='require'
        )
        print("✅ Connection successful!")
        conn.close()
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_connection()
