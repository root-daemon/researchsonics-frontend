import { ClientDetailsComponent } from "@/components/client-details";

export default function ClientDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <ClientDetailsComponent id={parseInt(params.id, 10)} />;
}
