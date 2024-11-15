import useSWR from "swr";

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
export const useFetch = (url: string) => {
  return useSWR(url, fetcher);
};
