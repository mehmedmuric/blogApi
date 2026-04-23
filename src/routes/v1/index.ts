import { Router} from 'express';

const router = Router();


import authRoutes from '@/routes/v1/auth';
import userRoutes from '@/routes/v1/user';



router.get('/', (req, res) => {
    res.status(200).json({
        message: 'API is running!',
        status: 'success',
        version: '1.0.0',
        docs: 'https://example.com/api-docs',
        timestamp: new Date().toISOString(),
    });
});


router.use('/auth', authRoutes);
router.use('/users', userRoutes);







export default router;