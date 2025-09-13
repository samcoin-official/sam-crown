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

  // Crown game API endpoints
  
  // Get current crown holder and session info
  app.get('/api/crown/current', async (req, res) => {
    try {
      const currentHolder = await storage.getCurrentCrownHolder();
      
      if (!currentHolder) {
        return res.json({
          success: true,
          crownHolder: null,
          message: 'No one currently holds the crown'
        });
      }
      
      // Calculate current session duration and tokens earned
      const sessionDuration = Math.floor((Date.now() - new Date(currentHolder.startedAt).getTime()) / 1000);
      const tokensPerSecond = parseInt(process.env.DAILY_TOKEN_POOL || '5555') / 86400;
      const currentTokens = Math.floor(sessionDuration * tokensPerSecond * 100) / 100;
      
      res.json({
        success: true,
        crownHolder: {
          user: {
            id: currentHolder.id,
            username: currentHolder.username,
            isVerified: currentHolder.isVerified,
            totalCrownTime: parseInt(currentHolder.totalCrownTime),
            totalTokensEarned: parseFloat(currentHolder.totalTokensEarned)
          },
          session: {
            id: currentHolder.sessionId,
            startedAt: currentHolder.startedAt,
            durationSeconds: sessionDuration,
            tokensEarned: currentTokens
          }
        }
      });
    } catch (error) {
      console.error('Get current crown holder error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get current crown holder'
      });
    }
  });
  
  // Start the first crown session (when no one holds it)
  app.post('/api/crown/start', async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }
      
      // Check if anyone currently holds the crown
      const currentHolder = await storage.getCurrentCrownHolder();
      if (currentHolder) {
        return res.status(409).json({
          success: false,
          error: 'Crown is already being held',
          currentHolder: currentHolder.username
        });
      }
      
      // Verify user exists
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      // Start new crown session
      const newSession = await storage.stealCrown(undefined, userId);
      
      res.json({
        success: true,
        message: 'Crown claimed successfully!',
        session: {
          id: newSession.id,
          userId: newSession.userId,
          startedAt: newSession.startedAt
        }
      });
    } catch (error) {
      console.error('Start crown session error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start crown session'
      });
    }
  });
  
  // Steal the crown from current holder
  app.post('/api/crown/steal', async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }
      
      // Verify user exists
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      // Check for active cooldown
      const cooldown = await storage.getCooldown(userId, 'steal_crown');
      if (cooldown) {
        const timeRemaining = Math.ceil((new Date(cooldown.expiresAt).getTime() - Date.now()) / 1000);
        return res.status(429).json({
          success: false,
          error: 'Steal attempt on cooldown',
          cooldownSeconds: timeRemaining
        });
      }
      
      // Get current crown holder
      const currentHolder = await storage.getCurrentCrownHolder();
      if (!currentHolder) {
        return res.status(409).json({
          success: false,
          error: 'No one currently holds the crown. Use /api/crown/start instead.'
        });
      }
      
      // Prevent stealing from yourself
      if (currentHolder.id === userId) {
        return res.status(409).json({
          success: false,
          error: 'You already hold the crown'
        });
      }
      
      // Calculate tokens earned by previous holder
      const sessionDuration = Math.floor((Date.now() - new Date(currentHolder.startedAt).getTime()) / 1000);
      const tokensPerSecond = parseInt(process.env.DAILY_TOKEN_POOL || '5555') / 86400;
      const tokensEarned = Math.floor(sessionDuration * tokensPerSecond * 100) / 100;
      
      // End previous session with token earnings
      await storage.endCrownSession(currentHolder.sessionId, tokensEarned);
      
      // Start new crown session
      const newSession = await storage.stealCrown(currentHolder.id, userId);
      
      // Set cooldown for the new holder (1 hour)
      const cooldownExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await storage.setCooldown({
        userId,
        type: 'steal_crown',
        expiresAt: cooldownExpiry
      });
      
      res.json({
        success: true,
        message: `Crown stolen from ${currentHolder.username}!`,
        previousHolder: {
          username: currentHolder.username,
          sessionDuration,
          tokensEarned
        },
        newSession: {
          id: newSession.id,
          userId: newSession.userId,
          startedAt: newSession.startedAt
        }
      });
    } catch (error) {
      console.error('Steal crown error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to steal crown'
      });
    }
  });
  
  // Check user's steal cooldown status
  app.get('/api/crown/cooldown/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      const cooldown = await storage.getCooldown(userId, 'steal_crown');
      
      if (!cooldown) {
        return res.json({
          success: true,
          hasCooldown: false,
          message: 'No active cooldown'
        });
      }
      
      const timeRemaining = Math.max(0, Math.ceil((new Date(cooldown.expiresAt).getTime() - Date.now()) / 1000));
      
      if (timeRemaining <= 0) {
        // Cooldown expired, clean it up
        await storage.cleanupExpiredCooldowns();
        return res.json({
          success: true,
          hasCooldown: false,
          message: 'Cooldown expired'
        });
      }
      
      res.json({
        success: true,
        hasCooldown: true,
        cooldownSeconds: timeRemaining,
        expiresAt: cooldown.expiresAt
      });
    } catch (error) {
      console.error('Check cooldown error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check cooldown status'
      });
    }
  });
  
  // TODO: Token claiming endpoint for World App wallet transfers
  // app.post('/api/tokens/claim', ...);

  const httpServer = createServer(app);

  return httpServer;
}
