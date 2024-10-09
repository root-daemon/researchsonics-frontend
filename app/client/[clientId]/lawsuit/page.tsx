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
  const { clientId, lawsuitId } = useParams();

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await fetch(
          "http://0.0.0.0:8000/chat/analyze-documents-minio",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sue_letter_path: `${clientId}/nda/nda-pdf`,
              nda_path: `${clientId}/lawsuit/sue-letter-s1-pdf`,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as AnalysisData;

        const filteredData: AnalysisData = Object.fromEntries(
          Object.entries(data).filter(
            ([_, items]: [string, AnalysisItem[]]) =>
              !items.some((item: AnalysisItem) => item.type === "Error"),
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
