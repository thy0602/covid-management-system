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
	"price" numeric(19, 4) NOT NULL,
	"is_deleted" boolean NOT NULL DEFAULT false
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
	"limit" int NOT NULL,
	"is_deleted" boolean NOT NULL DEFAULT false
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
INSERT INTO "user"("id", "name", "year_of_birth", "address", "max_basket", "basket_timelimit", "username")
VALUES 
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
	(DEFAULT, 'Thịt heo', 'gam', 1000),
	(DEFAULT, 'Thịt bò', 'gam', 1000),
	(DEFAULT, 'Thịt gà', 'gam', 1000),
	(DEFAULT, 'Trứng gà', 'gam', 1000),
	(DEFAULT, 'Cá', 'gam', 1000),
	(DEFAULT, 'Tôm', 'gam', 1000),
	(DEFAULT, 'Cơm cháy', 'gói', 30000),
	(DEFAULT, 'Rong biển', 'gói', 25000),
	(DEFAULT, 'Mì gói', 'gói', 7000),
	(DEFAULT, 'Xúc xích', 'gói', 32000),
	(DEFAULT, 'Nước khoáng', 'chai', 6000),
	(DEFAULT, 'Nước trái cây', 'chai', 12000),
	(DEFAULT, 'Mật ong', 'chai', 50000),
	(DEFAULT, 'Sữa tươi', 'hộp', 10000),
	(DEFAULT, 'Sữa chua', 'hộp', 7000),
	(DEFAULT, 'Sữa lúa mạch', 'hộp', 12000),
	(DEFAULT, 'Sữa hạt', 'hộp', 20000),
    (DEFAULT, 'Khẩu trang', 'hộp', 30000),
	(DEFAULT, 'Nước rửa tay', 'chai', 40000),
    (DEFAULT, 'Kem đánh răng', 'tuýp', 35000),
    (DEFAULT, 'Bàn chải đánh răng', 'cái', 38000),
    (DEFAULT, 'Dầu gội đầu', 'gói', 5000),
	(DEFAULT, 'Nước rửa chén', 'chai', 32000),
	(DEFAULT, 'Bột giặt', 'gói', 35000),
	(DEFAULT, 'Nước xả quần áo', 'gói', 35000),
	(DEFAULT, 'Xà phòng', 'hộp', 50000);
COMMIT;


-- -----------------------------
-- Table pack
-- -----------------------------
BEGIN;
INSERT INTO "pack"("id", "name", "limit")
VALUES
	(DEFAULT, 'Gói thực phẩm 1', 6),
	(DEFAULT, 'Gói đồ dùng 1', 6),
	(DEFAULT, 'Gói tổng hợp 1', 5);
COMMIT;
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
BEGIN;
INSERT INTO "pack_items"("pack_id", "product_id", "quantity")
VALUES
	('1', '1', 2),
	('1', '2', 2),
	('1', '3', 1),
	('1', '4', 1),
	('1', '5', 1),
	('2', '24', 2),
	('2', '25', 2),
	('2', '26', 2),
	('3', '2', 2),
	('3', '3', 2),
	('3', '24', 2),
	('3', '25', 2);
COMMIT;


-- -----------------------------
-- Table product_image
-- -----------------------------
BEGIN;
INSERT INTO "product_image"("product_id", "url")
VALUES 
    ('1', 'img/products/bap-cai-1.jpg'),
    ('1', 'img/products/bap-cai-2.jpg'),
	('2', 'img/products/xa-lach-1.jpg'),
	('2', 'img/products/xa-lach-2.jpg'),
	('3', 'img/products/khoai-tay-1.jpg'),
	('3', 'img/products/khoai-tay-2.jpg'),
	('4', 'img/products/ca-rot-1.jpg'),
	('4', 'img/products/ca-rot-2.jpg'),
	('5', 'img/products/cam-1.jpg'),
	('5', 'img/products/cam-2.jpg'),
	('6', 'img/products/tao-1.jpg'),
	('6', 'img/products/tao-2.jpg'),
	('7', 'img/products/thit-heo-1.jpg'),
	('7', 'img/products/thit-heo-2.jpg'),
	('8', 'img/products/thit-bo-1.jpg'),
	('8', 'img/products/thit-bo-2.jpg'),
	('9', 'img/products/thit-ga-1.jpg'),
	('9', 'img/products/thit-ga-2.jpg'),
	('10', 'img/products/trung-ga-1.jpg'),
	('10', 'img/products/trung-ga-2.jpg'),
	('11', 'img/products/ca-1.jpg'),
	('11', 'img/products/ca-2.jpg'),
	('12', 'img/products/tom-1.jpg'),
	('12', 'img/products/tom-2.jpg'),
    ('13', 'img/products/com-chay-1.jpg'),
    ('13', 'img/products/com-chay-2.jpg'),
	('14', 'img/products/rong-bien-1.jpg'),
	('14', 'img/products/rong-bien-2.jpg'),
	('15', 'img/products/mi-goi-1.jpg'),
	('15', 'img/products/mi-goi-2.jpg'),
	('16', 'img/products/xuc-xich-1.jpg'),
	('16', 'img/products/xuc-xich-2.jpg'),
	('17', 'img/products/nuoc-khoang-1.jpg'),
	('17', 'img/products/nuoc-khoang-2.jpg'),
	('18', 'img/products/nuoc-trai-cay-1.jpg'),
	('18', 'img/products/nuoc-trai-cay-2.jpg'),
	('19', 'img/products/mat-ong-1.jpg'),
	('19', 'img/products/mat-ong-2.jpg'),
	('20', 'img/products/sua-tuoi-1.jpg'),
	('20', 'img/products/sua-tuoi-2.jpg'),
	('21', 'img/products/sua-chua-1.jpg'),
	('21', 'img/products/sua-chua-2.jpg'),
	('22', 'img/products/sua-lua-mach-1.jpg'),
	('22', 'img/products/sua-lua-mach-2.jpg'),
	('23', 'img/products/sua-hat-1.jpg'),
	('23', 'img/products/sua-hat-2.jpg'),
    ('24', 'img/products/khau-trang-1.jpg'),
    ('24', 'img/products/khau-trang-2.jpg'),
	('25', 'img/products/nuoc-rua-tay-1.jpg'),
	('25', 'img/products/nuoc-rua-tay-2.jpg'),
    ('26', 'img/products/kem-danh-rang-1.jpg'),
    ('26', 'img/products/kem-danh-rang-2.jpg'),
    ('27', 'img/products/ban-chai-1.jpg'),
    ('27', 'img/products/ban-chai-2.jpg'),
    ('28', 'img/products/dau-goi-1.jpg'),
    ('28', 'img/products/dau-goi-2.jpg'),
	('29', 'img/products/nuoc-rua-chen-1.jpg'),
	('29', 'img/products/nuoc-rua-chen-2.jpg'),
	('30', 'img/products/bot-giat-1.jpg'),
	('30', 'img/products/bot-giat-2.jpg'),
	('31', 'img/products/nuoc-xa-1.jpg'),
	('31', 'img/products/nuoc-xa-2.jpg'),
	('32', 'img/products/xa-phong-1.jpg'),
	('32', 'img/products/xa-phong-2.jpg');
COMMIT;
-- INSERT INTO "product_image"
-- VALUES
-- 	(1, 'img/products/product-1.jpg'),
-- 	(2, 'img/products/product-2.jpg'),
-- 	(3, 'img/products/product-3.jpg'),
-- 	(4, 'img/products/product-4.jpg'),
-- 	(5, 'img/products/product-5.jpg');
