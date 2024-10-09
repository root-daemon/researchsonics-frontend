"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FileText, AlertTriangle, Plus, Trash2 } from "lucide-react";
import CreateClient from "./components/createClient";
import { Client, Document } from "@/types/Client";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => (
  <nav className="bg-white p-4 text-black">
    <div className="container mx-auto flex items-center justify-between">
      <h1 className="text-xl font-bold underline underline-offset-1">
        legaldash.ai
      </h1>
    </div>
  </nav>
);

const SkeletonCard = () => (
  <Card className="w-full animate-pulse border-2 border-[#f6c90e] shadow-lg">
    <CardHeader className="rounded-t-lg bg-white">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-300" />
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-gray-300" />
          <div className="h-3 w-32 rounded bg-gray-200" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4 rounded-b-lg bg-white">
      <div className="h-8 rounded bg-gray-200" />
      <div className="h-8 rounded bg-gray-200" />
      <div className="ml-auto h-8 w-32 rounded bg-gray-300" />
    </CardContent>
  </Card>
);

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/client/", {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();

      const processedClients: Client[] = data.map((client: any) => ({
        ...client,
        ndas:
          client.documents?.filter((doc: Document) =>
            doc.path.includes("/nda"),
          ) || [],
        lawsuits:
          client.documents?.filter((doc: Document) =>
            doc.path.includes("/lawsuit"),
          ) || [],
      }));

      setClients(processedClients);
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDeleteClient = async (clientId: string) => {
    try {
      await fetch(`http://localhost:8000/client/${clientId}`, {
        method: "DELETE",
      });
      setClients(clients.filter((client) => client._id !== clientId));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleClientCreated = () => {
    fetchClients();
    setIsDialogOpen(false);
  };

  const downloadNda = async (clientId: string, ndaSlug: string) => {
    const url = `http://localhost:8000/client/${clientId}/nda/${ndaSlug}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {},
      });

      if (!response.ok) {
        throw new Error(`Error downloading file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = ndaSlug; // Default filename

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading NDA:", error);
      alert("Failed to download NDA. Please try again.");
    }
  };
  const downloadLawSuit = async (clientId: string, lawSlug: string) => {
    const url = `http://localhost:8000/client/${clientId}/lawsuit/${lawSlug}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {},
      });

      if (!response.ok) {
        throw new Error(`Error downloading file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = lawSlug; // Default filename

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading LawSuit:", error);
      alert("Failed to download LawSuit. Please try again.");
    }
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
                    <Card className="w-full border-2 border-[#f6c90e] shadow-lg">
                      <CardHeader className="rounded-t-lg bg-white">
                        <div className="flex items-center space-x-4">
                          <Avatar className="border-2 border-[#f6c90e]">
                            <AvatarImage
                              src={client.avatar}
                              alt={client.name}
                            />
                            <AvatarFallback className="bg-[#f6c90e] text-gray-800">
                              {client.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-gray-800">
                              {client.name}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                              {client.ndas.length} NDAs,{" "}
                              {client.lawsuits.length} Lawsuits
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="rounded-b-lg bg-white">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="ndas">
                            <AccordionTrigger className="text-gray-700">
                              NDAs
                            </AccordionTrigger>
                            <AccordionContent>
                              <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                                {client.ndas.length > 0 ? (
                                  client.ndas.map((nda) => (
                                    <div
                                      key={nda.name}
                                      className="mb-2 flex items-center justify-between"
                                    >
                                      <div className="flex items-center">
                                        <FileText className="mr-2 h-4 w-4 text-[#f6c90e]" />
                                        <span className="text-gray-700">
                                          {nda.name}
                                        </span>
                                      </div>
                                      {/* Replace Badge with Button for download */}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-[#f6c90e] bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
                                        onClick={() =>
                                          downloadNda(client._id, nda.slug)
                                        }
                                      >
                                        View
                                      </Button>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-gray-500">
                                    No NDAs available.
                                  </p>
                                )}
                              </ScrollArea>
                            </AccordionContent>
                          </AccordionItem>
                          {/* ... Existing code for lawsuits ... */}
                          <AccordionItem value="lawsuits">
                            <AccordionTrigger className="text-gray-700">
                              Lawsuits
                            </AccordionTrigger>
                            <AccordionContent>
                              <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                                {client.lawsuits.length > 0 ? (
                                  client.lawsuits.map((lawsuit) => (
                                    <div
                                      key={lawsuit.name}
                                      className="mb-2 flex items-center justify-between"
                                    >
                                      <div className="flex items-center">
                                        <AlertTriangle className="mr-2 h-4 w-4 text-[#f6c90e]" />
                                        <span className="text-gray-700">
                                          {lawsuit.name}
                                        </span>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="border-[#f6c90e] bg-[#f6c90e] text-gray-800"
                                        onClick={() =>
                                          downloadLawSuit(
                                            client._id,
                                            lawsuit.slug,
                                          )
                                        }
                                      >
                                        View
                                      </Badge>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-gray-500">
                                    No lawsuits available.
                                  </p>
                                )}
                              </ScrollArea>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button
                            size="sm"
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() => handleDeleteClient(client._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
                            onClick={() => {
                              console.log(
                                `Navigating to /client/${client._id}`,
                              );
                              router.push(`/client/${client._id}`);
                            }}
                          >
                            Manage Client
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
