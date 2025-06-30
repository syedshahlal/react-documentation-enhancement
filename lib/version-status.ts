import { useEffect, useState } from "react";

export type VersionInfo = {
  version: string;
  releaseDate: string; // ISO string
};

export type VersionWithStatus = VersionInfo & {
  status: "current" | "previous" | "future" | "development";
};

export async function fetchVersionsWithStatus(): Promise<VersionWithStatus[]> {
  const res = await fetch("/api/versions/versions.json");
  const data: VersionInfo[] = await res.json();
  const today = new Date();

  // Sort by ascending release date (oldest to newest)
  const sorted = [...data].sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

  // Find index of current stable version (latest past version)
  let currentIdx = -1;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (new Date(sorted[i].releaseDate) <= today) {
      currentIdx = i;
      break;
    }
  }

  const developmentIdx = currentIdx + 1;

  return sorted.map((v, idx) => {
    let status: VersionWithStatus["status"];

    if (idx === currentIdx) {
      status = "current"; // Latest stable
    } else if (idx === developmentIdx) {
      status = "development"; // Upcoming (next)
    } else if (idx < currentIdx) {
      status = "previous"; // Legacy
    } else {
      status = "future"; // Not Yet Started
    }

    return { ...v, status };
  });
}

// React hook for convenience
export function useVersionsWithStatus() {
  const [versions, setVersions] = useState<VersionWithStatus[]>([]);
  useEffect(() => {
    fetchVersionsWithStatus().then(setVersions);
  }, []);
  return versions;
}
