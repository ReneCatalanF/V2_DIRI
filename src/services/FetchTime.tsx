import { TimeData } from "../entites/entities";

const fetchData = async (
    timeZone: string,
    setTimeData: (data?: TimeData) => void,
    setLoading: (loading?: boolean) => void
): Promise<void> => {
    setLoading(true);
    try {
        const response =
            await fetch(`https://timeapi.io/api/time/current/zone?timeZone=${timeZone}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data: TimeData = await response.json();
        setTimeData(data);
    } catch (error) {
        console.error("Fetch error:", error);
        setTimeData(undefined);
    } finally {
        setLoading(false);
    }
};
export default fetchData;