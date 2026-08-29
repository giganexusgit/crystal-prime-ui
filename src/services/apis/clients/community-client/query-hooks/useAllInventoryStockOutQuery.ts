import { useQuery } from "@/services";

import { COMMUNITY_CLIENT } from "../communityClient";

/**
 * This is to track the list of materials from the backend.
 */
const ALL_INVENTORY_QUERY_KEY = "inventory-history";

/**
 * Interface for material filters
 */

/**
 * This hook fetches a list of all materials from the backend.
 */
export const useAllInventoryStockOutQuery = () => {
  const { data, isError, error, isLoading, isPending, refetch } = useQuery({
    queryKey: [ALL_INVENTORY_QUERY_KEY],
    queryFn: () => COMMUNITY_CLIENT.getInventoryHistory(),
    networkMode: "always",
  });

  return {
    error,
    isError,
    allStockOutData: data,
    isLoading,
    isPending,
    fetchAllStockOut: refetch,
  };
};
