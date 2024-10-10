"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Client } from "@/types/Client";
import Navbar from "./components/Navbar";
import ClientCard from "./components/ClientCard";
import CreateClient from "./components/CreateClient";
import SkeletonCard from "./components/SkeletonCard";
import { fetchClients, deleteClient } from "@/api/clientApi";

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Client Dashboard</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]">
                <Plus className="mr-2 h-4 w-4" /> Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-[#f6c90e]">
              <CreateClient closeDialog={handleClientCreated} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SkeletonCard />
                  </motion.div>
                ))
              : clients.map((client) => (
                  <motion.div
                    key={client._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ClientCard
                      client={client}
                      onDelete={handleDeleteClient}
                      onManage={() => router.push(`/client/${client._id}`)}
                    />
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
