import { ClientDetails } from "@/components/client-details";

export default function ClientDetailsPage({
  params,
}: {
  params: { clientId: string };
}) {
  return <ClientDetails id={params.clientId} />;
}
