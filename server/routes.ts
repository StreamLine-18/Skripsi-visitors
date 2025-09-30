import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTicketSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all attractions
  app.get("/api/attractions", async (req, res) => {
    try {
      const attractions = await storage.getAttractions();
      res.json(attractions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attractions" });
    }
  });

  // Get attraction by slug
  app.get("/api/attractions/:slug", async (req, res) => {
    try {
      const attraction = await storage.getAttractionBySlug(req.params.slug);
      if (!attraction) {
        return res.status(404).json({ message: "Attraction not found" });
      }
      res.json(attraction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attraction" });
    }
  });

  // Get user tickets (using dummy user for now)
  app.get("/api/tickets", async (req, res) => {
    try {
      // For demo purposes, we'll use the seeded user
      const users = await storage.getUser("amanda_pratama");
      const sampleUserId = Array.from((storage as any).users.keys())[0];
      
      const tickets = await storage.getTicketsByUserId(sampleUserId);
      
      // Populate with attraction data
      const ticketsWithAttractions = await Promise.all(
        tickets.map(async (ticket) => {
          const attraction = await storage.getAttraction(ticket.attractionId);
          return {
            ...ticket,
            attraction
          };
        })
      );

      res.json(ticketsWithAttractions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  // Create new ticket
  app.post("/api/tickets", async (req, res) => {
    try {
      const ticketData = insertTicketSchema.parse(req.body);
      
      // For demo purposes, use the seeded user
      const sampleUserId = Array.from((storage as any).users.keys())[0];
      
      const ticket = await storage.createTicket({
        ...ticketData,
        userId: sampleUserId
      });

      const attraction = await storage.getAttraction(ticket.attractionId);
      
      res.status(201).json({
        ...ticket,
        attraction
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid ticket data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create ticket" });
      }
    }
  });

  // Get news and events
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Get user profile (dummy endpoint)
  app.get("/api/profile", async (req, res) => {
    try {
      // For demo purposes, return dummy profile data
      const profile = {
        id: "amanda_pratama",
        name: "Amanda Pratama",
        email: "amanda.pratama@email.com",
        phone: "+62812345678",
        memberSince: "Oktober 2024",
        stats: {
          totalVisits: 8,
          totalSpent: "Rp 1.200.000",
          favorites: 6
        }
      };
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Get gallery photos
  app.get("/api/gallery/photos", async (req, res) => {
    try {
      const photos = await storage.getGalleryItems('photo');
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  // Get gallery videos
  app.get("/api/gallery/videos", async (req, res) => {
    try {
      const videos = await storage.getGalleryItems('video');
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // Get all gallery items
  app.get("/api/gallery", async (req, res) => {
    try {
      const gallery = await storage.getGalleryItems();
      res.json(gallery);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
