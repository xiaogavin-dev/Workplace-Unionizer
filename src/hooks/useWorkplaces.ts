import { useEffect, useState } from "react";

const useWorkplaces = (unionId: string) => {
  const [workplaces, setWorkplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!unionId) {
      setError("Union ID is required to fetch workplaces.");
      setLoading(false);
      return;
    }

    const fetchWorkplaces = async () => {
      try {
        const response = await fetch(`http://localhost:5000/workplace/getWorkplaces?unionId=${unionId}`);
        const data = await response.json();

        if (response.ok) {
          console.log(data.workplaces)
          setWorkplaces(data.workplaces || []);
        } else {
          setError(data.message || "Failed to fetch workplaces.");
        }
      } catch (err) {
        setError("An error occurred while fetching workplaces.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkplaces();
  }, [unionId]);

  return { workplaces, loading, error };
};

export default useWorkplaces;
