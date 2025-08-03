import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/developers:
 *   get:
 *     summary: Get all developers
 *     tags: [Developers]
 *     responses:
 *       200:
 *         description: List of developers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Developer'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const developers = await prisma.developer.findMany({
      include: {
        _count: {
          select: { compounds: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json({ success: true, data: developers });
  } catch (error) {
    console.error('Error fetching developers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch developers' });
  }
});

/**
 * @swagger
 * /api/developers/{id}:
 *   get:
 *     summary: Get developer by ID with compounds
 *     tags: [Developers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Developer ID
 *     responses:
 *       200:
 *         description: Developer details with compounds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/DeveloperWithCompounds'
 *       404:
 *         description: Developer not found
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const developer = await prisma.developer.findUnique({
      where: { id },
      include: {
        compounds: {
          include: {
            _count: {
              select: { units: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!developer) {
      return res.status(404).json({ success: false, error: 'Developer not found' });
    }
    
    res.json({ success: true, data: developer });
  } catch (error) {
    console.error('Error fetching developer:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch developer' });
  }
});

export { router as developerRoutes }; 