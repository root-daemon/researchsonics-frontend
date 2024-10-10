"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Client } from "@/types/Client";
import Navbar from "./components/Navbar";
import ClientCard from "./components/ClientCard";
import CreateClient from "./components/CreateClient";
import { fetchClients, deleteClient } from "@/api/clientApi";

export default function Component() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const fetchedClients = await fetchClients();
      setClients(fetchedClients);
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteClient(clientId);
      setClients(clients.filter((client) => client._id !== clientId));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleClientCreated = () => {
    loadClients();
    setIsDialogOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />
      <motion.div
        className="container mx-auto p-4 sm:p-6 lg:p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
          <motion.h2
            className="mb-4 text-3xl font-bold text-gray-800 sm:mb-0"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Client Dashboard
          </motion.h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-[#f6c90e] text-gray-800 shadow-md transition-all duration-300 hover:bg-[#e0b60d] hover:shadow-lg">
                  <Plus className="mr-2 h-4 w-4" /> Add Client
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-fit border-2 border-[#f6c90e]">
              <CreateClient closeDialog={handleClientCreated} />
            </DialogContent>
          </Dialog>
        </div>
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex h-64 items-center justify-center"
              >
                <Loader2 className="h-12 w-12 animate-spin text-[#f6c90e]" />
              </motion.div>
            ) : clients.length > 0 ? (
              clients.map((client) => (
                <motion.div
                  key={client._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <ClientCard
                    client={client}
                    onDelete={handleDeleteClient}
                    onManage={() => router.push(`/client/${client._id}`)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                key="no-clients"
                variants={itemVariants}
                className="col-span-full mt-8 text-center text-gray-500"
              >
                No clients found. Add a new client to get started!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
