"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/file-uploader";
import { FileText, ChevronRight, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CreateClient({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const [clientName, setClientName] = useState("");
  const [clientDescription, setClientDescription] = useState("");
  const [activeTab, setActiveTab] = useState("name");
  const [documents, setDocuments] = useState<File[]>([]);
  const [clientId, setClientId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDocumentUpload = (files: File[]) => {
    setDocuments((prevDocuments) => [...prevDocuments, ...files]);
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (clientName.trim() && clientDescription.trim()) {
      setIsSubmitting(true);
      try {
        const clientData = {
          name: clientName,
          description: clientDescription,
          documents: [],
        };

        const response = await fetch(
          "https://legaldash-ai-mgj7.onrender.com/client/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify(clientData),
          },
        );

        if (!response.ok) throw new Error("Failed to create client");

        const result = await response.json();
        setClientId(result.client_id);
        setActiveTab("documents");
      } catch (error) {
        console.error("Error creating client:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDocumentUploadSubmit = async () => {
    if (documents.length === 0) {
      closeDialog();
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = documents.map(async (doc) => {
        const formData = new FormData();
        formData.append("file", doc);
        return fetch(
          `https://legaldash-ai-mgj7.onrender.com/client/${clientId}/nda/upload`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
            },
            body: formData,
          },
        ).then((res) => {
          if (!res.ok) throw new Error("Failed to upload document");
        });
      });

      await Promise.all(uploadPromises);
      console.log("Documents uploaded successfully");
      closeDialog();
    } catch (error) {
      console.error("Error uploading documents:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto bg-white p-4 sm:max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Create New Client
      </h1>
      <Card className="mx-auto max-h-[90vh] w-full max-w-full overflow-auto shadow-lg sm:max-w-xl">
        <Tabs value={activeTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="name" disabled={activeTab !== "name"}>
              Client Information
            </TabsTrigger>
            <TabsTrigger value="documents" disabled={activeTab !== "documents"}>
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="name">
            <form onSubmit={handleNameSubmit}>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>
                  Enter the name and description of the new client.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="Enter client name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientDescription">Client Description</Label>
                  <Input
                    id="clientDescription"
                    placeholder="Enter client description"
                    value={clientDescription}
                    onChange={(e) => setClientDescription(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Next"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="documents">
            <CardHeader>
              <CardTitle>Upload NDAs</CardTitle>
            </CardHeader>
            <CardContent className="max-h-72 space-y-4 overflow-auto">
              <FileUploader onUpload={handleDocumentUpload} />
              <div className="space-y-2">
                <Label>Uploaded Documents</Label>
                {documents.length > 0 ? (
                  <ul className="max-h-40 space-y-2 overflow-auto">
                    {documents.map((doc, index) => (
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (!isUploading) setActiveTab("name");
                }}
                disabled={isUploading}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                type="button"
                className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
                onClick={handleDocumentUploadSubmit}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Finish"}
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
