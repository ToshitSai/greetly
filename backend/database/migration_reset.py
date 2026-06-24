# backend/database/migration_reset.py
import os
import pymysql
from dotenv import load_dotenv

def run_migration_reset():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dotenv_path = os.path.join(base_dir, '.env')
    load_dotenv(dotenv_path)

    user = os.getenv('DB_USER', 'root')
    password = os.getenv('DB_PASSWORD', '')
    host = os.getenv('DB_HOST', 'localhost')
    port = int(os.getenv('DB_PORT', '3306'))
    db_name = os.getenv('DB_NAME', 'paper_plane_db')

    print(f"Connecting to MySQL database {db_name} to execute schema update...")
    conn = pymysql.connect(host=host, user=user, password=password, database=db_name, port=port)
    cursor = conn.cursor()

    cursor.execute("DESCRIBE customers")
    columns = [col[0] for col in cursor.fetchall()]

    if 'reset_token' not in columns:
        print("Adding 'reset_token' column to 'customers' table...")
        cursor.execute("ALTER TABLE customers ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL")
        conn.commit()

    if 'reset_token_expires' not in columns:
        print("Adding 'reset_token_expires' column to 'customers' table...")
        cursor.execute("ALTER TABLE customers ADD COLUMN reset_token_expires DATETIME DEFAULT NULL")
        conn.commit()

    print("Database schema update for password recovery completed successfully.")
    conn.close()

if __name__ == "__main__":
    run_migration_reset()
