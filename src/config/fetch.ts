import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { calculatePagesCount } from "../helper";

const PAGE_SIZE = 3;

export const useFetchUser = (currentPage: number) => {
  const queryInfo = useQuery({
    queryKey: ["fetchUser", currentPage], // dinh danh de tai su dung
    queryFn: async (): Promise<any> =>
      fetch(
        `http://localhost:8000/users?_page=${currentPage}&_limit=${PAGE_SIZE}`
      ).then(async (res) => {
        const totalItem = +(res.headers.get("X-Total-Count") ?? 0);
        const total_pages = calculatePagesCount(PAGE_SIZE, totalItem);
        const d = await res.json();
        return {
          totalItem,
          total_pages,
          users: d,
        };
      }),
    placeholderData: keepPreviousData,
  });

  return {
    ...queryInfo,
    count: queryInfo.data?.totalItem ?? 0,
    totalPage: queryInfo.data?.total_pages ?? 0,
    data: queryInfo.data?.users ?? [],
  };
};
