import useSWR from "swr";

export const fetcher = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  clearTimeout(timeoutId);
  return (
    fetch(`${url}`, { signal: controller.signal })
      // return fetch(`${url}`)
      .then((res) => {
        if (!res.ok) {
          return { success: false, message: "An error occurred while fetching the data." };
        }
        return res.json();
      })
      .catch((error) => {
        return { success: false, message: error.message };
      })
  );
};
export const useFetch = (url: string) => {
  return useSWR(url, fetcher);
};
