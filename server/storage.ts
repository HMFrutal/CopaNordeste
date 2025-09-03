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
import { randomUUID } from "crypto";

export interface IStorage {
  // Teams
  getTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, team: Partial<InsertTeam>): Promise<Team | undefined>;

  // Competitions
  getCompetitions(): Promise<Competition[]>;
  getCompetition(id: string): Promise<Competition | undefined>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;

  // Matches
  getMatches(): Promise<Match[]>;
  getMatchesByCompetition(competitionId: string): Promise<Match[]>;
  getMatch(id: string): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;

  // News
  getNews(): Promise<News[]>;
  getNewsById(id: string): Promise<News | undefined>;
  getPublishedNews(): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;

  // Contacts
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;

  // Championships
  getChampionships(): Promise<Championship[]>;
  getChampionship(id: string): Promise<Championship | undefined>;
  createChampionship(championship: InsertChampionship): Promise<Championship>;
  updateChampionship(id: string, championship: Partial<InsertChampionship>): Promise<Championship | undefined>;
  deleteChampionship(id: string): Promise<boolean>;

  // Admin Teams
  getAdminTeams(): Promise<AdminTeam[]>;
  getAdminTeam(id: string): Promise<AdminTeam | undefined>;
  createAdminTeam(team: InsertAdminTeam): Promise<AdminTeam>;
  updateAdminTeam(id: string, team: Partial<InsertAdminTeam>): Promise<AdminTeam | undefined>;
  deleteAdminTeam(id: string): Promise<boolean>;

  // Athletes
  getAthletes(): Promise<Athlete[]>;
  getAthlete(id: string): Promise<Athlete | undefined>;
  getAthletesByTeam(teamId: string): Promise<Athlete[]>;
  createAthlete(athlete: InsertAthlete): Promise<Athlete>;
  updateAthlete(id: string, athlete: Partial<InsertAthlete>): Promise<Athlete | undefined>;
  deleteAthlete(id: string): Promise<boolean>;

  // Referees
  getReferees(): Promise<Referee[]>;
  getReferee(id: string): Promise<Referee | undefined>;
  createReferee(referee: InsertReferee): Promise<Referee>;
  updateReferee(id: string, referee: Partial<InsertReferee>): Promise<Referee | undefined>;
  deleteReferee(id: string): Promise<boolean>;

  // Championship Teams relationships
  getChampionshipTeams(championshipId: string): Promise<AdminTeam[]>;
  addTeamToChampionship(championshipId: string, teamId: string): Promise<ChampionshipTeam>;
  removeTeamFromChampionship(championshipId: string, teamId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private teams: Map<string, Team>;
  private competitions: Map<string, Competition>;
  private matches: Map<string, Match>;
  private news: Map<string, News>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.teams = new Map();
    this.competitions = new Map();
    this.matches = new Map();
    this.news = new Map();
    this.contacts = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed teams
    const sampleTeams: InsertTeam[] = [
      { name: "Fortaleza City FC", city: "Fortaleza", state: "CE", gamesPlayed: 12, wins: 8, draws: 2, losses: 2, points: 26 },
      { name: "Salvador Esporte", city: "Salvador", state: "BA", gamesPlayed: 12, wins: 7, draws: 3, losses: 2, points: 24 },
      { name: "Recife Clube", city: "Recife", state: "PE", gamesPlayed: 12, wins: 6, draws: 4, losses: 2, points: 22 },
      { name: "Natal Futebol", city: "Natal", state: "RN", gamesPlayed: 12, wins: 6, draws: 3, losses: 3, points: 21 },
      { name: "Maceió Club", city: "Maceió", state: "AL", gamesPlayed: 12, wins: 5, draws: 4, losses: 3, points: 19 },
      { name: "Aracaju Esporte", city: "Aracaju", state: "SE", gamesPlayed: 12, wins: 5, draws: 2, losses: 5, points: 17 },
    ];

    sampleTeams.forEach(team => {
      const id = randomUUID();
      this.teams.set(id, { 
        ...team, 
        id, 
        createdAt: new Date(),
        logo: team.logo || null,
        points: team.points ?? null,
        gamesPlayed: team.gamesPlayed ?? null,
        wins: team.wins ?? null,
        draws: team.draws ?? null,
        losses: team.losses ?? null
      });
    });

    // Seed competitions
    const competition: InsertCompetition = {
      name: "Copa Nordeste 2025 - 7ª Edição",
      description: "O maior torneio regional de futebol de campo do Nordeste brasileiro",
      startDate: "2025-03-15",
      endDate: "2025-06-22",
      phase: "groups",
      isActive: true
    };

    const competitionId = randomUUID();
    this.competitions.set(competitionId, { 
      ...competition, 
      id: competitionId, 
      createdAt: new Date(),
      description: competition.description || null,
      isActive: competition.isActive ?? null
    });

    // Seed news
    const sampleNews: InsertNews[] = [
      {
        title: "Inscrições da Copa Nordeste 2025 Superam Expectativas",
        content: "Com mais de 50 equipes interessadas em participar da sétima edição do torneio, a organização confirma que o evento promete ser o maior já realizado na região. As inscrições seguem abertas até o final de fevereiro.",
        excerpt: "Mais de 50 equipes se inscreveram para a 7ª edição da Copa Nordeste 2025",
        author: "João Silva",
        publishedAt: "2025-01-12",
        isPublished: true
      },
      {
        title: "Novos Estádios Confirmados para a Competição",
        content: "A organização anuncia a inclusão de três novos estádios na competição, ampliando a capacidade total e garantindo melhor experiência para os torcedores.",
        excerpt: "Três novos estádios se juntam à Copa Nordeste 2025",
        author: "Maria Santos",
        publishedAt: "2025-01-08",
        isPublished: true
      }
    ];

    sampleNews.forEach(newsItem => {
      const id = randomUUID();
      this.news.set(id, { 
        ...newsItem, 
        id, 
        createdAt: new Date(),
        image: newsItem.image || null,
        excerpt: newsItem.excerpt || null,
        isPublished: newsItem.isPublished ?? null
      });
    });
  }

  // Teams methods
  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeam(id: string): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = randomUUID();
    const team: Team = { 
      ...insertTeam, 
      id, 
      createdAt: new Date(),
      logo: insertTeam.logo || null,
      points: insertTeam.points ?? null,
      gamesPlayed: insertTeam.gamesPlayed ?? null,
      wins: insertTeam.wins ?? null,
      draws: insertTeam.draws ?? null,
      losses: insertTeam.losses ?? null
    };
    this.teams.set(id, team);
    return team;
  }

  async updateTeam(id: string, updateData: Partial<InsertTeam>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) return undefined;
    
    const updatedTeam = { ...team, ...updateData };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  // Competitions methods
  async getCompetitions(): Promise<Competition[]> {
    return Array.from(this.competitions.values());
  }

  async getCompetition(id: string): Promise<Competition | undefined> {
    return this.competitions.get(id);
  }

  async createCompetition(insertCompetition: InsertCompetition): Promise<Competition> {
    const id = randomUUID();
    const competition: Competition = { 
      ...insertCompetition, 
      id, 
      createdAt: new Date(),
      description: insertCompetition.description || null,
      isActive: insertCompetition.isActive ?? null
    };
    this.competitions.set(id, competition);
    return competition;
  }

  // Matches methods
  async getMatches(): Promise<Match[]> {
    return Array.from(this.matches.values());
  }

  async getMatchesByCompetition(competitionId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(match => match.competitionId === competitionId);
  }

  async getMatch(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = randomUUID();
    const match: Match = { 
      ...insertMatch, 
      id, 
      createdAt: new Date(),
      status: insertMatch.status || null,
      homeTeamId: insertMatch.homeTeamId || null,
      awayTeamId: insertMatch.awayTeamId || null,
      homeScore: insertMatch.homeScore ?? null,
      awayScore: insertMatch.awayScore ?? null,
      competitionId: insertMatch.competitionId || null
    };
    this.matches.set(id, match);
    return match;
  }

  // News methods
  async getNews(): Promise<News[]> {
    return Array.from(this.news.values());
  }

  async getNewsById(id: string): Promise<News | undefined> {
    return this.news.get(id);
  }

  async getPublishedNews(): Promise<News[]> {
    return Array.from(this.news.values()).filter(news => news.isPublished);
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = randomUUID();
    const news: News = { 
      ...insertNews, 
      id, 
      createdAt: new Date(),
      image: insertNews.image || null,
      excerpt: insertNews.excerpt || null,
      isPublished: insertNews.isPublished ?? null
    };
    this.news.set(id, news);
    return news;
  }

  // Contacts methods
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { ...insertContact, id, isRead: false, createdAt: new Date() };
    this.contacts.set(id, contact);
    return contact;
  }

  // Métodos administrativos (implementação stub para compatibilidade)
  async getChampionships(): Promise<Championship[]> { return []; }
  async getChampionship(id: string): Promise<Championship | undefined> { return undefined; }
  async createChampionship(championship: InsertChampionship): Promise<Championship> { 
    throw new Error("Use DatabaseStorage for admin features"); 
  }
  async updateChampionship(id: string, championship: Partial<InsertChampionship>): Promise<Championship | undefined> { 
    return undefined; 
  }
  async deleteChampionship(id: string): Promise<boolean> { return false; }

  async getAdminTeams(): Promise<AdminTeam[]> { return []; }
  async getAdminTeam(id: string): Promise<AdminTeam | undefined> { return undefined; }
  async createAdminTeam(team: InsertAdminTeam): Promise<AdminTeam> { 
    throw new Error("Use DatabaseStorage for admin features"); 
  }
  async updateAdminTeam(id: string, team: Partial<InsertAdminTeam>): Promise<AdminTeam | undefined> { 
    return undefined; 
  }
  async deleteAdminTeam(id: string): Promise<boolean> { return false; }

  async getAthletes(): Promise<Athlete[]> { return []; }
  async getAthlete(id: string): Promise<Athlete | undefined> { return undefined; }
  async getAthletesByTeam(teamId: string): Promise<Athlete[]> { return []; }
  async createAthlete(athlete: InsertAthlete): Promise<Athlete> { 
    throw new Error("Use DatabaseStorage for admin features"); 
  }
  async updateAthlete(id: string, athlete: Partial<InsertAthlete>): Promise<Athlete | undefined> { 
    return undefined; 
  }
  async deleteAthlete(id: string): Promise<boolean> { return false; }

  async getReferees(): Promise<Referee[]> { return []; }
  async getReferee(id: string): Promise<Referee | undefined> { return undefined; }
  async createReferee(referee: InsertReferee): Promise<Referee> { 
    throw new Error("Use DatabaseStorage for admin features"); 
  }
  async updateReferee(id: string, referee: Partial<InsertReferee>): Promise<Referee | undefined> { 
    return undefined; 
  }
  async deleteReferee(id: string): Promise<boolean> { return false; }

  async getChampionshipTeams(championshipId: string): Promise<AdminTeam[]> { return []; }
  async addTeamToChampionship(championshipId: string, teamId: string): Promise<ChampionshipTeam> { 
    throw new Error("Use DatabaseStorage for admin features"); 
  }
  async removeTeamFromChampionship(championshipId: string, teamId: string): Promise<boolean> { 
    return false; 
  }
}

// Importar e usar o DatabaseStorage
import { DatabaseStorage } from "./database-storage";
export const storage = new DatabaseStorage();
