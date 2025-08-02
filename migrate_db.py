import mysql.connector
from mysql.connector import Error

def migrate_database():
    try:
        # Connect to MySQL database
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="admd204519",
            database="ai_leads"
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Check if columns already exist
            cursor.execute("SHOW COLUMNS FROM user LIKE 'reset_token'")
            reset_token_exists = cursor.fetchone()
            
            cursor.execute("SHOW COLUMNS FROM user LIKE 'reset_token_expires'")
            reset_token_expires_exists = cursor.fetchone()
            
            # Add reset_token column if it doesn't exist
            if not reset_token_exists:
                cursor.execute("ALTER TABLE user ADD COLUMN reset_token VARCHAR(255) NULL")
                print("Added reset_token column")
            
            # Add reset_token_expires column if it doesn't exist
            if not reset_token_expires_exists:
                cursor.execute("ALTER TABLE user ADD COLUMN reset_token_expires DATETIME NULL")
                print("Added reset_token_expires column")
            
            # Commit the changes
            connection.commit()
            print("Database migration completed successfully!")
            
    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("Database connection closed.")

if __name__ == "__main__":
    migrate_database() 