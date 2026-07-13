import { redirect } from "next/navigation";

export default async function StableProductRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/produkt/${encodeURIComponent(id)}`);
}
