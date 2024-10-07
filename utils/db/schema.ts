// 1
import { integer, varchar, pgTable, serial, text, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

// Users Table

export const Users = pgTable("users", {

    id: serial("id").primaryKey(), //autoincremental
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),

});

// Reports Table

export const Reports = pgTable("reports", {

    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => Users.id).notNull(),
    location: text("location").notNull(),
    wasteType: varchar("waste_type", { length: 255 }).notNull(),
    amount: varchar("amount", { length: 255 }).notNull(),
    status: varchar("status", { length: 255 }).notNull().default("pending"),
    imageUrl: text("image_url"),
    varificationResult: jsonb("verification_result"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    collectorId: integer("collector_id").references(() => Users.id),

});

// Reward Table

export const Rewards = pgTable("rewards", {

    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => Users.id).notNull(),
    points: integer("points").notNull().default(0),
    level: integer("level").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    isAvailable: boolean("is_available").notNull().default(true),
    description: text("description"),
    name: varchar("name", { length:255 }).notNull(),
    collectionInfo: text("collection_info").notNull(),

});

// Collection Waste

export const CollectionWastes = pgTable("collected_waste" , {

    id: serial("id").primaryKey(),
    reportId: integer("report_id").references(() => Reports.id).notNull(),
    collectorId: integer("collector_id").references(() => Users.id).notNull(),
    collectionDate: timestamp("collection_date").notNull(),
    status: varchar("status", { length: 255 }).notNull().default("collected"),

})

// Notification table

export const Notifications = pgTable("notifications", {

    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => Users.id).notNull(),
    message: text("message").notNull(),
    type: varchar("type", { length:50 }).notNull(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),

})

// transaction table

export const Transactions = pgTable("transactions", {

    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => Users.id).notNull(),
    amount: integer("amount").notNull(),
    type: varchar("type", { length:20 }).notNull(), //earned or reedemed
    description: text("description").notNull(),
    date: timestamp("date").defaultNow().notNull(),

})