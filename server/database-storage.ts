import { 
  type Team, 
  type InsertTeam, 
  type Competition, 
  type InsertCompetition,
  type Match,
  type InsertMatch,
  type News,
  type InsertNews,
  type Contact,
  type InsertContact,
  type Championship,
  type InsertChampionship,
  type AdminTeam,
  type InsertAdminTeam,
  type Athlete,
  type InsertAthlete,
  type Referee,
  type InsertReferee,
  type ChampionshipTeam,
  type InsertChampionshipTeam
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { 
  teams as teamsTable, 
  competitions, 
  matches, 
  news, 
  contacts, 
  championships,
  adminTeams,
  athletes,
  referees,
  championshipTeams
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // Teams
  async getTeams(): Promise<Team[]> {
    return await db.select().from(teamsTable);
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teamsTable).where(eq(teamsTable.id, id));
    return team;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teamsTable).values(team).returning();
    return newTeam;
  }

  async updateTeam(id: string, team: Partial<InsertTeam>): Promise<Team | undefined> {
    const [updated] = await db.update(teamsTable).set(team).where(eq(teamsTable.id, id)).returning();
    return updated;
  }

  // Competitions
  async getCompetitions(): Promise<Competition[]> {
    return await db.select().from(competitions);
  }

  async getCompetition(id: string): Promise<Competition | undefined> {
    const [competition] = await db.select().from(competitions).where(eq(competitions.id, id));
    return competition;
  }

  async createCompetition(competition: InsertCompetition): Promise<Competition> {
    const [newCompetition] = await db.insert(competitions).values(competition).returning();
    return newCompetition;
  }

  // Matches
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

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }

  // News
  async getNews(): Promise<News[]> {
    return await db.select().from(news);
  }

  async getPublishedNews(): Promise<News[]> {
    return await db.select().from(news).where(eq(news.published, true));
  }

  async getNewsById(id: string): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }

  async createNews(newsData: InsertNews): Promise<News> {
    const [newNews] = await db.insert(news).values(newsData).returning();
    return newNews;
  }

  async updateNews(id: string, newsData: Partial<InsertNews>): Promise<News | undefined> {
    const [updated] = await db.update(news).set(newsData).where(eq(news.id, id)).returning();
    return updated;
  }

  async deleteNews(id: string): Promise<boolean> {
    const result = await db.delete(news).where(eq(news.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Contacts
  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  // Championships
  async getChampionships(): Promise<Championship[]> {
    try {
      console.log("Buscando campeonatos...");
      const result = await db.select().from(championships);
      console.log("Campeonatos encontrados:", result.length);
      return result;
    } catch (error) {
      console.error("Erro ao buscar campeonatos:", error);
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
        INSERT INTO championships (name, image, start_date, end_date, created_at, updated_at) 
        VALUES (${insertChampionship.name}, ${insertChampionship.image || null}, ${insertChampionship.startDate}, ${insertChampionship.endDate}, NOW(), NOW())
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

  // AdminTeams
  async getAdminTeams(): Promise<AdminTeam[]> {
    try {
      console.log("Executando query para buscar times...");
      const result = await db.select().from(adminTeams);
      console.log("Query SQL executada com sucesso, resultado:", result);
      
      return result.map(row => ({
        id: row.id,
        name: row.name,
        image: row.image || null,
        responsible: row.responsible || null,
        phone: row.phone || null,
        createdAt: row.createdAt ? new Date(row.createdAt) : null,
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
      }));
    } catch (error) {
      console.error("Erro ao buscar times:", error);
      throw error;
    }
  }

  async getAdminTeam(id: string): Promise<AdminTeam | undefined> {
    const [team] = await db.select().from(adminTeams).where(eq(adminTeams.id, id));
    return team;
  }

  async createAdminTeam(insertTeam: InsertAdminTeam): Promise<AdminTeam> {
    try {
      console.log("Criando time com dados:", insertTeam);
      
      const result = await db.execute(sql`
        INSERT INTO admin_teams (name, image, responsible, phone, created_at, updated_at) 
        VALUES (${insertTeam.name}, ${insertTeam.image || null}, ${insertTeam.responsible || null}, ${insertTeam.phone || null}, NOW(), NOW())
        RETURNING *
      `);
      console.log("Time criado com sucesso:", result.rows[0]);
      
      const row = result.rows[0] as any;
      return {
        id: row.id,
        name: row.name,
        image: row.image,
        responsible: row.responsible,
        phone: row.phone,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      };
    } catch (error) {
      console.error("Erro ao criar time:", error);
      throw error;
    }
  }

  async updateAdminTeam(id: string, updateData: Partial<InsertAdminTeam>): Promise<AdminTeam | undefined> {
    try {
      const result = await db.execute(sql`
        UPDATE admin_teams 
        SET name = ${updateData.name || null}, 
            image = ${updateData.image || null}, 
            responsible = ${updateData.responsible || null}, 
            phone = ${updateData.phone || null}, 
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `);
      
      if (result.rows.length === 0) return undefined;
      
      const row = result.rows[0] as any;
      return {
        id: row.id,
        name: row.name,
        image: row.image,
        responsible: row.responsible,
        phone: row.phone,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      };
    } catch (error) {
      console.error("Erro ao atualizar time:", error);
      throw error;
    }
  }

  async deleteAdminTeam(id: string): Promise<boolean> {
    const result = await db.delete(adminTeams).where(eq(adminTeams.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Athletes
  async getAthletes(): Promise<Athlete[]> {
    try {
      console.log("Executando query para buscar atletas...");
      const result = await db.select().from(athletes);
      console.log("Query SQL executada com sucesso, resultado:", result);
      
      return result.map(row => ({
        id: row.id,
        name: row.name,
        document: row.document || null,
        image: row.image || null,
        teamId: row.teamId || null,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }));
    } catch (error) {
      console.error("Erro ao buscar atletas:", error);
      throw error;
    }
  }

  async getAthlete(id: string): Promise<Athlete | undefined> {
    try {
      console.log("Buscando atleta com ID:", id);
      const [athlete] = await db.select().from(athletes).where(eq(athletes.id, id));
      if (!athlete) {
        console.log("Atleta não encontrado");
        return undefined;
      }
      
      console.log("Atleta encontrado:", athlete);
      return {
        id: athlete.id,
        name: athlete.name,
        document: athlete.document || null,
        image: athlete.image || null,
        teamId: athlete.teamId || null,
        createdAt: new Date(athlete.createdAt),
        updatedAt: new Date(athlete.updatedAt),
      };
    } catch (error) {
      console.error("Erro ao buscar atleta:", error);
      throw error;
    }
  }

  async createAthlete(insertAthlete: InsertAthlete): Promise<Athlete> {
    try {
      console.log("Criando atleta com dados:", insertAthlete);
      
      const result = await db.execute(sql`
        INSERT INTO athletes (name, document, image, team_id, created_at, updated_at) 
        VALUES (${insertAthlete.name}, ${insertAthlete.document || null}, ${insertAthlete.image || null}, ${insertAthlete.teamId || null}, NOW(), NOW())
        RETURNING *
      `);
      console.log("Atleta criado com sucesso:", result.rows[0]);
      
      const row = result.rows[0] as any;
      return {
        id: row.id,
        name: row.name,
        document: row.document || null,
        image: row.image || null,
        teamId: row.team_id || null,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      };
    } catch (error) {
      console.error("Erro ao criar atleta:", error);
      throw error;
    }
  }

  async updateAthlete(id: string, updateData: Partial<InsertAthlete>): Promise<Athlete | undefined> {
    try {
      console.log("Atualizando atleta:", id, updateData);
      
      const result = await db.execute(sql`
        UPDATE athletes 
        SET name = ${updateData.name || null}, 
            document = ${updateData.document || null}, 
            image = ${updateData.image || null}, 
            team_id = ${updateData.teamId || null},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `);
      
      if (result.rows.length === 0) return undefined;
      
      const row = result.rows[0] as any;
      return {
        id: row.id,
        name: row.name,
        document: row.document || null,
        image: row.image || null,
        teamId: row.team_id || null,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      };
    } catch (error) {
      console.error("Erro ao atualizar atleta:", error);
      throw error;
    }
  }

  async deleteAthlete(id: string): Promise<boolean> {
    const result = await db.delete(athletes).where(eq(athletes.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAthletesByTeam(teamId: string): Promise<Athlete[]> {
    try {
      const result = await db.select().from(athletes).where(eq(athletes.teamId, teamId));
      return result.map(row => ({
        id: row.id,
        name: row.name,
        document: row.document || null,
        image: row.image || null,
        teamId: row.teamId || null,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }));
    } catch (error) {
      console.error("Erro ao buscar atletas do time:", error);
      throw error;
    }
  }

  // Referees
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

  // Championship Teams
  async getChampionshipTeams(championshipId: string): Promise<AdminTeam[]> {
    try {
      const result = await db.execute(sql`
        SELECT at.* FROM admin_teams at
        INNER JOIN championship_teams ct ON at.id = ct.team_id
        WHERE ct.championship_id = ${championshipId}
      `);
      
      return result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        image: row.image || null,
        responsible: row.responsible || null,
        phone: row.phone || null,
        createdAt: row.created_at ? new Date(row.created_at) : null,
        updatedAt: row.updated_at ? new Date(row.updated_at) : null,
      }));
    } catch (error) {
      console.error("Erro ao buscar times do campeonato:", error);
      throw error;
    }
  }

  async addTeamToChampionship(championshipId: string, teamId: string): Promise<ChampionshipTeam> {
    const [championshipTeam] = await db.insert(championshipTeams).values({
      championshipId,
      teamId,
    }).returning();
    return championshipTeam;
  }

  async removeTeamFromChampionship(championshipId: string, teamId: string): Promise<boolean> {
    const result = await db.delete(championshipTeams).where(
      and(
        eq(championshipTeams.championshipId, championshipId),
        eq(championshipTeams.teamId, teamId)
      )
    );
    return (result.rowCount ?? 0) > 0;
  }
}