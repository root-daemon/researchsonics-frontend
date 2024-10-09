"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

// This would typically come from an API or database
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

interface ClientDetailsProps {
  id: number;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ id }) => {
  const [client, setClient] = useState(
    id ? getClientById(parseInt(id as unknown as string, 10)) : null,
  );
  const [isNdaDialogOpen, setIsNdaDialogOpen] = useState(false);
  const [isLawsuitDialogOpen, setIsLawsuitDialogOpen] = useState(false);
  const [newNda, setNewNda] = useState({ name: "", date: "" });
  const [newLawsuit, setNewLawsuit] = useState({
    name: "",
    date: "",
    status: "Pending",
  });

  const handleAddNda = () => {
    if (newNda.name && newNda.date && client) {
      const updatedClient = {
        ...client,
        ndas: [
          ...(client.ndas || []),
          { ...newNda, id: (client.ndas?.length || 0) + 1 },
        ],
      };

      setClient(updatedClient);
      setNewNda({ name: "", date: "" });
      setIsNdaDialogOpen(false);
    }
  };

  const handleAddLawsuit = () => {
    if (newLawsuit.name && newLawsuit.date && client) {
      const updatedClient = {
        ...client,
        lawsuits: [
          ...(client.lawsuits || []),
          { ...newLawsuit, id: (client.lawsuits?.length || 0) + 1 },
        ],
      };
      setClient(updatedClient);
      setNewLawsuit({ name: "", date: "", status: "Pending" });
      setIsLawsuitDialogOpen(false);
    }
  };

  const handleDeleteNda = (ndaId: number) => {
    if (client) {
      const updatedClient = {
        ...client,
        ndas: client.ndas.filter((nda) => nda.id !== ndaId),
      };
      setClient(updatedClient);
    }
  };

  const handleDeleteLawsuit = (lawsuitId: number) => {
    if (client) {
      const updatedClient = {
        ...client,
        lawsuits: client.lawsuits.filter((lawsuit) => lawsuit.id !== lawsuitId),
      };
      setClient(updatedClient);
    }
  };

  if (!client) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <Card className="mb-6 w-full border-2 border-[#f6c90e] shadow-lg">
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
        </Card>

        <Card className="mb-6 w-full border-2 border-[#f6c90e] shadow-lg">
          <CardHeader className="rounded-t-lg bg-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-gray-800">NDAs</CardTitle>
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
          </CardHeader>
          <CardContent className="rounded-b-lg bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.ndas.map((nda) => (
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
          </CardContent>
        </Card>

        <Card className="w-full border-2 border-[#f6c90e] shadow-lg">
          <CardHeader className="rounded-t-lg bg-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-gray-800">Lawsuits</CardTitle>
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
          </CardHeader>
          <CardContent className="rounded-b-lg bg-white">
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
                {client.lawsuits.map((lawsuit) => (
                  <TableRow key={lawsuit.id}>
                    <TableCell className="font-medium">
                      {lawsuit.name}
                    </TableCell>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
