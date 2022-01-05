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
	"max_basket" int NOT NULL,
	"basket_timelimit" int NOT NULL,
	"username" varchar(50) NOT NULL,
	
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
BEGIN;
INSERT INTO "account" VALUES ('admin', '$2b$10$VDqC/tAM2BZ/GIX2CuDtPOTptGgEZjZ9YI.IL2igb0qOK0VyWNHUS', 'admin', false);

INSERT INTO "account" VALUES ('manager', '$2b$10$ygjxelzrzamQxVDTMC8zyOmTS01JtlkOSD4SZjYgmW2tx.EML3jAq', 'manager', false);

INSERT INTO "account" VALUES ('ID_001', '$2b$10$UU/.rQwJRux4HLMqDue37OeY1S.BByJb7l3kI.noOeQ.PLu3v.DK6', 'user', false);
INSERT INTO "account" VALUES ('ID_002', '$2b$10$XXFLhavUekaG8AgYlPMA..ZuLZ3rmx/15lNC/oDiCTXLAZMXfct4m', 'user', false);
INSERT INTO "account" VALUES ('ID_003', '$2b$10$xHVqAckOGbDP8kuOtSt3Pu7iHO7xDSKRWWfIyhsDT2M4YuOXXcWGm', 'user', false);
INSERT INTO "account" VALUES ('ID_004', '$2b$10$Ct3W5S5H.9uUk2SBava.yOBYWQLRb0eg4K2gedKPfOMV3C6h96htq', 'user', false);
INSERT INTO "account" VALUES ('ID_005', '$2b$10$QigU8ZBUC5aKi318boewyuLabgQYdIo.k6I2FHTsgkQo8zFQJVeFK', 'user', false);
COMMIT;

-- -----------------------------
-- Table user
-- -----------------------------
BEGIN;
INSERT INTO "user" VALUES (DEFAULT, 'thin', 2000, 'Vietnam', 5, 1, 'ID_001');
INSERT INTO "user" VALUES (DEFAULT, 'duy', 1999, 'Vietnam', 5, 1, 'ID_002');
INSERT INTO "user" VALUES (DEFAULT, 'thy', 2001, 'Vietnam', 5, 1, 'ID_003');
INSERT INTO "user" VALUES (DEFAULT, 'nhan', 1998, 'Vietnam', 5, 1, 'ID_004');
INSERT INTO "user" VALUES (DEFAULT, 'trung', 2002, 'Vietnam', 5, 1, 'ID_005');
COMMIT;

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
-- INSERT "product" INTO VALUES (DEFAULT, 'Khẩu trang', 'hộp', 30000);
-- INSERT "product" INTO VALUES (DEFAULT, 'Nước rửa tay', 'chai', 40000);
-- INSERT "product" INTO VALUES (DEFAULT, 'Kem đánh răng', 'tuýp', 35000);
-- INSERT "product" INTO VALUES (DEFAULT, 'Bàn chải đánh răng', 'cái', 38000);
-- INSERT "product" INTO VALUES (DEFAULT, 'Khăn giấy', 'hộp', 20000);


-- -----------------------------
-- Table pack
-- -----------------------------
-- INSERT INTO "pack" VALUES (DEFAULT, 'Rau - củ - trái cây', 10);  -- Bắp cải, xà lách, nấm, khoai tây, cà rốt, cam, táo
-- INSERT INTO "pack" VALUES (DEFAULT, 'Thịt - cá - hải sản', 10);  -- thịt heo, thịt bò, thịt gà, trứng gà, cá, tôm, mực
-- INSERT INTO "pack" VALUES (DEFAULT, 'Đồ khô', 10)  -- cơm cháy, rong biển, mì gói, xúc xích, 
-- INSERT INTO "pack" VALUES (DEFAULT, 'Đồ uống', 10);  -- nước khoáng, trà xanh, pepsi, nước trái cây, cafe, trà sữa, mật ong
-- INSERT INTO "pack" VALUES (DEFAULT, 'Sữa uống', 10);  -- sữa tươi, sữa chua, sữa bột, sữa lúa mạch, ngũ cốc
-- INSERT INTO "pack" VALUES (DEFAULT, 'Đồ dùng cá nhân', 10);  -- Khẩu trang, nước rửa tay, kem đánh răng, bản chải, dầu gội đầu, sữa tắm
-- INSERT INTO "pack" VALUES (DEFAULT, 'Giặt rửa', 10);  -- nước rửa chén, bột giặt, nước xả quần áo






