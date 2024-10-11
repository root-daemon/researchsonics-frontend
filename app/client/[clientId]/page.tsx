"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Client, Lawsuit, Nda } from "@/types/Client";
import {
  FileText,
  Plus,
  ArrowLeft,
  Trash2,
  Loader2,
  Download,
} from "lucide-react";
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
import { FileUploader } from "@/components/file-uploader";
import { getClientById } from "@/lib/getClient";
import { cn } from "@/lib/utils";
import Navbar from "@/app/components/Navbar";

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
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (clientId) {
      setIsLoading(true);
      getClientById(clientId)
        .then(setClient)
        .catch((error) => {
          console.error("Error fetching client data:", error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [clientId]);

  const uploadDocuments = async (documents: File[], url: string) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      documents.forEach((doc) => formData.append("file", doc));

      fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          accept: "application/json",
        },
      }).then((response) => {
        if (response.ok) {
          resolve(response);
        } else {
          reject(new Error("Failed to upload documents"));
        }
      });
    });
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

  const downloadDocument = async (
    clientId: string,
    docType: string,
    docSlug: string,
  ) => {
    const url = `http://localhost:8000/client/${clientId}/${docType}/${docSlug}`;
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
      let filename = docSlug;

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
      console.error(`Error downloading ${docType}:`, error);
      alert(`Failed to download ${docType}. Please try again.`);
    }
  };

  const handleDelete = async (type: "nda" | "lawsuit", slug: string) => {
    const url = `http://localhost:8000/client/${clientId}/${type}/${slug}`;
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

  const renderDocuments = (
    type: "nda" | "lawsuit",
    docs: (Nda | Lawsuit)[],
  ) => {
    return (
      <>
        <AnimatePresence>
          {docs.map((doc: Nda | Lawsuit) => (
            <motion.tr
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TableCell className="font-medium">{doc.name || "N/A"}</TableCell>
              {type === "lawsuit" && "status" in doc && (
                <TableCell>
                  <Badge
                    className={cn(
                      "transition-colors duration-200",
                      doc.status === "Active"
                        ? "bg-red-500"
                        : doc.status === "Pending"
                          ? "bg-[#f6c90e] text-gray-800"
                          : "bg-green-500",
                    )}
                  >
                    {doc.status}
                  </Badge>
                </TableCell>
              )}
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadDocument(clientId, type, doc.slug)}
                  className="mr-2 text-blue-500 transition-colors duration-200 hover:text-blue-700"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(type, doc.slug)}
                  className="text-red-500 transition-colors duration-200 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </AnimatePresence>
      </>
    );
  };
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#f6c90e]" />
      </div>
    );
  }

  if (!client) return <div>No client data found.</div>;

  return (
    <>
      <Navbar />

      <div className="bg-gray-100 xl:px-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gray-100 p-8"
        >
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="mb-8 transition-transform duration-200 hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12 flex items-center space-x-4"
          >
            <Avatar className="h-24 w-24 border-4 border-[#f6c90e] transition-transform duration-200 hover:scale-110">
              <AvatarFallback className="bg-[#f6c90e] text-3xl text-gray-800">
                {client.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                {client.name}
              </h1>
              <p className="text-xl text-gray-600">
                {client.ndas.length} NDAs, {client.lawsuits.length} Lawsuits
              </p>
            </div>
          </motion.div>

          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-gray-800">NDAs</h2>
              <Dialog
                open={isDialogOpen.nda}
                onOpenChange={(open) =>
                  setIsDialogOpen((prev) => ({ ...prev, nda: open }))
                }
              >
                <DialogTrigger asChild>
                  <Button className="bg-[#f6c90e] text-gray-800 transition-colors duration-200 hover:bg-[#e0b60d]">
                    <Plus className="mr-2 h-4 w-4" /> Add NDA
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-fit">
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
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center space-x-2"
                          >
                            <FileText className="h-4 w-4 text-[#f6c90e]" />
                            <span className="text-sm text-gray-600">
                              {doc.name}
                            </span>
                          </motion.li>
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
                      className="bg-[#f6c90e] text-gray-800 transition-colors duration-200 hover:bg-[#e0b60d]"
                      onClick={() => handleUploadSubmit("nda")}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Finish"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderDocuments("nda", client.ndas)}</TableBody>
            </Table>
          </motion.section>

          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-gray-800">Lawsuits</h2>
              <Dialog
                open={isDialogOpen.lawsuit}
                onOpenChange={(open) =>
                  setIsDialogOpen((prev) => ({ ...prev, lawsuit: open }))
                }
              >
                <DialogTrigger asChild>
                  <Button className="bg-[#f6c90e] text-gray-800 transition-colors duration-200 hover:bg-[#e0b60d]">
                    <Plus className="mr-2 h-4 w-4" /> Add Lawsuit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-fit">
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
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center space-x-2"
                          >
                            <FileText className="h-4 w-4 text-[#f6c90e]" />
                            <span className="text-sm text-gray-600">
                              {doc.name}
                            </span>
                          </motion.li>
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
                      className="bg-[#f6c90e] text-gray-800 transition-colors duration-200 hover:bg-[#e0b60d]"
                      onClick={() => handleUploadSubmit("lawsuit")}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Finish"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderDocuments("lawsuit", client.lawsuits)}
              </TableBody>
            </Table>
          </motion.section>

          <div className="flex items-center justify-center">
            <Button
              type="button"
              className="mt-20 bg-[#f6c90e] text-gray-800 transition-all duration-200 hover:scale-105 hover:bg-[#e0b60d]"
              onClick={() => router.push(`/client/${clientId}/lawsuit`)}
            >
              Get Points
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
