import { Request, Response } from 'express';
import { z } from 'zod';
import { contactService } from '../services/dataService';

// Define a custom interface for the Request object that includes the user property
interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// Validation schema for creating a contact
const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  tag: z.string().regex(/^@[a-z0-9_]{3,20}$/, 'Tag must start with @ and be 3-20 characters long'),
});

// Get all contacts for the authenticated user
export const getContacts = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const contacts = contactService.getByUserId(userId);
    return res.status(200).json(contacts);
  } catch (error) {
    console.error('Error getting contacts:', error);
    return res.status(500).json({ message: 'Failed to get contacts' });
  }
};

// Get a single contact by ID
export const getContact = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const contact = contactService.getById(id);

    if (!contact || contact.userId !== req.user.id) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    return res.status(200).json(contact);
  } catch (error) {
    console.error('Error getting contact:', error);
    return res.status(500).json({ message: 'Failed to get contact' });
  }
};

// Create a new contact
export const createContact = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.body.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const validatedData = createContactSchema.parse(req.body);

    // Check if a contact with the same email already exists for this user
    const existingContacts = contactService.getByUserId(req.body.user.id);
    const existingEmailContact = existingContacts.find(
      (contact) => contact.email === validatedData.email
    );

    if (existingEmailContact) {
      return res.status(400).json({ message: 'A contact with this email already exists' });
    }

    // Check if a contact with the same tag already exists for this user
    const existingTagContact = existingContacts.find(
      (contact) => contact.tag === validatedData.tag
    );

    if (existingTagContact) {
      return res.status(400).json({ message: 'A contact with this tag already exists' });
    }

    const contact = contactService.create({
      ...validatedData,
      userId: req.body.user.id,
    });

    return res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: 'Failed to create contact' });
  }
};

// Delete a contact
export const deleteContact = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const userId = req.params.userId;

    // Check if the contact exists and belongs to the user
    const contact = contactService.getById(id);
    if (!contact || contact.userId !== userId) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const success = contactService.delete(id);
    if (!success) {
      return res.status(500).json({ message: 'Failed to delete contact' });
    }

    return res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return res.status(500).json({ message: 'Failed to delete contact' });
  }
};
