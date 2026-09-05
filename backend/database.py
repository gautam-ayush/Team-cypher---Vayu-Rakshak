# ====================================================
# Vayu Rakshak — Python SQL Database Manager (SQLite3)
# ====================================================
import sqlite3
import os
from datetime import datetime

# Database file path
DB_PATH = os.path.join(os.path.dirname(__file__), "vayu_rakshak.db")

def get_connection():
    """Establish connection to SQLite database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database tables with relational SQL schema."""
    conn = get_connection()
    cursor = conn.cursor()

    # 1. User Profiles Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age_group TEXT NOT NULL,
        health_condition TEXT NOT NULL,
        custom_condition TEXT,
        occupation TEXT NOT NULL,
        custom_occupation TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. AQI & Environmental Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS aqi_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        aqi INTEGER NOT NULL,
        pm25 REAL,
        pm10 REAL,
        temperature REAL,
        uv_index REAL,
        risk_score INTEGER,
        risk_level TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 3. AI Chat History Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT DEFAULT 'User',
        role TEXT NOT NULL, -- 'user' or 'model'
        message TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 4. Red Alert Triggers Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        alert_reason TEXT NOT NULL,
        triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()
    print("Database tables initialized successfully at:", DB_PATH)

def save_profile(name, age_group, condition, custom_condition="", occupation="office", custom_occupation=""):
    """Insert or update user profile in SQL database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO profiles (name, age_group, health_condition, custom_condition, occupation, custom_occupation, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (name, age_group, condition, custom_condition, occupation, custom_occupation, datetime.now().isoformat()))
    conn.commit()
    conn.close()
    print(f"Profile saved for: {name}")

def log_aqi(city, lat, lng, aqi, pm25=0, pm10=0, temp=0, uv=0, risk_score=0, risk_level="NORMAL"):
    """Log AQI and weather observation in SQL database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO aqi_logs (city, latitude, longitude, aqi, pm25, pm10, temperature, uv_index, risk_score, risk_level, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (city, lat, lng, aqi, pm25, pm10, temp, uv, risk_score, risk_level, datetime.now().isoformat()))
    
    # Trigger Red Alert log if risk_score > 75
    if risk_score > 75:
        cursor.execute("""
        INSERT INTO alerts (city, risk_score, alert_reason, triggered_at)
        VALUES (?, ?, ?, ?)
        """, (city, risk_score, f"Critical Risk Score {risk_score}/100 exceeded threshold at AQI {aqi}", datetime.now().isoformat()))

    conn.commit()
    conn.close()

def save_chat_message(role, message, user_name="User"):
    """Save user or AI chat message in SQL database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO chat_history (user_name, role, message, timestamp)
    VALUES (?, ?, ?, ?)
    """, (user_name, role, message, datetime.now().isoformat()))
    conn.commit()
    conn.close()

def get_recent_aqi_logs(limit=10):
    """Retrieve recent AQI logs from SQL database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM aqi_logs ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def get_chat_history(limit=20):
    """Retrieve chat history from SQL database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM chat_history ORDER BY timestamp ASC LIMIT ?", (limit,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def get_red_alerts(limit=5):
    """Retrieve active Red Alerts from SQL database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts ORDER BY triggered_at DESC LIMIT ?", (limit,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

# Run database setup & test queries
if __name__ == "__main__":
    init_db()
    save_profile("Demo User", "adult", "asthma", "Mild Asthma", "outdoor", "Site Supervisor")
    log_aqi("New Delhi", 28.6139, 77.2090, 185, pm25=112.5, pm10=140.2, temp=34, uv=8, risk_score=85, risk_level="VERY HIGH")
    save_chat_message("user", "Is it safe to run outdoors?")
    save_chat_message("model", "High AQI (185) detected in New Delhi. Minimize outdoor exertion.")
    
    print("\n--- Recent SQL AQI Logs ---")
    for log in get_recent_aqi_logs(3):
        print(dict(log))

    print("\n--- Recent SQL Red Alerts ---")
    for alert in get_red_alerts(3):
        print(dict(alert))
