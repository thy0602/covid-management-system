DROP TABLE IF EXISTS "province" CASCADE;
DROP TABLE IF EXISTS "district" CASCADE;
DROP TABLE IF EXISTS "ward" CASCADE;

-- -----------------------------
-- Table province
-- -----------------------------
create table "province" (
	"id" int PRIMARY KEY,
	"name" varchar(50) NOT NULL
);

-- -----------------------------
-- Table district
-- -----------------------------
create table "district" (
	"id" int PRIMARY KEY,
	"name" varchar(50) NOT NULL,
	"province_id" int NOT NULL,
	
	FOREIGN KEY (province_id) REFERENCES "province"("id")
);

-- -----------------------------
-- Table ward
-- -----------------------------
create table "ward" (
	"id" int PRIMARY KEY,
	"name" varchar(50) NOT NULL,
	"district_id" int NOT NULL,
	
	FOREIGN KEY (district_id) REFERENCES "district"("id")
);