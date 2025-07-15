import { getApiUrl } from "@/utils/getApiUrl";
import MapDetailPage from "../MapDetailPage";
import type { WorldMap } from "../MapLandingPage";

const API_URL = getApiUrl();

export default async function MapDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const res = await fetch(`${API_URL}/maps/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return <div>Map not found</div>;
  }
  const map: WorldMap = await res.json();

  return <MapDetailPage map={map} />;
}
