const router = require('express').Router();
const ctrl = require('../controllers/significant.controller');
const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');
const { validate, schemas } = require('../middleware/validate.middleware');

/**
 * @swagger
 * /api/significants:
 *   get:
 *     summary: Get all significants
 *     description: Retrieve all active significants with pagination
 *     tags:
 *       - Significants
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of significants to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of significants to skip
 *     responses:
 *       200:
 *         description: List of significants
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
 *                     $ref: '#/components/schemas/Significant'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
router.get('/', ctrl.getAll);

/**
 * @swagger
 * /api/significants/priority/{priority}:
 *   get:
 *     summary: Get significants by priority
 *     description: Retrieve significants filtered by priority
 *     tags:
 *       - Significants
 *     parameters:
 *       - in: path
 *         name: priority
 *         required: true
 *         schema:
 *           type: integer
 *         description: Priority level
 *     responses:
 *       200:
 *         description: Significants with matching priority
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
 *                     $ref: '#/components/schemas/Significant'
 *                 priority:
 *                   type: integer
 */
router.get('/priority/:priority', ctrl.getByPriority);

/**
 * @swagger
 * /api/significants/{id}:
 *   get:
 *     summary: Get significant by ID
 *     description: Retrieve a single significant by its ID
 *     tags:
 *       - Significants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Significant ID
 *     responses:
 *       200:
 *         description: Significant details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Significant'
 *       404:
 *         description: Significant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', ctrl.getById);

/**
 * @swagger
 * /api/significants:
 *   post:
 *     summary: Create a new significant
 *     description: Create a new significant item (admin only)
 *     tags:
 *       - Significants
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - image_url
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *               description:
 *                 type: string
 *               image_url:
 *                 type: string
 *                 format: uri
 *               thumbnail_url:
 *                 type: string
 *                 format: uri
 *               icon_url:
 *                 type: string
 *                 format: uri
 *               highlight_text:
 *                 type: string
 *               priority:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Significant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Significant'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin role required
 */
router.post('/', auth, admin, ctrl.create);

/**
 * @swagger
 * /api/significants/{id}:
 *   put:
 *     summary: Update a significant
 *     description: Update an existing significant (admin only)
 *     tags:
 *       - Significants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Significant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image_url:
 *                 type: string
 *               thumbnail_url:
 *                 type: string
 *               icon_url:
 *                 type: string
 *               highlight_text:
 *                 type: string
 *               priority:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Significant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Significant'
 *       404:
 *         description: Significant not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin role required
 */
router.put('/:id', auth, admin, ctrl.update);

/**
 * @swagger
 * /api/significants/{id}:
 *   delete:
 *     summary: Delete a significant
 *     description: Delete a significant item (admin only)
 *     tags:
 *       - Significants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Significant ID
 *     responses:
 *       200:
 *         description: Significant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Significant not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin role required
 */
router.delete('/:id', auth, admin, ctrl.delete);

module.exports = router;
