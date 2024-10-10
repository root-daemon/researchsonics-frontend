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

export default function ClientDetailsPage({
  params,
}: {
  params: { clientId: string };
}) {
  const clientId = params.clientId;
  const [client, setClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState({
    nda: false,
    lawsuit: false,
  });
  const [documents, setDocuments] = useState({
    nda: [] as File[],
    lawsuit: [] as File[],
  });
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (clientId) {
      getClientById(clientId)
        .then(setClient)
        .catch((error) => {
          console.error("Error fetching client data:", error);
        });
    }
  }, [clientId]);

  const uploadDocuments = async (documents: File[], url: string) => {
    const formData = new FormData();
    documents.forEach((doc) => formData.append("file", doc));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload documents");
  };

  const deleteItem = async (url: string) => {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to delete item");
  };

  const handleUploadSubmit = async (type: "nda" | "lawsuit") => {
    const url = `http://localhost:8000/client/${clientId}/${type}/upload`;
    const documentList = type === "nda" ? documents.nda : documents.lawsuit;

    if (documentList.length === 0) {
      setIsDialogOpen((prev) => ({ ...prev, [type]: false }));
      return;
    }

    try {
      setIsUploading(true);
      await uploadDocuments(documentList, url);
      console.log(`${type} Documents uploaded successfully`);
      refreshClientData();
      setDocuments((prev) => ({ ...prev, [type]: [] }));
      setIsDialogOpen((prev) => ({ ...prev, [type]: false }));
    } catch (error) {
      console.error(`Error uploading ${type} documents:`, error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (type: "nda" | "lawsuit", itemId: number) => {
    const url = `http://localhost:8000/client/${clientId}/${type}/${itemId}`;
    try {
      await deleteItem(url);
      console.log(`${type} item deleted successfully`);
      refreshClientData();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const refreshClientData = () => {
    getClientById(clientId)
      .then(setClient)
      .catch((error) => {
        console.error("Error refreshing client data:", error);
      });
  };

  if (!client) return <div>Loading...</div>;

  const renderDocuments = (
    type: "nda" | "lawsuit",
    docs: (Nda | Lawsuit)[],
  ) => {
    return docs.map((doc: Nda | Lawsuit) => (
      <TableRow key={doc.id}>
        <TableCell className="font-medium">{doc.name || "N/A"}</TableCell>
        <TableCell>{doc.date || "N/A"}</TableCell>
        {type === "lawsuit" && "status" in doc && (
          <TableCell>
            <Badge
              className={
                doc.status === "Active"
                  ? "bg-red-500"
                  : doc.status === "Pending"
                    ? "bg-[#f6c90e] text-gray-800"
                    : "bg-green-500"
              }
            >
              {doc.status}
            </Badge>
          </TableCell>
        )}
        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(type, doc.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

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
            open={isDialogOpen.nda}
            onOpenChange={(open) =>
              setIsDialogOpen((prev) => ({ ...prev, nda: open }))
            }
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
              <FileUploader
                onUpload={(files) =>
                  setDocuments((prev) => ({ ...prev, nda: files }))
                }
              />
              <div className="space-y-2">
                <Label>Uploaded Documents</Label>
                {documents.nda.length > 0 ? (
                  <ul className="space-y-2">
                    {documents.nda.map((doc, index) => (
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
                  onClick={() => handleUploadSubmit("nda")}
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
          <TableBody>{renderDocuments("nda", client.ndas)}</TableBody>
        </Table>
      </section>

      {/* Lawsuit Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-800">Lawsuits</h2>
          <Dialog
            open={isDialogOpen.lawsuit}
            onOpenChange={(open) =>
              setIsDialogOpen((prev) => ({ ...prev, lawsuit: open }))
            }
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
              <FileUploader
                onUpload={(files) =>
                  setDocuments((prev) => ({ ...prev, lawsuit: files }))
                }
              />
              <div className="space-y-2">
                <Label>Uploaded Documents</Label>
                {documents.lawsuit.length > 0 ? (
                  <ul className="space-y-2">
                    {documents.lawsuit.map((doc, index) => (
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
                  onClick={() => handleUploadSubmit("lawsuit")}
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
          <TableBody>{renderDocuments("lawsuit", client.lawsuits)}</TableBody>
        </Table>
      </section>

      <div className="flex items-center justify-center">
        <Button
          type="button"
          className="mt-20 bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
          onClick={() => router.push(`/client/${clientId}/lawsuit`)}
        >
          Get Points
        </Button>
      </div>
    </div>
  );
}
