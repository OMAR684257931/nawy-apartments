import { Router, Request, Response } from 'express'
import { uploadMultiple, uploadSingle } from '../middleware/upload'
import path from 'path'

const router = Router()

/**
 * @swagger
 * /api/upload/images:
 *   post:
 *     summary: Upload multiple images
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
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
 *                     type: string
 */
router.post('/images', uploadMultiple, (req: Request, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No images uploaded' 
      })
    }

    const uploadedFiles = (req.files as Express.Multer.File[]).map(file => {
      return `${process.env.API_URL || 'http://localhost:5000'}/uploads/${file.filename}`
    })

    res.json({
      success: true,
      data: uploadedFiles
    })
  } catch (error) {
    console.error('Error uploading images:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload images' 
    })
  }
})

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload single image
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: string
 */
router.post('/image', uploadSingle, (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image uploaded' 
      })
    }

    const imageUrl = `${process.env.API_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`

    res.json({
      success: true,
      data: imageUrl
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload image' 
    })
  }
})

export { router as uploadRoutes } 