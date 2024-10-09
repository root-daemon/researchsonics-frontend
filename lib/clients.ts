const clientsData = [
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
export default clientsData;
