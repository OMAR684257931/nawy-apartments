import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/compounds:
 *   get:
 *     summary: Get all compounds
 *     tags: [Compounds]
 *     responses:
 *       200:
 *         description: List of compounds
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
 *                     $ref: '#/components/schemas/Compound'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const compounds = await prisma.compound.findMany({
      include: {
        developer: true,
        _count: {
          select: { units: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: compounds });
  } catch (error) {
    console.error('Error fetching compounds:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch compounds' });
  }
});

/**
 * @swagger
 * /api/compounds/{id}:
 *   get:
 *     summary: Get compound by ID with units
 *     tags: [Compounds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Compound ID
 *     responses:
 *       200:
 *         description: Compound details with units
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CompoundWithUnits'
 *       404:
 *         description: Compound not found
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const compound = await prisma.compound.findUnique({
      where: { id },
      include: {
        developer: true,
        units: {
          include: {
            paymentPlan: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!compound) {
      return res.status(404).json({ success: false, error: 'Compound not found' });
    }
    
    res.json({ success: true, data: compound });
  } catch (error) {
    console.error('Error fetching compound:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch compound' });
  }
});

/**
 * @swagger
 * /api/compounds/slug/{slug}:
 *   get:
 *     summary: Get compound by slug with units
 *     tags: [Compounds]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Compound slug
 *     responses:
 *       200:
 *         description: Compound details with units
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CompoundWithUnits'
 *       404:
 *         description: Compound not found
 */
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const compound = await prisma.compound.findUnique({
      where: { slug },
      include: {
        developer: true,
        units: {
          include: {
            paymentPlan: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!compound) {
      return res.status(404).json({ success: false, error: 'Compound not found' });
    }
    
    res.json({ success: true, data: compound });
  } catch (error) {
    console.error('Error fetching compound by slug:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch compound' });
  }
});

export { router as compoundRoutes }; 