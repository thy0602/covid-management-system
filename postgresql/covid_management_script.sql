-- ======================================
-- Database name: covid_management
-- ======================================

-- ======================================
-- Drop table if exists
-- ======================================
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "relate" CASCADE;
DROP TABLE IF EXISTS "covid_record" CASCADE;
DROP TABLE IF EXISTS "quarantine_location" CASCADE;
DROP TABLE IF EXISTS "quarantine_location_record" CASCADE;
DROP TABLE IF EXISTS "product" CASCADE;
DROP TABLE IF EXISTS "product_image" CASCADE;
DROP TABLE IF EXISTS "pack" CASCADE;
DROP TABLE IF EXISTS "pack_items" CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS "order_pack" CASCADE;
DROP TABLE IF EXISTS "order_product" CASCADE;


-- ======================================
-- Create table
-- ======================================
-- -----------------------------
-- Table account
-- -----------------------------
CREATE TABLE "account" (
	"username" varchar(50) PRIMARY KEY, -- PRIMARYKEY <=> UNIQUE, NOT NULL
	"password" varchar(255),
	"role" varchar(10) NOT NULL,  -- manager/admin/user
	"is_deleted" boolean NOT NULL DEFAULT false
);

-- -----------------------------
-- Table user
-- -----------------------------
CREATE TABLE "user" (
	"id" serial PRIMARY KEY,
	"name" varchar(50) NOT NULL,
	"year_of_birth" int NOT NULL,
	"address" varchar NOT NULL,
	"max_baskets" int NOT NULL,
	"basket_timelimit" int NOT NULL,
	"username" varchar(50) NOT NULL,
	"current_status" varchar(10),
	"current_location" varchar(100),
	
 	FOREIGN KEY (username) REFERENCES account(username)
);

-- -----------------------------
-- Table relate
-- -----------------------------
CREATE TABLE "relate" (
	"user_id1" int NOT NULL,
	"user_id2" int NOT NULL,
	
	FOREIGN KEY (user_id1) REFERENCES "user"("id"),
	FOREIGN KEY (user_id2) REFERENCES "user"("id")
);

-- -----------------------------
-- Table covid_record
-- -----------------------------
CREATE TABLE "covid_record" (
	"id" serial PRIMARY KEY,
	"covid_status" varchar(10) NOT NULL, -- F0/F1/F2/F3
	"record_time" timestamp NOT NULL DEFAULT NOW(),
	"user_id" int NOT NULL,
	 
	FOREIGN KEY (user_id) REFERENCES "user"("id")
);

-- -----------------------------
-- Table quarantine_location
-- -----------------------------
CREATE TABLE "quarantine_location" (
	"id" serial PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"capacity" int NOT NULL,
	"occupancy" int NOT NULL
);

-- -----------------------------
-- Table quarantine_location_record
-- -----------------------------
CREATE TABLE "quarantine_location_record" (
	"id" serial PRIMARY KEY,
	"user_id" int NOT NULL,
	"location_id" int NOT NULL,
	"record_time" timestamp NOT NULL DEFAULT NOW(),
	
	FOREIGN KEY (user_id) REFERENCES "user"("id"),
	FOREIGN KEY (location_id) REFERENCES "quarantine_location"("id")
);

-- -----------------------------
-- Table product
-- -----------------------------
CREATE TABLE "product" (
	"id" serial PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"unit" varchar(10) NOT NULL,
	"price" numeric(19, 4) NOT NULL
);

-- -----------------------------
-- Table product_image
-- -----------------------------
CREATE TABLE "product_image" (
	"product_id" int NOT NULL,
	"url" varchar NOT NULL,
	
	PRIMARY KEY (product_id, url),
	FOREIGN KEY (product_id) REFERENCES "product"("id")
);

-- -----------------------------
-- Table pack
-- -----------------------------
CREATE TABLE "pack" (
	"id" serial PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"limit" int NOT NULL
);

-- -----------------------------
-- Table pack_items
-- -----------------------------
CREATE TABLE "pack_items" (
	"pack_id" int NOT NULL,
	"product_id" int NOT NULL,
	"quantity" int NOT NULL,
	
	PRIMARY KEY (pack_id, product_id),
	FOREIGN KEY (pack_id) REFERENCES "pack"("id"),
	FOREIGN KEY (product_id) REFERENCES "product"("id")
);

-- -----------------------------
-- Table order
-- -----------------------------
CREATE TABLE "order" (
	"id" serial PRIMARY KEY,
	"user_id" int NOT NULL,
	"order_at" timestamp DEFAULT NOW(),
	"paid_at" timestamp,
	
	FOREIGN KEY (user_id) REFERENCES "user"("id")
);

-- -----------------------------
-- Table order_pack
-- -----------------------------
CREATE TABLE "order_pack" (
	"order_id" int NOT NULL,
	"pack_id" int NOT NULL,
	"quantity" int NOT NULL,
	
	PRIMARY KEY (order_id, pack_id),
	FOREIGN KEY (order_id) REFERENCES "order"("id"),
	FOREIGN KEY (pack_id) REFERENCES "pack"("id")
);

-- -----------------------------
-- Table order_product
-- -----------------------------
CREATE TABLE "order_product" (
	"order_id" int NOT NULL,
	"product_id" int NOT NULL,
	"quantity" int NOT NULL,
	
	PRIMARY KEY (order_id, product_id),
	FOREIGN KEY (order_id) REFERENCES "order"("id"),
	FOREIGN KEY (product_id) REFERENCES "product"("id")
);

-- ======================================
-- Insert data (đang bổ sung)
-- ======================================
-- -----------------------------
-- Table account
-- -----------------------------
INSERT INTO "account"("username", "password", "role", "is_deleted")
VALUES
	('admin', '$2b$10$VDqC/tAM2BZ/GIX2CuDtPOTptGgEZjZ9YI.IL2igb0qOK0VyWNHUS', 'admin', false),
	('manager', '$2b$10$ygjxelzrzamQxVDTMC8zyOmTS01JtlkOSD4SZjYgmW2tx.EML3jAq', 'manager', false),
	('ID_001', '$2b$10$UU/.rQwJRux4HLMqDue37OeY1S.BByJb7l3kI.noOeQ.PLu3v.DK6', 'user', false),
	('ID_002', '$2b$10$XXFLhavUekaG8AgYlPMA..ZuLZ3rmx/15lNC/oDiCTXLAZMXfct4m', 'user', false),
	('ID_003', '$2b$10$xHVqAckOGbDP8kuOtSt3Pu7iHO7xDSKRWWfIyhsDT2M4YuOXXcWGm', 'user', false),
	('ID_004', '$2b$10$Ct3W5S5H.9uUk2SBava.yOBYWQLRb0eg4K2gedKPfOMV3C6h96htq', 'user', false),
	('ID_005', '$2b$10$QigU8ZBUC5aKi318boewyuLabgQYdIo.k6I2FHTsgkQo8zFQJVeFK', 'user', false);

-- -----------------------------
-- Table user
-- -----------------------------
INSERT INTO "user"("id", "name", "year_of_birth", "address", "max_baskets", "basket_timelimit", "username")
VALUES 
	(DEFAULT, 'thin', 2000, 'Vietnam', 5, 1, 'ID_001'),
	(DEFAULT, 'thin', 2000, 'Vietnam', 5, 1, 'ID_001'),
	(DEFAULT, 'duy', 1999, 'Vietnam', 5, 1, 'ID_002'),
	(DEFAULT, 'thy', 2001, 'Vietnam', 5, 1, 'ID_003'),
	(DEFAULT, 'nhan', 1998, 'Vietnam', 5, 1, 'ID_004'),
	(DEFAULT, 'trung', 2002, 'Vietnam', 5, 1, 'ID_005');

-- -----------------------------
-- Table relate
-- -----------------------------

-- -----------------------------
-- Table covid_record
-- -----------------------------

-- -----------------------------
-- Table quarantine_location
-- -----------------------------

-- -----------------------------
-- Table quaratine_location_record
-- -----------------------------

-- -----------------------------
-- Table product
-- -----------------------------
BEGIN;
INSERT INTO "product"("id", "name", "unit", "price")
VALUES 
    (DEFAULT, 'Bắp cải', 'gam', 500),
	(DEFAULT, 'Xà lách', 'gam', 500),
	(DEFAULT, 'Khoai tây', 'gam', 500),
	(DEFAULT, 'Cà rốt', 'gam', 500),
	(DEFAULT, 'Cam', 'gam', 500),
	(DEFAULT, 'Táo', 'gam', 500),
ROLLBACK;

INSERT INTO "product"("id", "name", "unit", "price")
VALUES 
	(DEFAULT, 'Thịt heo', 'gam', 1000),
	(DEFAULT, 'Thịt bò', 'gam', 1000),
	(DEFAULT, 'Thịt gà', 'gam', 1000),
	(DEFAULT, 'Trứng gà', 'gam', 1000),
	(DEFAULT, 'Cá', 'gam', 1000),
	(DEFAULT, 'Tôm', 'gam', 1000),
ROLLBACK;

INSERT INTO "product"("id", "name", "unit", "price")
VALUES 
	(DEFAULT, 'Cơm cháy', 'gói', 30000),
	(DEFAULT, 'Rong biển', 'gói', 25000),
	(DEFAULT, 'Mì gói', 'gói', 7000),
	(DEFAULT, 'Xúc xích', 'gói', 32000),
ROLLBACK;

INSERT INTO "product"("id", "name", "unit", "price")
VALUES 
	(DEFAULT, 'Nước khoáng', 'chai', 6000),
	(DEFAULT, 'Nước trái cây', 'chai', 12000),
	(DEFAULT, 'Mật ong', 'chai', 50000),
ROLLBACK;

INSERT INTO "product"("id", "name", "unit", "price")
VALUES 
	(DEFAULT, 'Sữa tươi', 'hộp', 10000),
	(DEFAULT, 'Sữa chua', 'hộp', 7000),
	(DEFAULT, 'Sữa lúa mạch', 'hộp', 12000),
	(DEFAULT, 'Sữa hạt', 'hộp', 20000),
ROLLBACK;

INSERT INTO "product"("id", "name", "unit", "price")
VALUES 
    (DEFAULT, 'Khẩu trang', 'hộp', 30000),
	(DEFAULT, 'Nước rửa tay', 'chai', 40000),
    (DEFAULT, 'Kem đánh răng', 'tuýp', 35000),
    (DEFAULT, 'Bàn chải đánh răng', 'cái', 38000),
    (DEFAULT, 'Dầu gội đầu', 'gói', 5000);
ROLLBACK;

INSERT INTO "product"("id", "name", "unit", "price")
VALUES 
	(DEFAULT, 'Nước rửa chén', 'chai', 32000),
	(DEFAULT, 'Bột giặt', 'gói', 35000),
	(DEFAULT, 'Nước xả quần áo', 'gói', 35000),
	(DEFAULT, 'Xà phòng', 'chai', 50000)
ROLLBACK;
COMMIT;


-- -----------------------------
-- Table pack
-- -----------------------------
-- INSERT INTO "pack"("id", "name", "limit")
-- VALUES 
--     (DEFAULT, 'Rau - củ - trái cây', 10),  -- Bắp cải, xà lách, nấm, khoai tây, cà rốt, cam, táo
--     (DEFAULT, 'Thịt - cá - hải sản', 10),  -- thịt heo, thịt bò, thịt gà, trứng gà, cá, tôm
--     (DEFAULT, 'Đồ khô', 10),  -- cơm cháy, rong biển, mì gói, xúc xích, 
--     (DEFAULT, 'Đồ uống', 10),  -- nước khoáng, nước trái cây, mật ong
--     (DEFAULT, 'Sữa uống', 10),  -- sữa tươi, sữa chua, sữa lúa mạch, sữa hạt
--     (DEFAULT, 'Đồ dùng cá nhân', 10),  -- Khẩu trang, nước rửa tay, kem đánh răng, bản chải, dầu gội đầu
--     (DEFAULT, 'Giặt rửa', 10);  -- nước rửa chén, bột giặt, nước xả quần áo, xà phòng
	
-- -----------------------------
-- Table pack_items
-- -----------------------------
-- INSERT INTO "pack_items"("pack_id", "product_id", "quantity")
-- VALUES
-- 	('1', )




