import { getApiUrl } from "@/utils/getApiUrl";
import MapDetailPage from "../MapDetailPage";
import type { WorldMap } from "../MapLandingPage";

export default async function MapDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const res = await fetch(getApiUrl(`/maps/${id}`), {
    cache: "no-store",
  });
  if (!res.ok) {
    return <div>Map not found</div>;
  }
  const map: WorldMap = await res.json();

  return <MapDetailPage map={map} />;
}
