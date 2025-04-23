import { Router } from 'express';
import {
  registerPasskey,
  finishPasskey,
  loginPasskey,
  loginFinishPasskey,
} from '../controllers/registerPasskey';

const router = Router();

router.post('/register/start', registerPasskey);
router.post('/register/finish', finishPasskey);
router.post('/login/start', loginPasskey);
router.post('/login/finish', loginFinishPasskey);

export const passkeyRouter = router;
