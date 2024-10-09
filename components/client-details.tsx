"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Client, Lawsuit, Nda } from "@/types/Client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ArrowLeft, Trash2 } from "lucide-react";

const getClientById = async (id: string): Promise<Client | null> => {
  try {
    const response = await fetch(`http://localhost:8000/client/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch client");
    }

    const data = await response.json();

    const ndas =
      data.documents?.filter((doc: { path: string }) =>
        doc.path.includes("/nda/"),
      ) || [];

    const lawsuits =
      data.documents?.filter((doc: { path: string }) =>
        doc.path.includes("/lawsuit/"),
      ) || [];

    return {
      ...data,
      ndas,
      lawsuits,
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    return null;
  }
};

interface ClientDetailsProps {
  id: string;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ id }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isNdaDialogOpen, setIsNdaDialogOpen] = useState(false);
  const [isLawsuitDialogOpen, setIsLawsuitDialogOpen] = useState(false);
  const [newNda, setNewNda] = useState({ name: "", date: "" });
  const [newLawsuit, setNewLawsuit] = useState({
    name: "",
    date: "",
    status: "Pending",
  });
  const router = useRouter();

  useEffect(() => {
    if (id) {
      getClientById(id).then((clientData) => {
        if (clientData) {
          setClient(clientData);
        }
      });
    }
  }, [id]);

  // Handle adding new NDA
  const handleAddNda = () => {
    if (newNda.name && newNda.date && client) {
      const updatedClient = {
        ...client,
        ndas: [
          ...(client.ndas || []),
          { ...newNda, id: (client.ndas?.length || 0) + 1, path: "" }, // Ensure path is added
        ],
      };

      setClient(updatedClient);
      setNewNda({ name: "", date: "" });
      setIsNdaDialogOpen(false);
    }
  };

  // Handle adding new lawsuit
  const handleAddLawsuit = () => {
    if (newLawsuit.name && newLawsuit.date && client) {
      const updatedClient = {
        ...client,
        lawsuits: [
          ...(client.lawsuits || []),
          {
            ...newLawsuit,
            id: (client.lawsuits?.length || 0) + 1,
            path: "", // Ensure path is added
          },
        ],
      };
      setClient(updatedClient);
      setNewLawsuit({ name: "", date: "", status: "Pending" });
      setIsLawsuitDialogOpen(false);
    }
  };

  // Handle deleting an NDA
  const handleDeleteNda = (ndaId: number) => {
    if (client) {
      const updatedClient = {
        ...client,
        ndas: client.ndas.filter((nda) => nda.id !== ndaId),
      };
      setClient(updatedClient);
    }
  };

  // Handle deleting a lawsuit
  const handleDeleteLawsuit = (lawsuitId: number) => {
    if (client) {
      const updatedClient = {
        ...client,
        lawsuits: client.lawsuits.filter((lawsuit) => lawsuit.id !== lawsuitId),
      };
      setClient(updatedClient);
    }
  };

  // Show a loading state while fetching data
  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Button
        onClick={() => router.push("/")}
        variant="outline"
        className="mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="mb-12 flex items-center space-x-4">
        <Avatar className="h-24 w-24 border-4 border-[#f6c90e]">
          <AvatarFallback className="bg-[#f6c90e] text-3xl text-gray-800">
            {client.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{client.name}</h1>
          <p className="text-xl text-gray-600">
            {client.ndas.length} NDAs, {client.lawsuits.length} Lawsuits
          </p>
        </div>
      </div>

      {/* NDA Section */}
      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-800">NDAs</h2>
          <Dialog open={isNdaDialogOpen} onOpenChange={setIsNdaDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]">
                <Plus className="mr-2 h-4 w-4" /> Add NDA
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New NDA</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nda-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="nda-name"
                    value={newNda.name}
                    onChange={(e) =>
                      setNewNda({ ...newNda, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nda-date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="nda-date"
                    type="date"
                    value={newNda.date}
                    onChange={(e) =>
                      setNewNda({ ...newNda, date: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleAddNda}
                  className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
                >
                  Add NDA
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {client.ndas.map((nda: Nda) => (
              <TableRow key={nda.id}>
                <TableCell className="font-medium">{nda.name}</TableCell>
                <TableCell>{nda.date}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNda(nda.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Lawsuit Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-800">Lawsuits</h2>
          <Dialog
            open={isLawsuitDialogOpen}
            onOpenChange={setIsLawsuitDialogOpen}
          >
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
                  <Label htmlFor="lawsuit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="lawsuit-name"
                    value={newLawsuit.name}
                    onChange={(e) =>
                      setNewLawsuit({ ...newLawsuit, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lawsuit-date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="lawsuit-date"
                    type="date"
                    value={newLawsuit.date}
                    onChange={(e) =>
                      setNewLawsuit({ ...newLawsuit, date: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lawsuit-status" className="text-right">
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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {client.lawsuits.map((lawsuit: Lawsuit) => (
              <TableRow key={lawsuit.id}>
                <TableCell className="font-medium">{lawsuit.name}</TableCell>
                <TableCell>{lawsuit.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      lawsuit.status === "Active"
                        ? "destructive"
                        : lawsuit.status === "Pending"
                          ? "default"
                          : "secondary"
                    }
                    className={
                      lawsuit.status === "Active"
                        ? "bg-red-500"
                        : lawsuit.status === "Pending"
                          ? "bg-[#f6c90e] text-gray-800"
                          : "bg-green-500"
                    }
                  >
                    {lawsuit.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLawsuit(lawsuit.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};
