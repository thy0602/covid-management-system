-- ======================================
-- Database name: covid_management
-- ======================================

-- ======================================
-- Drop table if exists
-- ======================================
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
-- DROP TABLE IF EXISTS "province" CASCADE;
-- DROP TABLE IF EXISTS "district" CASCADE;
-- DROP TABLE IF EXISTS "ward" CASCADE;
DROP TABLE IF EXISTS "relate" CASCADE;
DROP TABLE IF EXISTS "covid_record" CASCADE;
DROP TABLE IF EXISTS "quarantine_location" CASCADE;
DROP TABLE IF EXISTS "quarantine_location_record" CASCADE;
DROP TABLE IF EXISTS "product" CASCADE;
DROP TABLE IF EXISTS "product_image" CASCADE;
DROP TABLE IF EXISTS "pack" CASCADE;
DROP TABLE IF EXISTS "pack_items" CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS "order_detail" CASCADE;
DROP TABLE IF EXISTS "order_pack" CASCADE;  -- deprecated
DROP TABLE IF EXISTS "order_product" CASCADE;  -- deprecated
DROP TABLE IF EXISTS "payment_limit" CASCADE;  -- deprecated


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
	"is_deleted" boolean NOT NULL DEFAULT false,
	"is_locked" boolean NOT NULL DEFAULT false
);

-- -----------------------------
-- Table province
-- -----------------------------
-- create table "province" (
-- 	"id" int PRIMARY KEY,
-- 	"name" varchar(50) NOT NULL
-- );

-- -----------------------------
-- Table district
-- -----------------------------
-- create table "district" (
-- 	"id" int PRIMARY KEY,
-- 	"name" varchar(50) NOT NULL,
-- 	"province_id" int NOT NULL,
	
-- 	FOREIGN KEY (province_id) REFERENCES "province"("id")
-- );

-- -----------------------------
-- Table ward
-- -----------------------------
-- create table "ward" (
-- 	"id" int PRIMARY KEY,
-- 	"name" varchar(50) NOT NULL,
-- 	"district_id" int NOT NULL,
	
-- 	FOREIGN KEY (district_id) REFERENCES "district"("id")
-- );

-- -----------------------------
-- Table quarantine_location
-- -----------------------------
CREATE TABLE "quarantine_location" (
	"id" serial PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"capacity" int NOT NULL,
	"occupancy" int NOT NULL,
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
-- 	"max_basket" int NOT NULL,
-- 	"basket_timelimit" int NOT NULL,
	"identity_number" varchar(12) NOT NULL,
	"username" varchar(50) NOT NULL,
	"current_status" varchar(10),
	"current_location" int,
	"province" int NOT NULL,
	"district" int NOT NULL,
	"ward" int NOT NULL,
	
 	FOREIGN KEY (username) REFERENCES account(username),
	FOREIGN KEY (current_location) REFERENCES "quarantine_location"("id"),
	FOREIGN KEY (province) REFERENCES "province"("id"),
	FOREIGN KEY (district) REFERENCES "district"("id"),
	FOREIGN KEY (ward) REFERENCES "ward"("id")
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
	"quantity_limit" int NOT NULL DEFAULT '2',
	"time_limit_unit" varchar(10) NOT NULL DEFAULT 'tu???n', -- ngay/tuan/thang
	"is_deleted" boolean NOT NULL DEFAULT false
);

-- -----------------------------
-- Table pack_items
-- -----------------------------
CREATE TABLE "pack_items" (
	"pack_id" int NOT NULL,
	"product_id" int NOT NULL,
	"quantity_limit" int NOT NULL DEFAULT '6',
	
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
	"ordered_at" timestamp DEFAULT NOW(),
	"paid_at" timestamp,
	"total_price" numeric(19, 4) NOT NULL,
	"is_urgent" boolean NOT NULL DEFAULT false,
	
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

-- -----------------------------
-- Table order_detail
-- -----------------------------
CREATE TABLE "order_detail" (
	"order_id" int NOT NULL,
	"pack_id" int NOT NULL,
	"product_id" int NOT NULL,
	"quantity" int NOT NULL,
	"bought_price" numeric(19, 4) NOT NULL,
	
	PRIMARY KEY (order_id, pack_id, product_id),
	FOREIGN KEY (order_id) REFERENCES "order"("id"),
	FOREIGN KEY (pack_id) REFERENCES "pack"("id"),
	FOREIGN KEY (product_id) REFERENCES "product"("id")
);

-- -----------------------------
-- Table payment_limit
-- -----------------------------
CREATE TABLE "payment_limit" (
	"value" numeric(19, 4) NOT NULL
);