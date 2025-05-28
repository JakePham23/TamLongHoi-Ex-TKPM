// import { useEffect, useState, useCallback } from "react";
//
// interface DataService<T> {
//     getData: () => Promise<T[]>;
// }
//
// const useDataFetch = <T,>(service: DataService<T>) => {
//     const [data, setData] = useState<T[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<Error | null>(null);
//
//     const fetchData = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const result = await service.getData();
//             setData(result || []);
//         } catch (err) {
//             setError(err instanceof Error ? err : new Error("An unknown error occurred"));
//             console.error(`Error fetching data:`, err);
//             setData([]);
//         } finally {
//             setLoading(false);
//         }
//     }, [service]);
//
//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);
//
//     return {
//         data,
//         setData,
//         fetchData,
//         loading,
//         error,
//         reset: () => setData([]),
//     };
// };
//
// export default useDataFetch;