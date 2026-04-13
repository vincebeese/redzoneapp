-- Migration 019: Reset vince@vincebeese.com password to a known value
-- Password: RedZone2026!
UPDATE users
SET password_hash = '$2b$12$MYarzICiZJWA8sSt4xfyf./ZDdXmkNFT7Q7NyXQKLRASXHTQHceuS'
WHERE email = 'vince@vincebeese.com';
