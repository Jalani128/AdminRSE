import { cn } from "@/lib/utils";

const Table = ({ className, ...props }) => (
  <table className={cn("w-full text-sm text-left rtl:text-right", className)} {...props} />
);

const TableHeader = ({ className, ...props }) => (
  <thead className={cn("", className)} {...props} />
);

const TableBody = ({ className, ...props }) => (
  <tbody className={cn("divide-y", className)} {...props} />
);

const TableRow = ({ className, ...props }) => (
  <tr className={cn("border-b", className)} {...props} />
);

const TableHead = ({ className, ...props }) => (
  <th className={cn("px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", className)} {...props} />
);

const TableCell = ({ className, ...props }) => (
  <td className={cn("px-6 py-4 whitespace-nowrap", className)} {...props} />
);

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };