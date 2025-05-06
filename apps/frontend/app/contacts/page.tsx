"use client";

import React, { useState } from "react";
import { useContact, CreateContactInput } from "@/context/useGetContacts";
import { motion } from "framer-motion";
import { IconClose } from "@/components/common/icons/IconClose";
import { ContactForm } from "@/components/contact-form";
import { cl } from "@/lib/utils";
import { ConfirmationModal } from "@/components/confirmation-modal";

const ContactsPage = () => {
  const { contacts, isLoading, error, createContact, deleteContact } =
    useContact();
  const [isOpen, setIsOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateContactInput>({
    name: "",
    email: "",
    tag: "",
    address: "",
    userId: "",
    user: {
      id: "",
      email: "",
      tag: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    const result = await createContact(formData);
    if (result) {
      setFormData({
        name: "",
        email: "",
        tag: "",
        address: "",
        userId: "",
        user: {
          id: "",
          email: "",
          tag: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    setContactToDelete(id);
  };

  const confirmDelete = async () => {
    if (contactToDelete) {
      await deleteContact(contactToDelete);
      setContactToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4 justify-between items-center mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <button onClick={() => setIsOpen(!isOpen)} className={"p-2 rounded"}>
            <motion.div
              animate={{ rotate: isOpen ? 0 : 45 }}
              transition={{ duration: 0.3 }}
              exit={{ rotate: 0 }}
              className={cl(
                "cursor-pointer rounded-full p-3 bg-gray-200",
                isOpen ? "rotate-45" : "rotate-0"
              )}
            >
              <IconClose />
            </motion.div>
          </button>
        </div>
        <ContactForm
          isOpen={isOpen}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          setIsOpen={setIsOpen}
        />
      </div>

      <div className="grid gap-4">
        {contacts && contacts.length > 0 ? (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-bold">{contact.name}</h2>
                <p>{contact.email}</p>
                <p className="text-gray-500">{contact.tag}</p>
              </div>
              <button
                onClick={() => handleDelete(contact.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                <IconClose />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No contacts found</div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!contactToDelete}
        onClose={() => setContactToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ContactsPage;
