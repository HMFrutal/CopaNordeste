import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertChampionshipSchema,
  insertAdminTeamSchema,
  insertAthleteSchema,
  insertRefereeSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Teams routes
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  // Competitions routes
  app.get("/api/competitions", async (req, res) => {
    try {
      const competitions = await storage.getCompetitions();
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competitions" });
    }
  });

  // Matches routes
  app.get("/api/matches", async (req, res) => {
    try {
      const matches = await storage.getMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.get("/api/competitions/:id/matches", async (req, res) => {
    try {
      const matches = await storage.getMatchesByCompetition(req.params.id);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competition matches" });
    }
  });

  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getPublishedNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const newsItem = await storage.getNewsById(req.params.id);
      if (!newsItem) {
        return res.status(404).json({ message: "News article not found" });
      }
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news article" });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json({ message: "Contact message sent successfully", contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send contact message" });
    }
  });

  // ========= ROTAS ADMINISTRATIVAS =========

  // Championships routes
  app.get("/api/admin/championships", async (req, res) => {
    try {
      const championships = await storage.getChampionships();
      res.json(championships);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar campeonatos" });
    }
  });

  app.get("/api/admin/championships/:id", async (req, res) => {
    try {
      const championship = await storage.getChampionship(req.params.id);
      if (!championship) {
        return res.status(404).json({ message: "Campeonato não encontrado" });
      }
      res.json(championship);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar campeonato" });
    }
  });

  app.post("/api/admin/championships", async (req, res) => {
    try {
      const validatedData = insertChampionshipSchema.parse(req.body);
      const championship = await storage.createChampionship(validatedData);
      res.status(201).json(championship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar campeonato" });
    }
  });

  app.put("/api/admin/championships/:id", async (req, res) => {
    try {
      const validatedData = insertChampionshipSchema.partial().parse(req.body);
      const championship = await storage.updateChampionship(req.params.id, validatedData);
      if (!championship) {
        return res.status(404).json({ message: "Campeonato não encontrado" });
      }
      res.json(championship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao atualizar campeonato" });
    }
  });

  app.delete("/api/admin/championships/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteChampionship(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Campeonato não encontrado" });
      }
      res.json({ message: "Campeonato deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Falha ao deletar campeonato" });
    }
  });

  // Admin Teams routes
  app.get("/api/admin/teams", async (req, res) => {
    try {
      const teams = await storage.getAdminTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar times" });
    }
  });

  app.get("/api/admin/teams/:id", async (req, res) => {
    try {
      const team = await storage.getAdminTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ message: "Time não encontrado" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar time" });
    }
  });

  app.post("/api/admin/teams", async (req, res) => {
    try {
      const validatedData = insertAdminTeamSchema.parse(req.body);
      const team = await storage.createAdminTeam(validatedData);
      res.status(201).json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar time" });
    }
  });

  app.put("/api/admin/teams/:id", async (req, res) => {
    try {
      const validatedData = insertAdminTeamSchema.partial().parse(req.body);
      const team = await storage.updateAdminTeam(req.params.id, validatedData);
      if (!team) {
        return res.status(404).json({ message: "Time não encontrado" });
      }
      res.json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao atualizar time" });
    }
  });

  app.delete("/api/admin/teams/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAdminTeam(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Time não encontrado" });
      }
      res.json({ message: "Time deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Falha ao deletar time" });
    }
  });

  // Athletes routes
  app.get("/api/admin/athletes", async (req, res) => {
    try {
      const { teamId } = req.query;
      const athletes = teamId 
        ? await storage.getAthletesByTeam(teamId as string)
        : await storage.getAthletes();
      res.json(athletes);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar atletas" });
    }
  });

  app.get("/api/admin/athletes/:id", async (req, res) => {
    try {
      const athlete = await storage.getAthlete(req.params.id);
      if (!athlete) {
        return res.status(404).json({ message: "Atleta não encontrado" });
      }
      res.json(athlete);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar atleta" });
    }
  });

  app.post("/api/admin/athletes", async (req, res) => {
    try {
      const validatedData = insertAthleteSchema.parse(req.body);
      const athlete = await storage.createAthlete(validatedData);
      res.status(201).json(athlete);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar atleta" });
    }
  });

  app.put("/api/admin/athletes/:id", async (req, res) => {
    try {
      const validatedData = insertAthleteSchema.partial().parse(req.body);
      const athlete = await storage.updateAthlete(req.params.id, validatedData);
      if (!athlete) {
        return res.status(404).json({ message: "Atleta não encontrado" });
      }
      res.json(athlete);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao atualizar atleta" });
    }
  });

  app.delete("/api/admin/athletes/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAthlete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Atleta não encontrado" });
      }
      res.json({ message: "Atleta deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Falha ao deletar atleta" });
    }
  });

  // Referees routes
  app.get("/api/admin/referees", async (req, res) => {
    try {
      const referees = await storage.getReferees();
      res.json(referees);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar árbitros" });
    }
  });

  app.get("/api/admin/referees/:id", async (req, res) => {
    try {
      const referee = await storage.getReferee(req.params.id);
      if (!referee) {
        return res.status(404).json({ message: "Árbitro não encontrado" });
      }
      res.json(referee);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar árbitro" });
    }
  });

  app.post("/api/admin/referees", async (req, res) => {
    try {
      const validatedData = insertRefereeSchema.parse(req.body);
      const referee = await storage.createReferee(validatedData);
      res.status(201).json(referee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar árbitro" });
    }
  });

  app.put("/api/admin/referees/:id", async (req, res) => {
    try {
      const validatedData = insertRefereeSchema.partial().parse(req.body);
      const referee = await storage.updateReferee(req.params.id, validatedData);
      if (!referee) {
        return res.status(404).json({ message: "Árbitro não encontrado" });
      }
      res.json(referee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao atualizar árbitro" });
    }
  });

  app.delete("/api/admin/referees/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteReferee(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Árbitro não encontrado" });
      }
      res.json({ message: "Árbitro deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Falha ao deletar árbitro" });
    }
  });

  // Championship Teams relationship routes
  app.get("/api/admin/championships/:id/teams", async (req, res) => {
    try {
      const teams = await storage.getChampionshipTeams(req.params.id);
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Falha ao buscar times do campeonato" });
    }
  });

  app.post("/api/admin/championships/:championshipId/teams/:teamId", async (req, res) => {
    try {
      const championshipTeam = await storage.addTeamToChampionship(req.params.championshipId, req.params.teamId);
      res.status(201).json(championshipTeam);
    } catch (error) {
      res.status(500).json({ message: "Falha ao adicionar time ao campeonato" });
    }
  });

  app.delete("/api/admin/championships/:championshipId/teams/:teamId", async (req, res) => {
    try {
      const removed = await storage.removeTeamFromChampionship(req.params.championshipId, req.params.teamId);
      if (!removed) {
        return res.status(404).json({ message: "Relacionamento não encontrado" });
      }
      res.json({ message: "Time removido do campeonato com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Falha ao remover time do campeonato" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
