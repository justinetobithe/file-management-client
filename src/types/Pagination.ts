export default interface Pagination {
  page: number | 1;
  pageSize: number | 10;
  search: string | '';
  sortColumn: string | '';
  sortDesc: boolean | false;
}
