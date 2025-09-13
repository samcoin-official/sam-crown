import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { tokenConfigSchema, type TokenConfig, type TokenConfigResponse } from "@shared/schema";

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

  // Token distribution configuration endpoint
  app.get('/api/config/tokens', async (req, res) => {
    try {
      // Parse environment variables with fallbacks
      const dailyTokenPool = parseInt(process.env.DAILY_TOKEN_POOL || '5555');
      const totalSupply = parseInt(process.env.TOTAL_TOKEN_SUPPLY || '1000000');
      const campaignDays = parseInt(process.env.CAMPAIGN_DURATION_DAYS || '180');
      const distributionWallet = process.env.DISTRIBUTION_WALLET || 'not-configured';
      
      // Calculate tokens per second from daily pool
      const tokensPerSecond = dailyTokenPool / 86400;
      
      const configData: TokenConfig = {
        dailyTokenPool,
        totalSupply,
        campaignDays,
        distributionWallet,
        tokensPerSecond
      };
      
      // Validate configuration using schema
      const validatedConfig = tokenConfigSchema.parse(configData);
      
      const response: TokenConfigResponse = {
        success: true,
        config: validatedConfig
      };
      
      res.json(response);
    } catch (error) {
      console.error('Token config error:', error);
      
      const errorResponse: TokenConfigResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get token configuration'
      };
      
      res.status(500).json(errorResponse);
    }
  });

  // Crown game API endpoints can be added here
  // app.get('/api/crown/current', ...);
  // app.post('/api/crown/steal', ...);
  // app.post('/api/tokens/transfer', ...); // For World App wallet transfers

  const httpServer = createServer(app);

  return httpServer;
}
