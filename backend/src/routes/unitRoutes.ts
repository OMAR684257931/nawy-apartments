import { Router } from 'express';
import { UnitController } from '../controllers/unitController';

const router = Router();

/**
 * @swagger
 * /api/units:
 *   get:
 *     summary: Get all units with filters
 *     tags: [Units]
 *     parameters:
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: unit_area_min
 *         schema:
 *           type: number
 *         description: Minimum unit area filter
 *       - in: query
 *         name: unit_area_max
 *         schema:
 *           type: number
 *         description: Maximum unit area filter
 *       - in: query
 *         name: property_types
 *         schema:
 *           type: string
 *         description: Property types filter (comma-separated)
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: number
 *         description: Number of bedrooms filter
 *       - in: query
 *         name: compound_id
 *         schema:
 *           type: string
 *         description: Compound ID filter
 *       - in: query
 *         name: developer_id
 *         schema:
 *           type: string
 *         description: Developer ID filter
 *       - in: query
 *         name: amenities
 *         schema:
 *           type: string
 *         description: Amenities filter (comma-separated)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Area filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of units
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
 *                     $ref: '#/components/schemas/Unit'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                     totalPages:
 *                       type: number
 */
router.get('/', UnitController.getUnits);

/**
 * @swagger
 * /api/units/{id}:
 *   get:
 *     summary: Get unit by ID
 *     tags: [Units]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unit ID
 *     responses:
 *       200:
 *         description: Unit details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Unit'
 *       404:
 *         description: Unit not found
 */
router.get('/:id', UnitController.getUnitById);

/**
 * @swagger
 * /api/units:
 *   post:
 *     summary: Create a new unit
 *     tags: [Units]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUnitRequest'
 *     responses:
 *       201:
 *         description: Unit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Unit'
 */
router.post('/', UnitController.createUnit);

export { router as unitRoutes }; 