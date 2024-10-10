"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { getClientById } from "@/lib/getClient";

interface AnalysisItem {
  type: string;
  content: string;
}

interface AnalysisData {
  [key: string]: AnalysisItem[];
}

export default function Component() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clientId, lawsuitId } = useParams() as {
    clientId: string;
    lawsuitId: string;
  };

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const clientData = await getClientById(clientId);

        if (!clientData) {
          throw new Error("Failed to fetch client data");
        }

        const firstNDA = clientData.ndas[0];
        const firstLawsuit = clientData.lawsuits[0];

        if (!firstNDA || !firstLawsuit) {
          throw new Error("No NDA or lawsuit found for the client");
        }

        const ndaSlug = firstNDA.slug;
        const lawsuitSlug = firstLawsuit.slug;

        const ndaPath = `${clientId}/nda/${ndaSlug}`;
        const lawsuitPath = `${clientId}/lawsuit/${lawsuitSlug}`;

        const response = await fetch(
          "http://localhost:8000/chat/analyze-documents-minio",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nda_path: ndaPath,
              sue_letter_path: lawsuitPath,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as any;

        // Transform the data into the expected format
        const transformedData: AnalysisData = {};

        for (const [section, items] of Object.entries(data)) {
          transformedData[section] = (items as any[]).map(
            ([type, content]: [string, string]) => ({ type, content }),
          );
        }

        const filteredData: AnalysisData = Object.fromEntries(
          Object.entries(transformedData).filter(
            ([_, items]) => !items.some((item) => item.type === "Error"),
          ),
        );

        setAnalysisData(filteredData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold">
          NDA Analysis Results
        </h1>
        <div className="grid gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold">Error</h1>
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (!analysisData || Object.keys(analysisData).length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold">
          No Data Available
        </h1>
        <p className="text-center">
          No non-error sections found in the analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="mb-6 text-center text-2xl font-bold">
        NDA Analysis Results
      </h1>
      <div className="grid gap-6">
        {Object.entries(analysisData).map(([section, items]) => (
          <Card key={section}>
            <CardHeader>
              <CardTitle>Section {section}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {items.map((item, index) => (
                  <AccordionItem key={index} value={`${section}-${index}`}>
                    <AccordionTrigger>{item.type}</AccordionTrigger>
                    <AccordionContent>
                      {item.content ? (
                        <p className="text-sm text-gray-700">{item.content}</p>
                      ) : (
                        <p className="text-sm italic text-gray-500">
                          No content available
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
