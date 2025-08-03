import { Request, Response } from 'express'
import { UnitService } from '../services/unitService'
import { validateUnitData, validateUnitFilters, validateId } from '../validators/unitValidators'
import { logger } from '../utils/logger'

export class UnitController {
  /**
   * Get units with filters and pagination
   */
  static async getUnits(req: Request, res: Response) {
    try {
      const filters = validateUnitFilters(req.query)
      
      const result = await UnitService.getUnits(filters)
      
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      })
    } catch (error) {
      logger.error('Error fetching units:', error)
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Invalid filter parameters'
      })
    }
  }

  /**
   * Get unit by ID
   */
  static async getUnitById(req: Request, res: Response) {
    try {
      const id = validateId(req.params.id)
      
      const unit = await UnitService.getUnitById(id)
      
      if (!unit) {
        return res.status(404).json({
          success: false,
          error: 'Unit not found'
        })
      }
      
      res.json({
        success: true,
        data: unit
      })
    } catch (error) {
      logger.error('Error fetching unit:', error)
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Invalid unit ID'
      })
    }
  }

  /**
   * Create new unit
   */
  static async createUnit(req: Request, res: Response) {
    try {
      const unitData = validateUnitData(req.body)
      
      const unit = await UnitService.createUnit(unitData)
      
      res.status(201).json({
        success: true,
        data: unit
      })
    } catch (error) {
      logger.error('Error creating unit:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          return res.status(409).json({
            success: false,
            error: error.message
          })
        }
        if (error.message.includes('not found')) {
          return res.status(404).json({
            success: false,
            error: error.message
          })
        }
      }
      
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create unit'
      })
    }
  }

  /**
   * Get compounds
   */
  static async getCompounds(req: Request, res: Response) {
    try {
      const compounds = await UnitService.getCompounds()
      
      res.json({
        success: true,
        data: compounds
      })
    } catch (error) {
      logger.error('Error fetching compounds:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch compounds'
      })
    }
  }

  /**
   * Get developers
   */
  static async getDevelopers(req: Request, res: Response) {
    try {
      const developers = await UnitService.getDevelopers()
      
      res.json({
        success: true,
        data: developers
      })
    } catch (error) {
      logger.error('Error fetching developers:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch developers'
      })
    }
  }
} 