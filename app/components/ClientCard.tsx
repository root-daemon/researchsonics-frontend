import React from "react";
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
import { FileText, AlertTriangle, Trash2 } from "lucide-react";
import { Client, Document } from "@/types/Client";

interface ClientCardProps {
  client: Client;
  onDelete: (clientId: string) => void;
  onManage: () => void;
}

export default function ClientCard({
  client,
  onDelete,
  onManage,
}: ClientCardProps) {
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

  const renderDocuments = (documents: Document[], docType: string) => (
    <ScrollArea className="h-[100px] w-full rounded-md border p-4">
      {documents.length > 0 ? (
        documents.map((doc) => (
          <div
            key={doc.name}
            className="mb-2 flex items-center justify-between"
          >
            <div className="flex items-center">
              {docType === "nda" ? (
                <FileText className="mr-2 h-4 w-4 text-[#f6c90e]" />
              ) : (
                <AlertTriangle className="mr-2 h-4 w-4 text-[#f6c90e]" />
              )}
              <span className="text-gray-700">{doc.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[#f6c90e] bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
              onClick={() => downloadDocument(client._id, docType, doc.slug)}
            >
              View
            </Button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">
          No {docType === "nda" ? "NDAs" : "lawsuits"} available.
        </p>
      )}
    </ScrollArea>
  );

  return (
    <Card className="w-full border-2 border-[#f6c90e] shadow-lg">
      <CardHeader className="rounded-t-lg bg-white">
        <div className="flex items-center space-x-4">
          <Avatar className="border-2 border-[#f6c90e]">
            <AvatarImage src={client.avatar} alt={client.name} />
            <AvatarFallback className="bg-[#f6c90e] text-gray-800">
              {client.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-gray-800">{client.name}</CardTitle>
            <CardDescription className="text-gray-600">
              {client.ndas.length} NDAs, {client.lawsuits.length} Lawsuits
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="rounded-b-lg bg-white">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ndas">
            <AccordionTrigger className="text-gray-700">NDAs</AccordionTrigger>
            <AccordionContent>
              {renderDocuments(client.ndas, "nda")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="lawsuits">
            <AccordionTrigger className="text-gray-700">
              Lawsuits
            </AccordionTrigger>
            <AccordionContent>
              {renderDocuments(client.lawsuits, "lawsuit")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => onDelete(client._id)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button
            size="sm"
            className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]"
            onClick={onManage}
          >
            Manage Client
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
