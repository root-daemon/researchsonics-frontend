"use client";

import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, AlertTriangle, Plus, ArrowLeft } from "lucide-react";
const getClientById = (id: number) => {
  const clients = [
    {
      id: 1,
      name: "Acme Corp",
      avatar: "/placeholder.svg?height=40&width=40",
      ndas: [
        { id: 1, name: "General NDA", date: "2023-01-15" },
        { id: 2, name: "Project X NDA", date: "2023-03-22" },
      ],
      lawsuits: [
        {
          id: 1,
          name: "Patent Infringement Case",
          date: "2023-05-10",
          status: "Active",
        },
      ],
    },
    {
      id: 2,
      name: "TechStart Inc",
      avatar: "/placeholder.svg?height=40&width=40",
      ndas: [{ id: 3, name: "Confidentiality Agreement", date: "2023-02-01" }],
      lawsuits: [],
    },
    {
      id: 3,
      name: "Global Solutions Ltd",
      avatar: "/placeholder.svg?height=40&width=40",
      ndas: [
        { id: 4, name: "Non-Compete Agreement", date: "2023-04-05" },
        { id: 5, name: "IP Protection NDA", date: "2023-04-06" },
      ],
      lawsuits: [
        {
          id: 2,
          name: "Contract Dispute",
          date: "2023-06-15",
          status: "Pending",
        },
        {
          id: 3,
          name: "Employee Lawsuit",
          date: "2023-07-01",
          status: "Settled",
        },
      ],
    },
  ];
  return clients.find((client) => client.id === id);
};
export function ClientDetailsComponent({ id }: { id: number }) {
  const [client, setClient] = useState(getClientById(id));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLawsuit, setNewLawsuit] = useState({
    name: "",
    date: "",
    status: "Pending",
  });

  const handleAddLawsuit = () => {
    if (newLawsuit.name && newLawsuit.date) {
      const updatedClient = {
        ...client!,
        lawsuits: [
          ...client!.lawsuits,
          { ...newLawsuit, id: client!.lawsuits.length + 1 },
        ],
      };
      setClient(updatedClient);
      setNewLawsuit({ name: "", date: "", status: "Pending" });
      setIsDialogOpen(false);
    }
  };

  if (!client) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <Card className="w-full border-2 border-[#f6c90e] shadow-lg">
          <CardHeader className="rounded-t-lg bg-white">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-2 border-[#f6c90e]">
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback className="bg-[#f6c90e] text-2xl text-gray-800">
                  {client.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl text-gray-800">
                  {client.name}
                </CardTitle>
                <CardDescription className="text-xl text-gray-600">
                  {client.ndas.length} NDAs, {client.lawsuits.length} Lawsuits
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="rounded-b-lg bg-white">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ndas">
                <AccordionTrigger className="text-xl text-gray-700 hover:text-[#f6c90e]">
                  NDAs
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    {client.ndas.map((nda) => (
                      <div
                        key={nda.id}
                        className="mb-4 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <FileText className="mr-2 h-6 w-6 text-[#f6c90e]" />
                          <span className="text-lg text-gray-700">
                            {nda.name}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-[#f6c90e] bg-[#f6c90e] text-lg text-gray-800"
                        >
                          {nda.date}
                        </Badge>
                      </div>
                    ))}
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="lawsuits">
                <AccordionTrigger className="text-xl text-gray-700 hover:text-[#f6c90e]">
                  Lawsuits
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    {client.lawsuits.map((lawsuit) => (
                      <div
                        key={lawsuit.id}
                        className="mb-4 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <AlertTriangle className="mr-2 h-6 w-6 text-[#f6c90e]" />
                          <span className="text-lg text-gray-700">
                            {lawsuit.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              lawsuit.status === "Active"
                                ? "destructive"
                                : lawsuit.status === "Pending"
                                  ? "default"
                                  : "secondary"
                            }
                            className={`text-lg ${
                              lawsuit.status === "Active"
                                ? "bg-red-500"
                                : lawsuit.status === "Pending"
                                  ? "bg-[#f6c90e] text-gray-800"
                                  : "bg-green-500"
                            }`}
                          >
                            {lawsuit.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-lg text-gray-600"
                          >
                            {lawsuit.date}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-6 flex justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]">
                    <Plus className="mr-2 h-4 w-4" /> Add Lawsuit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Lawsuit</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newLawsuit.name}
                        onChange={(e) =>
                          setNewLawsuit({ ...newLawsuit, name: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={newLawsuit.date}
                        onChange={(e) =>
                          setNewLawsuit({ ...newLawsuit, date: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select
                        value={newLawsuit.status}
                        onValueChange={(value) =>
                          setNewLawsuit({ ...newLawsuit, status: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Settled">Settled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddLawsuit}
                      className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
                    >
                      Add Lawsuit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
