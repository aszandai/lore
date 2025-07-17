import { getApiUrl } from "@/utils/getApiUrl";
import MapDetailPage from "../MapDetailPage";
import type { WorldMap } from "../MapLandingPage";

export default async function MapDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  try {
    const res = await fetch(getApiUrl(`/maps/${id}`), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch map: ${res.status}`);
    }

    const map: WorldMap = await res.json();

    return <MapDetailPage map={map} />;
  } catch (error) {
    console.error("Error fetching map:", error);
    return <div>Map not found</div>;
  }
}
