import { eq, and, sql } from "drizzle-orm";
import { db } from "./db";
import { 
  teams, competitions, matches, news, contacts,
  championships, adminTeams, athletes, referees, championshipTeams,
  type Team, type InsertTeam, 
  type Competition, type InsertCompetition,
  type Match, type InsertMatch,
  type News, type InsertNews,
  type Contact, type InsertContact,
  type Championship, type InsertChampionship,
  type AdminTeam, type InsertAdminTeam,
  type Athlete, type InsertAthlete,
  type Referee, type InsertReferee,
  type ChampionshipTeam, type InsertChampionshipTeam
} from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Teams methods (implementações existentes)
  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const [team] = await db.insert(teams).values(insertTeam).returning();
    return team;
  }

  async updateTeam(id: string, updateData: Partial<InsertTeam>): Promise<Team | undefined> {
    const [team] = await db.update(teams).set(updateData).where(eq(teams.id, id)).returning();
    return team;
  }

  // Competitions methods (implementações existentes)
  async getCompetitions(): Promise<Competition[]> {
    return await db.select().from(competitions);
  }

  async getCompetition(id: string): Promise<Competition | undefined> {
    const [competition] = await db.select().from(competitions).where(eq(competitions.id, id));
    return competition;
  }

  async createCompetition(insertCompetition: InsertCompetition): Promise<Competition> {
    const [competition] = await db.insert(competitions).values(insertCompetition).returning();
    return competition;
  }

  // Matches methods (implementações existentes)
  async getMatches(): Promise<Match[]> {
    return await db.select().from(matches);
  }

  async getMatchesByCompetition(competitionId: string): Promise<Match[]> {
    return await db.select().from(matches).where(eq(matches.competitionId, competitionId));
  }

  async getMatch(id: string): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match;
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const [match] = await db.insert(matches).values(insertMatch).returning();
    return match;
  }

  // News methods (implementações existentes)
  async getNews(): Promise<News[]> {
    return await db.select().from(news);
  }

  async getNewsById(id: string): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }

  async getPublishedNews(): Promise<News[]> {
    return await db.select().from(news).where(eq(news.isPublished, true));
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db.insert(news).values(insertNews).returning();
    return newsItem;
  }

  // Contacts methods (implementações existentes)
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  // ====== NOVAS IMPLEMENTAÇÕES ADMINISTRATIVAS ======

  // Championships methods
  async getChampionships(): Promise<Championship[]> {
    try {
      console.log("Executando query para buscar campeonatos...");
      // Usar query SQL direta temporariamente para contornar problema
      const result = await db.execute(sql`SELECT * FROM championships ORDER BY created_at DESC`);
      console.log("Query SQL executada com sucesso, resultado:", result.rows);
      
      // Mapear resultado para o tipo correto
      return result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        image: row.image,
        startDate: row.start_date,
        endDate: row.end_date,
        createdAt: new Date(row.created_at),
      }));
    } catch (error) {
      console.error("Erro na query de campeonatos:", error);
      throw error;
    }
  }

  async getChampionship(id: string): Promise<Championship | undefined> {
    const [championship] = await db.select().from(championships).where(eq(championships.id, id));
    return championship;
  }

  async createChampionship(insertChampionship: InsertChampionship): Promise<Championship> {
    try {
      console.log("Criando campeonato com dados:", insertChampionship);
      
      const result = await db.execute(sql`
        INSERT INTO championships (name, image, start_date, end_date, created_at) 
        VALUES (${insertChampionship.name}, ${insertChampionship.image}, ${insertChampionship.startDate}, ${insertChampionship.endDate}, NOW())
        RETURNING *
      `);
      
      console.log("Campeonato criado com sucesso:", result.rows[0]);
      
      const row = result.rows[0] as any;
      return {
        id: row.id,
        name: row.name,
        image: row.image,
        startDate: row.start_date,
        endDate: row.end_date,
        createdAt: new Date(row.created_at),
      };
    } catch (error) {
      console.error("Erro ao criar campeonato:", error);
      throw error;
    }
  }

  async updateChampionship(id: string, updateData: Partial<InsertChampionship>): Promise<Championship | undefined> {
    const [championship] = await db.update(championships).set(updateData).where(eq(championships.id, id)).returning();
    return championship;
  }

  async deleteChampionship(id: string): Promise<boolean> {
    const result = await db.delete(championships).where(eq(championships.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Admin Teams methods
  async getAdminTeams(): Promise<AdminTeam[]> {
    return await db.select().from(adminTeams);
  }

  async getAdminTeam(id: string): Promise<AdminTeam | undefined> {
    const [team] = await db.select().from(adminTeams).where(eq(adminTeams.id, id));
    return team;
  }

  async createAdminTeam(insertAdminTeam: InsertAdminTeam): Promise<AdminTeam> {
    const [team] = await db.insert(adminTeams).values(insertAdminTeam).returning();
    return team;
  }

  async updateAdminTeam(id: string, updateData: Partial<InsertAdminTeam>): Promise<AdminTeam | undefined> {
    const [team] = await db.update(adminTeams).set(updateData).where(eq(adminTeams.id, id)).returning();
    return team;
  }

  async deleteAdminTeam(id: string): Promise<boolean> {
    const result = await db.delete(adminTeams).where(eq(adminTeams.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Athletes methods
  async getAthletes(): Promise<Athlete[]> {
    return await db.select().from(athletes);
  }

  async getAthletesByTeam(teamId: string): Promise<Athlete[]> {
    return await db.select().from(athletes).where(eq(athletes.teamId, teamId));
  }

  async getAthlete(id: string): Promise<Athlete | undefined> {
    const [athlete] = await db.select().from(athletes).where(eq(athletes.id, id));
    return athlete;
  }

  async createAthlete(insertAthlete: InsertAthlete): Promise<Athlete> {
    const [athlete] = await db.insert(athletes).values(insertAthlete).returning();
    return athlete;
  }

  async updateAthlete(id: string, updateData: Partial<InsertAthlete>): Promise<Athlete | undefined> {
    const [athlete] = await db.update(athletes).set(updateData).where(eq(athletes.id, id)).returning();
    return athlete;
  }

  async deleteAthlete(id: string): Promise<boolean> {
    const result = await db.delete(athletes).where(eq(athletes.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Referees methods
  async getReferees(): Promise<Referee[]> {
    return await db.select().from(referees);
  }

  async getReferee(id: string): Promise<Referee | undefined> {
    const [referee] = await db.select().from(referees).where(eq(referees.id, id));
    return referee;
  }

  async createReferee(insertReferee: InsertReferee): Promise<Referee> {
    const [referee] = await db.insert(referees).values(insertReferee).returning();
    return referee;
  }

  async updateReferee(id: string, updateData: Partial<InsertReferee>): Promise<Referee | undefined> {
    const [referee] = await db.update(referees).set(updateData).where(eq(referees.id, id)).returning();
    return referee;
  }

  async deleteReferee(id: string): Promise<boolean> {
    const result = await db.delete(referees).where(eq(referees.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Championship Teams relationship methods
  async getChampionshipTeams(championshipId: string): Promise<AdminTeam[]> {
    const result = await db.select({
      id: adminTeams.id,
      name: adminTeams.name,
      image: adminTeams.image,
      createdAt: adminTeams.createdAt
    })
    .from(championshipTeams)
    .innerJoin(adminTeams, eq(championshipTeams.teamId, adminTeams.id))
    .where(eq(championshipTeams.championshipId, championshipId));
    
    return result;
  }

  async addTeamToChampionship(championshipId: string, teamId: string): Promise<ChampionshipTeam> {
    const [championshipTeam] = await db.insert(championshipTeams).values({
      championshipId,
      teamId
    }).returning();
    return championshipTeam;
  }

  async removeTeamFromChampionship(championshipId: string, teamId: string): Promise<boolean> {
    const result = await db.delete(championshipTeams)
      .where(
        and(
          eq(championshipTeams.championshipId, championshipId),
          eq(championshipTeams.teamId, teamId)
        )
      );
    return (result.rowCount ?? 0) > 0;
  }
}