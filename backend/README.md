# Banking Backend Setup Guide

This guide walks you through preparing the FastAPI banking backend with a fresh MySQL database using MySQL Workbench.

## 1. Prerequisites

1. **MySQL Server** running locally or accessible remotely.
2. **MySQL Workbench** for database management.
3. **Python 3.11+** (match the project requirement) with the ability to create virtual environments.

## 2. Create and Configure the Database

1. Open **MySQL Workbench** and connect using a user with `CREATE DATABASE` privileges.
2. Run the following SQL to create the schema and switch into it:

   ```sql
   CREATE DATABASE IF NOT EXISTS banking
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;

   USE banking;
   ```
3. (Optional but recommended) create a dedicated app user and grant privileges:

   ```sql
   CREATE USER IF NOT EXISTS 'banking_app'@'localhost' IDENTIFIED BY 'strong_password';
   GRANT ALL PRIVILEGES ON banking.* TO 'banking_app'@'localhost';
   FLUSH PRIVILEGES;
   ```
4. Paste and run the schema definition below to create tables that align with the SQLAlchemy models in `app/db/models.py`:

   ```sql
   -- drop existing objects if you are resetting the database
   DROP TABLE IF EXISTS audit_log;
   DROP TABLE IF EXISTS transaction;
   DROP TABLE IF EXISTS transfer;
   DROP TABLE IF EXISTS account;
   DROP TABLE IF EXISTS user;

   DROP TYPE IF EXISTS user_role_enum;
   DROP TYPE IF EXISTS account_status_enum;
   DROP TYPE IF EXISTS account_type_enum;
   DROP TYPE IF EXISTS transaction_type_enum;
   DROP TYPE IF EXISTS transfer_status_enum;

   CREATE TYPE user_role_enum AS ENUM ('customer', 'admin');
   CREATE TYPE account_status_enum AS ENUM ('active', 'frozen', 'closed');
   CREATE TYPE account_type_enum AS ENUM ('checking', 'savings', 'credit');
   CREATE TYPE transaction_type_enum AS ENUM ('deposit', 'withdrawal', 'transfer_in', 'transfer_out');
   CREATE TYPE transfer_status_enum AS ENUM ('pending', 'completed', 'failed');

   CREATE TABLE user (
     id            INT AUTO_INCREMENT PRIMARY KEY,
     email         VARCHAR(255) NOT NULL UNIQUE,
     full_name     VARCHAR(255) NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     role          user_role_enum NOT NULL DEFAULT 'customer',
     is_active     BOOLEAN NOT NULL DEFAULT TRUE,
     created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   ) ENGINE = InnoDB;

   CREATE TABLE account (
     id              INT AUTO_INCREMENT PRIMARY KEY,
     user_id         INT NOT NULL,
     account_number  VARCHAR(20) NOT NULL UNIQUE,
     account_type    account_type_enum NOT NULL DEFAULT 'checking',
     balance         DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
     currency        VARCHAR(3) NOT NULL DEFAULT 'USD',
     status          account_status_enum NOT NULL DEFAULT 'active',
     created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     INDEX idx_account_user (user_id),
     CONSTRAINT fk_account_user FOREIGN KEY (user_id) REFERENCES user (id)
   ) ENGINE = InnoDB;

   CREATE TABLE transfer (
     id               INT AUTO_INCREMENT PRIMARY KEY,
     from_account_id  INT NOT NULL,
     to_account_id    INT NOT NULL,
     amount           DECIMAL(12, 2) NOT NULL,
     reference        VARCHAR(100),
     status           transfer_status_enum NOT NULL DEFAULT 'completed',
     created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     CONSTRAINT fk_transfer_from FOREIGN KEY (from_account_id) REFERENCES account (id),
     CONSTRAINT fk_transfer_to   FOREIGN KEY (to_account_id)   REFERENCES account (id)
   ) ENGINE = InnoDB;

   CREATE TABLE transaction (
     id                   INT AUTO_INCREMENT PRIMARY KEY,
     account_id           INT NOT NULL,
     tx_type              transaction_type_enum NOT NULL,
     amount               DECIMAL(12, 2) NOT NULL,
     description          VARCHAR(255) DEFAULT NULL,
     counterparty_account VARCHAR(20) DEFAULT NULL,
     balance_after        DECIMAL(12, 2) NOT NULL,
     initiated_by         INT NOT NULL,
     transfer_id          INT DEFAULT NULL,
     created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     INDEX idx_tx_account (account_id),
     INDEX idx_tx_transfer (transfer_id),
     CONSTRAINT fk_tx_account FOREIGN KEY (account_id) REFERENCES account (id),
     CONSTRAINT fk_tx_initiator FOREIGN KEY (initiated_by) REFERENCES user (id),
     CONSTRAINT fk_tx_transfer FOREIGN KEY (transfer_id) REFERENCES transfer (id)
   ) ENGINE = InnoDB;

   CREATE TABLE audit_log (
     id         INT AUTO_INCREMENT PRIMARY KEY,
     user_id    INT NOT NULL,
     action     VARCHAR(100) NOT NULL,
     entity     VARCHAR(100) NOT NULL,
     entity_id  VARCHAR(36) NOT NULL,
     metadata   TEXT,
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     INDEX idx_audit_user (user_id),
     CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES user (id)
   ) ENGINE = InnoDB;
   ```
5. Refresh the **Schemas** panel to confirm the `banking` schema now contains all tables.

## 3. Configure the Backend Environment

1. In the `backend` directory create and activate a virtual environment, then install dependencies:

   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Create a `.env` file beside `requirements.txt` with the database credentials and defaults:

   ```env
   MYSQL_USER=banking_app
   MYSQL_PASSWORD=strong_password
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DB=banking
   ```

   Adjust the values if you used different credentials or host details.

## 4. Run the FastAPI Backend

1. Ensure the virtual environment is active.
2. Start the application:

   ```bash
   uvicorn app.main:app --reload
   ```
3. Open the interactive docs at [http://127.0.0.1:8000/api/v1/docs](http://127.0.0.1:8000/api/v1/docs) to verify the API can reach the MySQL database.

## 5. Optional Next Steps

- Insert an admin user and sample accounts using SQL or API routes.
- Add additional migration scripts in a `migrations/` directory if you plan to version database changes.
- Update the frontend environment to point at the backend base URL once you deploy both services.
