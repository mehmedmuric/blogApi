import { Router} from 'express';

const router = Router();


router.get('/', (req, res) => {
    res.status(200).json({
        message: 'API is running!',
        status: 'success',
        version: '1.0.0',
        docs: 'https://example.com/api-docs',
        timestamp: new Date().toISOString(),
    });
});




export default router;