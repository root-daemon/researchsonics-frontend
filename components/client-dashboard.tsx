'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { FileText, AlertTriangle } from 'lucide-react'

// Mock data
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
      { id: 1, name: "Patent Infringement Case", date: "2023-05-10", status: "Active" },
    ],
  },
  {
    id: 2,
    name: "TechStart Inc",
    avatar: "/placeholder.svg?height=40&width=40",
    ndas: [
      { id: 3, name: "Confidentiality Agreement", date: "2023-02-01" },
    ],
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
      { id: 2, name: "Contract Dispute", date: "2023-06-15", status: "Pending" },
      { id: 3, name: "Employee Lawsuit", date: "2023-07-01", status: "Settled" },
    ],
  },
]

export function ClientDashboardComponent() {
  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Client Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id} className="w-full border-t-4 border-[#f6c90e] shadow-lg">
            <CardHeader className="bg-white rounded-t-lg">
              <div className="flex items-center space-x-4">
                <Avatar className="border-2 border-[#f6c90e]">
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback className="bg-[#f6c90e] text-gray-800">{client.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-gray-800">{client.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {client.ndas.length} NDAs, {client.lawsuits.length} Lawsuits
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="bg-white rounded-b-lg">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="ndas">
                  <AccordionTrigger className="text-gray-700 hover:text-[#f6c90e]">NDAs</AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                      {client.ndas.map((nda) => (
                        <div key={nda.id} className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-[#f6c90e]" />
                            <span className="text-gray-700">{nda.name}</span>
                          </div>
                          <Badge variant="outline" className="bg-[#f6c90e] text-gray-800 border-[#f6c90e]">{nda.date}</Badge>
                        </div>
                      ))}
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="lawsuits">
                  <AccordionTrigger className="text-gray-700 hover:text-[#f6c90e]">Lawsuits</AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                      {client.lawsuits.length > 0 ? (
                        client.lawsuits.map((lawsuit) => (
                          <div key={lawsuit.id} className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <AlertTriangle className="mr-2 h-4 w-4 text-[#f6c90e]" />
                              <span className="text-gray-700">{lawsuit.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={lawsuit.status === 'Active' ? 'destructive' : 
                                        lawsuit.status === 'Pending' ? 'default' : 'secondary'}
                                className={lawsuit.status === 'Active' ? 'bg-red-500' : 
                                          lawsuit.status === 'Pending' ? 'bg-[#f6c90e] text-gray-800' : 'bg-green-500'}
                              >
                                {lawsuit.status}
                              </Badge>
                              <Badge variant="outline" className="text-gray-600">{lawsuit.date}</Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No lawsuits filed.</p>
                      )}
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-100">View Details</Button>
                <Button size="sm" className="bg-[#f6c90e] text-gray-800 hover:bg-[#e0b60d]">Manage Client</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}