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
import { FileText, AlertTriangle, Plus } from "lucide-react";
import CreateClient from "./components/createClient";
import { Client, Document } from "@/types/Client";

const Navbar = () => (
  <nav className="bg-white p-4 text-black">
    <div className="container mx-auto flex items-center justify-between">
      <h1 className="text-xl font-bold underline underline-offset-1">
        legaldash.ai
      </h1>
    </div>
  </nav>
);

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
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
      }
    };

    fetchClients();
  }, []);

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
              <CreateClient closeDialog={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card
              key={client._id}
              className="w-full border-2 border-[#f6c90e] shadow-lg"
            >
              <CardHeader className="rounded-t-lg bg-white">
                <div className="flex items-center space-x-4">
                  <Avatar className="border-2 border-[#f6c90e]">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback className="bg-[#f6c90e] text-gray-800">
                      {client.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-gray-800">
                      {client.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {client.ndas.length} NDAs, {client.lawsuits.length}{" "}
                      Lawsuits
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
                              <Badge
                                variant="outline"
                                className="border-[#f6c90e] bg-[#f6c90e] text-gray-800"
                              >
                                View
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No NDAs available.</p>
                        )}
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
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
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      console.log(`Navigating to /client/${client._id}`);
                      router.push(`/client/${client._id}`);
                    }}
                  >
                    View Details
                  </Button>

                  <Button
                    size="sm"
                    className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
                  >
                    Manage Client
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
