import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const attractions = pgTable("attractions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  localPrice: decimal("local_price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // wildlife, beach, spiritual, cultural
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  operatingHours: text("operating_hours").notNull(),
  features: text("features").array().notNull(),
  facilities: text("facilities").array().notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.5"),
  isActive: boolean("is_active").default(true),
});

export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  attractionId: varchar("attraction_id").references(() => attractions.id).notNull(),
  ticketNumber: text("ticket_number").notNull().unique(),
  visitorName: text("visitor_name").notNull(),
  visitDate: timestamp("visit_date").notNull(),
  quantity: integer("quantity").default(1),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("active"), // active, used, expired, cancelled
  qrCode: text("qr_code").notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow(),
  usedAt: timestamp("used_at"),
});

export const news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  imageUrl: text("image_url"),
  publishDate: timestamp("publish_date").defaultNow(),
  eventDate: timestamp("event_date"),
  status: text("status").default("published"), // published, draft
  category: text("category").default("news"), // news, event
});

export const gallery = pgTable("gallery", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  type: text("type").notNull(), // photo, video
  category: text("category").notNull(), // wildlife, landscape, activities, etc
  createdAt: timestamp("created_at").defaultNow(),
  author: text("author").default("Admin Website"),
  isActive: boolean("is_active").default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  fullName: true,
  phone: true,
});

export const insertAttractionSchema = createInsertSchema(attractions).omit({
  id: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  ticketNumber: true,
  qrCode: true,
  purchaseDate: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  publishDate: true,
});

export const insertGallerySchema = createInsertSchema(gallery).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Attraction = typeof attractions.$inferSelect;
export type InsertAttraction = z.infer<typeof insertAttractionSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type Gallery = typeof gallery.$inferSelect;
export type InsertGallery = z.infer<typeof insertGallerySchema>;
