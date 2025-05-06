"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.createContact = exports.getContact = exports.getContacts = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schema for creating a contact
const createContactSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email format'),
    tag: zod_1.z.string().regex(/^@[a-z0-9_]{3,20}$/, 'Tag must start with @ and be 3-20 characters long'),
});
// Get all contacts for the authenticated user
const getContacts = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const contacts = await prisma.contact.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return res.status(200).json(contacts);
    }
    catch (error) {
        console.error('Error getting contacts:', error);
        return res.status(500).json({ message: 'Failed to get contacts' });
    }
};
exports.getContacts = getContacts;
// Get a single contact by ID
const getContact = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const contact = await prisma.contact.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
        });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        return res.status(200).json(contact);
    }
    catch (error) {
        console.error('Error getting contact:', error);
        return res.status(500).json({ message: 'Failed to get contact' });
    }
};
exports.getContact = getContact;
// Create a new contact
const createContact = async (req, res) => {
    try {
        if (!req.body.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const validatedData = createContactSchema.parse(req.body);
        // Check if a contact with the same email already exists for this user
        const existingEmailContact = await prisma.contact.findFirst({
            where: {
                email: validatedData.email,
                userId: req.body.user.id,
            },
        });
        if (existingEmailContact) {
            return res.status(400).json({ message: 'A contact with this email already exists' });
        }
        // Check if a contact with the same tag already exists for this user
        const existingTagContact = await prisma.contact.findFirst({
            where: {
                tag: validatedData.tag,
                userId: req.body.user.id,
            },
        });
        if (existingTagContact) {
            return res.status(400).json({ message: 'A contact with this tag already exists' });
        }
        const contact = await prisma.contact.create({
            data: {
                ...validatedData,
                userId: req.body.user.id,
            },
        });
        return res.status(201).json(contact);
    }
    catch (error) {
        console.error('Error creating contact:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Failed to create contact' });
    }
};
exports.createContact = createContact;
// Delete a contact
const deleteContact = async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        // Check if the contact exists and belongs to the user
        const existingContact = await prisma.contact.findFirst({
            where: {
                id,
                userId: req.params.userId,
            },
        });
        if (!existingContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        await prisma.contact.delete({
            where: {
                id,
                userId: req.params.userId,
            },
        });
        return res.status(200).json({ message: 'Contact deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting contact:', error);
        return res.status(500).json({ message: 'Failed to delete contact' });
    }
};
exports.deleteContact = deleteContact;
