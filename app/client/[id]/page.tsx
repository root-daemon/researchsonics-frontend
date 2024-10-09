import { ClientDetails } from "@/components/client-details";

export default function ClientDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <ClientDetails id={parseInt(params.id, 10)} />;
}
