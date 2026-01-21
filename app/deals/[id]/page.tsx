import DealDetailClient from "./DealDetailClient";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [];
}

export default function DealDetailPage() {
  return <DealDetailClient />;
}
