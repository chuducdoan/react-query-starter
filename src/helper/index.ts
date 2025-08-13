export const calculatePagesCount = (pageSize: number, totalCount: number) => {
  return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
};
