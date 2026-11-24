-- ============================================================
-- BloodBond - Step 3A - Demo Admin login
-- Run this ONCE in SSMS (Windows Authentication, localhost).
-- ============================================================
-- WHY: The demo admin user (admin@bloodbond.test) from the Step 1
-- seed data has a placeholder password hash, so it cannot log in.
-- This file sets a real bcrypt password hash and approves the account.
--
-- The demo password is written in README_STEP3.md (Demo Admin login).
-- DEMO ONLY - change it after testing, before any real use.
-- ============================================================

USE BloodBond;
GO

UPDATE dbo.Users
SET PasswordHash = N'$2a$10$XSl5wPsxO6k4CAI5xmUDMuQ7vamZDCE6LV/m/LrixuW0zVya.fgt6',
    Status = N'Approved'
WHERE Email = N'admin@bloodbond.test';
GO

-- Check: 1 row, Status = Approved
SELECT UserID, FullName, Email, Role, Status
FROM dbo.Users
WHERE Email = N'admin@bloodbond.test';
GO
