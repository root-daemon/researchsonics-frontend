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

export default function CreateClient() {
  const [clientName, setClientName] = useState("");
  const [clientDescription, setClientDescription] = useState("");
  const [activeTab, setActiveTab] = useState("name");
  const [documents, setDocuments] = useState<File[]>([]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientName.trim() && clientDescription.trim()) {
      setActiveTab("documents");
    }
  };

  const handleDocumentUpload = (files: File[]) => {
    setDocuments((prevDocuments) => [...prevDocuments, ...files]);
  };

  const handleCreateClient = () => {
    console.log("Creating client:", {
      name: clientName,
      description: clientDescription,
      documents,
    });
    setClientName("");
    setClientDescription("");
    setDocuments([]);
    setActiveTab("name");
  };

  return (
    <div className="container mx-auto bg-white p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Create New Client
      </h1>
      <Card className="mx-auto w-full max-w-2xl shadow-lg">
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
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="documents">
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Upload any relevant documents for the client.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploader onUpload={handleDocumentUpload} />
              <div className="space-y-2">
                <Label>Uploaded Documents</Label>
                {documents.length > 0 ? (
                  <ul className="space-y-2">
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
                onClick={() => setActiveTab("name")}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                type="button"
                className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
                onClick={handleCreateClient}
              >
                Create Client
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
