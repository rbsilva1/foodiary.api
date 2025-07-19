import {
	date,
	integer,
	json,
	pgEnum,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	goal: varchar("goal", { length: 8 }).notNull(),
	gender: varchar("gender", { length: 6 }).notNull(),
	birthDate: date("birth_date").notNull(),
	height: integer("height").notNull(),
	weight: integer("weight").notNull(),
	activityLevel: integer("activity_level").notNull(),

	// Goals
	calories: integer("calories").notNull(),
	proteins: integer("proteins").notNull(),
	carbs: integer("carbs").notNull(),
	fats: integer("fats").notNull(),
});

export const mealStatus = pgEnum("meal_status", [
	"uploading",
	"processing",
	"success",
	"failed",
]);

export const mealInputType = pgEnum("meal_input_type", ["audio", "picture"]);

export const mealsTable = pgTable("meals", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	status: mealStatus().notNull(),
	inputType: mealInputType("input_type").notNull(),
	inputFileKey: varchar("input_file_key", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	icon: varchar("icon", { length: 255 }).notNull(),
	foods: json("foods"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
