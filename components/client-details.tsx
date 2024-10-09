"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Client, Lawsuit, Nda } from "@/types/Client";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ArrowLeft, Trash2 } from "lucide-react";
import { FileUploader } from "@/components/file-uploader";
import { getClientById } from "@/lib/getClient";

interface ClientDetailsProps {
  id: string;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ id }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isNdaDialogOpen, setIsNdaDialogOpen] = useState(false);
  const [isLawsuitDialogOpen, setIsLawsuitDialogOpen] = useState(false);
  const [ndaDocuments, setNdaDocuments] = useState<File[]>([]);
  const [lawsuitDocuments, setLawsuitDocuments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleNdaDocumentUpload = (files: File[]) => {
    setNdaDocuments((prevDocuments) => [...prevDocuments, ...files]);
  };

  const handleLawsuitDocumentUpload = (files: File[]) => {
    setLawsuitDocuments((prevDocuments) => [...prevDocuments, ...files]);
  };

  const handleNdaUploadSubmit = async () => {
    if (ndaDocuments.length === 0) {
      setIsNdaDialogOpen(false);
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      ndaDocuments.forEach((doc) => formData.append("file", doc));

      const uploadResponse = await fetch(
        `http://localhost:8000/client/${id}/nda/upload`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          body: formData,
        },
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload documents");
      }

      console.log("Documents uploaded successfully");
      setIsNdaDialogOpen(false);
      setNdaDocuments([]);
      getClientById(id).then((clientData) => {
        if (clientData) {
          setClient(clientData);
        }
      });
    } catch (error) {
      console.error("Error uploading documents:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLawsuitUploadSubmit = async () => {
    if (lawsuitDocuments.length === 0) {
      setIsLawsuitDialogOpen(false);
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      lawsuitDocuments.forEach((doc) => formData.append("file", doc));

      const uploadResponse = await fetch(
        `http://localhost:8000/client/${id}/lawsuit/upload`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          body: formData,
        },
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload documents");
      }

      console.log("Documents uploaded successfully");
      setIsLawsuitDialogOpen(false);
      setLawsuitDocuments([]);
      getClientById(id).then((clientData) => {
        if (clientData) {
          setClient(clientData);
        }
      });
    } catch (error) {
      console.error("Error uploading documents:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteNda = async (ndaId: number) => {
    try {
      const deleteResponse = await fetch(
        `http://localhost:8000/client/${id}/nda/${ndaId}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete NDA");
      }

      console.log("NDA deleted successfully");
      getClientById(id).then((clientData) => {
        if (clientData) {
          setClient(clientData);
        }
      });
    } catch (error) {
      console.error("Error deleting NDA:", error);
    }
  };

  const handleDeleteLawsuit = async (lawsuitId: number) => {
    try {
      const deleteResponse = await fetch(
        `http://localhost:8000/client/${id}/lawsuit/${lawsuitId}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete lawsuit");
      }

      console.log("Lawsuit deleted successfully");
      // Refresh client data
      getClientById(id).then((clientData) => {
        if (clientData) {
          setClient(clientData);
        }
      });
    } catch (error) {
      console.error("Error deleting lawsuit:", error);
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
          <Dialog
            open={isNdaDialogOpen}
            onOpenChange={(open) => {
              setIsNdaDialogOpen(open);
              if (!open) setNdaDocuments([]);
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]">
                <Plus className="mr-2 h-4 w-4" /> Add NDA
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New NDA</DialogTitle>
              </DialogHeader>
              <FileUploader onUpload={handleNdaDocumentUpload} />
              <div className="space-y-2">
                <Label>Uploaded Documents</Label>
                {ndaDocuments.length > 0 ? (
                  <ul className="space-y-2">
                    {ndaDocuments.map((doc, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-[#f6c90e]" />
                        <span className="text-sm text-gray-600">
                          {doc.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No documents uploaded yet.
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
                  onClick={handleNdaUploadSubmit}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Finish"}
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
                <TableCell className="font-medium">
                  {nda.name || "N/A"}
                </TableCell>
                <TableCell>{nda.date || "N/A"}</TableCell>
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
            onOpenChange={(open) => {
              setIsLawsuitDialogOpen(open);
              if (!open) setLawsuitDocuments([]);
            }}
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
              <FileUploader onUpload={handleLawsuitDocumentUpload} />
              <div className="space-y-2">
                <Label>Uploaded Documents</Label>
                {lawsuitDocuments.length > 0 ? (
                  <ul className="space-y-2">
                    {lawsuitDocuments.map((doc, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-[#f6c90e]" />
                        <span className="text-sm text-gray-600">
                          {doc.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No documents uploaded yet.
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
                  onClick={handleLawsuitUploadSubmit}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Finish"}
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
                <TableCell className="font-medium">
                  {lawsuit.name || "N/A"}
                </TableCell>
                <TableCell>{lawsuit.date || "N/A"}</TableCell>
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
      <div className="flex items-center justify-center">
        <Button
          type="button"
          className="mt-20 bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
          onClick={() => router.push(`/client/${id}/lawsuit`)}
        >
          Get Points
        </Button>
      </div>
    </div>
  );
};
