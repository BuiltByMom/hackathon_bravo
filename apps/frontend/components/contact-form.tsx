import { CreateContactInput } from "@/context/useGetContacts";
import { motion } from "framer-motion";

export function ContactForm({
  formData,
  setFormData,
  handleSubmit,
  setIsOpen,
  isOpen,
}: {
  formData: CreateContactInput;
  setFormData: (formData: CreateContactInput) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -50 }}
      transition={{ duration: 0.1 }}
      className="flex w-full flex-col gap-4 items-center"
      exit={{ opacity: 0, y: -50 }}
    >
      {isOpen && (
        <form onSubmit={handleSubmit} className="flex w-2/3 flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Tag"
            value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Contact
          </button>
        </form>
      )}
    </motion.div>
  );
}
