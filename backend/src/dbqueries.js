const pool = require('./config/db');

// 1. Users
let createUserTable = pool.query(`

        CREATE TABLE If NOT EXISTS users(
        
        user_id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) NOT NULL,
        joined_on TIMESTAMP DEFAULT NOW(),

        api_key VARCHAR(50) DEFAULT NULL,
        api_secret VARCHAR(255) UNIQUE DEFAULT NULL,
        api_created_on TIMESTAMP DEFAULT NULL, 
        api_expiry TIMESTAMP DEFAULT NULL,

        callback_url VARCHAR(255) UNIQUE DEFAULT NULL,
        callback_secret VARCHAR(255) UNIQUE DEFAULT NULL,
        callback_secret_created_on TIMESTAMP;

        tier INT DEFAULT 0, 
        kyc_status BOOLEAN NOT NULL DEFAULT FALSE,
        isActive BOOLEAN DEFAULT FALSE
        is_api_generated BOOLEAN DEFAULT FALSE
        );
    `)

let createCompanyTable = pool.query(`

    CREATE TABLE If NOT EXISTS company(
    
    user_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(350) DEFAULT NULL,
    logo VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    support_email VARCHAR(255) DEFAULT NULL,
    valid_id VARCHAR(255) DEFAULT NULL,
    mobile VARCHAR(255) DEFAULT NULL,
    support_mobile VARCHAR(255) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    country VARCHAR(255) DEFAULT NULL,
    company_identification_no VARCHAR(255) DEFAULT NULL,
    tax_number VARCHAR(255) DEFAULT NULL,
    
    total_fees_collected DECIMAL DEFAULT 0, 
    currency VARCHAR(6) DEFAULT 'USD',
    
    total_volume DECIMAL DEFAULT 0, 
    txs_count INT DEFAULT 0, 

    last_payment TIMESTAMP DEFAULT NULL,
    valid_till TIMESTAMP DEFAULT NULL,
    
    other VARCHAR(255) DEFAULT NULL,
    free_activated bool DEFAULT false,

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
`)

// 3. Payment Sessions
let createPaymentSessionTable = pool.query(`

    CREATE TABLE If NOT EXISTS paymentSession(
    
    session_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NULL,
    amount DECIMAL NOT NULL,
    domain VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(350) NOT NULL,
    
    token TEXT ARRAY NOT NULL,
    blockchain TEXT ARRAY NOT NULL,
    payment_status VARCHAR(50)   NOT NULL DEFAULT 'initiated',
    wallet_address VARCHAR(255) NOT NULL,
    blockchain_confirmation INT NOT NULL DEFAULT 2,
    
    temp_wallet_address VARCHAR(255) DEFAULT NULL,
    temp_wallet_salt VARCHAR(255) DEFAULT NULL,
    
    redirect_url VARCHAR(255) DEFAULT NULL,
    cancel_url VARCHAR(255) DEFAULT NULL,
    webhook_url VARCHAR(255) DEFAULT NULL,
    other VARCHAR(255) DEFAULT NULL,

    is_coupon_applied BOOL DEFAULT FALSE,
    coupon_code VARCHAR(50) DEFAULT null,
    amount_after_coupon DECIMAL DEFAULT NULL,

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
`)

// 4 Transactions.
let createTransactionsTable = pool.query(`

    CREATE TABLE If NOT EXISTS transactions(
    
    transaction_id UUID PRIMARY KEY,

    user_id VARCHAR(50) NOT NULL,
    session_id VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    transaction_hash VARCHAR(255) NOT NULL,
    
    deploy_contract_hash VARCHAR(255) default NULL,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    amount DECIMAL NOT NULL,
    from_wallet_address VARCHAR(255) NOT NULL,
    to_wallet_address VARCHAR(255) NOT NULL,
    token VARCHAR(50) NOT NULL,
    blockchain VARCHAR(50) NOT NULL,
    
    
    coupon_code VARCHAR(50) default NULL,

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES paymentSession(session_id) ON DELETE CASCADE
    );
`)

// 5 Coupons.
let createCouponsTable = pool.query(`

    CREATE TABLE If NOT EXISTS coupon(
    
    coupon_id UUID PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    coupon_code VARCHAR(50) NOT NULL,
    
    discount_type INT NOT NULL DEFAULT 0,
    discount_value DECIMAL NOT NULL,
    
    usage_limit INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    
    min_order DECIMAL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NULL,
    
    start_date TIMESTAMP DEFAULT NULL,
    end_date TIMESTAMP DEFAULT NULL,
    

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
`)

// 6. User Payment History
let createUserPaymentHistoryTable = pool.query(`

    CREATE TABLE If NOT EXISTS paymentHistory(
    
    
    payment_id UUID PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP DEFAULT NULL,

    amount DECIMAL DEFAULT 0,
    transaction_id UUID, 

    is_refunded BOOLEAN DEFAULT FALSE,      
    refund_date TIMESTAMP DEFAULT NULL, 

    start_date TIMESTAMP DEFAULT NULL,
    end_date TIMESTAMP DEFAULT NULL,
    service_description VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255),

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
`)

// OTP table 
let createOTPTable = pool.query(`

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS userOTP (
        uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        OTP VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '15 minutes'
    );
`)