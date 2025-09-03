import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  logo: text("logo"),
  gamesPlayed: integer("games_played").default(0),
  wins: integer("wins").default(0),
  draws: integer("draws").default(0),
  losses: integer("losses").default(0),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const competitions = pgTable("competitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  phase: text("phase").notNull(), // "groups", "elimination", "final"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  homeTeamId: varchar("home_team_id").references(() => teams.id),
  awayTeamId: varchar("away_team_id").references(() => teams.id),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  matchDate: text("match_date").notNull(),
  status: text("status").default("scheduled"), // "scheduled", "live", "finished"
  competitionId: varchar("competition_id").references(() => competitions.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  author: text("author").notNull(),
  image: text("image"),
  publishedAt: text("published_at").notNull(),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Nova tabela: Campeonatos administrativos
export const championships = pgTable("championships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  image: text("image"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Nova tabela: Times administrativos (4 campos simples)
export const adminTeams = pgTable("admin_teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Nome do time
  image: text("image"), // URL da imagem do time
  responsible: text("responsible"), // Nome do responsável
  phone: text("phone"), // Telefone de contato
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Nova tabela: Atletas (3 campos simples)
export const athletes = pgTable("athletes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Nome do atleta
  document: text("document"), // Documento (CPF, RG, etc)
  image: text("image"), // URL da foto do atleta
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Nova tabela: Árbitros
export const referees = pgTable("referees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela de relação: Campeonatos x Times
export const championshipTeams = pgTable("championship_teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  championshipId: varchar("championship_id").references(() => championships.id).notNull(),
  teamId: varchar("team_id").references(() => adminTeams.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export const insertCompetitionSchema = createInsertSchema(competitions).omit({
  id: true,
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// Schemas de inserção para as novas tabelas administrativas
export const insertChampionshipSchema = createInsertSchema(championships).omit({
  id: true,
  createdAt: true,
}).extend({
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de fim é obrigatória"),
}).refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  {
    message: "A data de início deve ser anterior ou igual à data de fim",
    path: ["endDate"],
  }
);

export const insertAdminTeamSchema = createInsertSchema(adminTeams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Nome do time é obrigatório"),
  responsible: z.string().optional(),
  phone: z.string().optional(),
});

export const insertAthleteSchema = createInsertSchema(athletes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Nome do atleta é obrigatório"),
  document: z.string().optional(),
});

export const insertRefereeSchema = createInsertSchema(referees).omit({
  id: true,
  createdAt: true,
});

export const insertChampionshipTeamSchema = createInsertSchema(championshipTeams).omit({
  id: true,
  createdAt: true,
});

// Tipos para as tabelas existentes
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Competition = typeof competitions.$inferSelect;
export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

// Tipos para as novas tabelas administrativas
export type Championship = typeof championships.$inferSelect;
export type InsertChampionship = z.infer<typeof insertChampionshipSchema>;
export type AdminTeam = typeof adminTeams.$inferSelect;
export type InsertAdminTeam = z.infer<typeof insertAdminTeamSchema>;
export type Athlete = typeof athletes.$inferSelect;
export type InsertAthlete = z.infer<typeof insertAthleteSchema>;
export type Referee = typeof referees.$inferSelect;
export type InsertReferee = z.infer<typeof insertRefereeSchema>;
export type ChampionshipTeam = typeof championshipTeams.$inferSelect;
export type InsertChampionshipTeam = z.infer<typeof insertChampionshipTeamSchema>;
