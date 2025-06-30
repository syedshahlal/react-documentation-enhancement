import { useEffect, useState } from "react";

export type VersionWithStatus = {
  version: string;
  releaseDate: string;
  status: "current" | "development" | "future" | "previous";
};

export type VersionGroups = {
  current: VersionWithStatus[];
  development: VersionWithStatus[];
  future: VersionWithStatus[];
  previous: VersionWithStatus[];
};

export function useGroupedVersions() {
  const [data, setData] = useState<VersionGroups | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/grouped-versions")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
