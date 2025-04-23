import { Router } from 'express';
import { signup, login } from '../controllers/auth';

const router = Router();

// router.post('/signup', signup);
// router.post('/login', login);

console.log('signup', signup, 'login', login);

export const authRouter = router;
