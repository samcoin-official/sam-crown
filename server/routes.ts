import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // World ID verification endpoint
  app.post('/api/verify', async (req, res) => {
    try {
      const { payload, action, signal } = req.body;
      
      // In a real implementation, you would:
      // 1. Use verifyCloudProof from @worldcoin/minikit-js
      // 2. Check against your World App ID
      // 3. Verify the action matches your configured action
      
      console.log('World ID verification request:', { action, payload });
      
      // For development, simulate successful verification
      // TODO: Replace with actual World ID verification
      if (action === 'play-and-earn') {
        return res.json({ 
          success: true, 
          status: 200,
          message: 'Verification successful' 
        });
      }
      
      return res.status(400).json({ 
        success: false, 
        status: 400,
        message: 'Invalid action' 
      });
    } catch (error) {
      console.error('Verification error:', error);
      return res.status(500).json({ 
        success: false, 
        status: 500,
        message: 'Verification failed' 
      });
    }
  });

  // Crown game API endpoints can be added here
  // app.get('/api/crown/current', ...);
  // app.post('/api/crown/steal', ...);

  const httpServer = createServer(app);

  return httpServer;
}
