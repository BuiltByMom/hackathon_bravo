import { Router } from 'express';
import { getContacts, createContact, deleteContact } from '../controllers/contacts';

const router = Router();

router.get('/:userId', getContacts);
router.post('/', createContact);
router.delete('/:userId/:id', deleteContact);

export const contactsRouter = router;
