import { Client, Document } from "@/types/Client";

const API_URL = "https://legaldash-ai-mgj7.onrender.com";

export const fetchClients = async (): Promise<Client[]> => {
  try {
    const response = await fetch(`${API_URL}/client/`, {
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.json();

    return data.map((client: any) => ({
      ...client,
      ndas:
        client.documents?.filter((doc: Document) =>
          doc.path.includes("/nda"),
        ) || [],
      lawsuits:
        client.documents?.filter((doc: Document) =>
          doc.path.includes("/lawsuit"),
        ) || [],
    }));
  } catch (error) {
    console.error("Error fetching client data:", error);
    throw error;
  }
};

export const deleteClient = async (clientId: string): Promise<void> => {
  try {
    await fetch(`${API_URL}/client/${clientId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};
