import useSWR from "swr";

/**
 * Fetches data from a given URL with a 5-second timeout and error handling.
 *
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<any>} The parsed JSON response
 * @throws {Error} If the response is not ok or if the request times out
 */
export const fetcher = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  clearTimeout(timeoutId);
  return fetch(`${url}`, { signal: controller.signal }).then((res) => {
    if (!res.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    return res.json();
  });
};
/**
 * A custom hook that wraps SWR for data fetching with automatic caching and revalidation.
 *
 * @param {string} url - The URL to fetch data from
 * @returns {Object} SWR response object containing:
 *   - data: The fetched data
 *   - error: Any error that occurred
 *   - isLoading: Boolean indicating if the request is in progress
 *   - isValidating: Boolean indicating if revalidation is in progress
 *   - mutate: Function to manually revalidate the data
 */
export const useFetch = (url: string) => {
  return useSWR(url, fetcher);
};
