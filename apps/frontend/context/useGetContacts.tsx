"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { useAuth } from "./useAuthContext";
import { User } from "@sophon/shared";

export interface Contact {
  id: string;
  name: string;
  email: string;
  tag: string;
  address: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export type CreateContactInput = Omit<
  Contact,
  "id" | "createdAt" | "updatedAt"
>;

interface ContactContextType {
  contacts: Contact[] | null;
  isLoading: boolean;
  error: string | null;
  getContacts: () => Promise<void>;
  createContact: (contact: CreateContactInput) => Promise<Contact | null>;
  deleteContact: (id: string) => Promise<boolean>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export function ContactProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      getContacts();
    }
  }, [token]);

  const getContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/contacts/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch contacts"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createContact = async (contact: CreateContactInput) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...contact, user: { id: user?.id } }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create contact");
      }
      const data = await response.json();
      setContacts((prev) => (prev ? [...prev, data] : [data]));
      return data;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create contact"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `${API_URL}/api/contacts/${user?.id}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }
      setContacts((prev) => (prev ? prev.filter((c) => c.id !== id) : null));
      return true;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete contact"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        isLoading,
        error,
        getContacts,
        createContact,
        deleteContact,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export function useContact() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within a ContactProvider");
  }
  return context;
}
