import { Client } from "@/types/Client";

export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    const response = await fetch(
      `https://legaldash-ai-mgj7.onrender.com/client/${id}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch client");
    }

    const data = await response.json();

    const ndas =
      data.documents?.filter((doc: { path: string }) =>
        doc.path.includes("/nda/"),
      ) || [];

    const lawsuits =
      data.documents?.filter((doc: { path: string }) =>
        doc.path.includes("/lawsuit/"),
      ) || [];

    return {
      ...data,
      ndas,
      lawsuits,
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    return null;
  }
};
