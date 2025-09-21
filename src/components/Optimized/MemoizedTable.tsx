import React, { memo, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow as ShadcnTableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface MemoizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
  title?: string;
  className?: string;
  getRowKey: (item: T) => string | number;
}

const LoadingSkeleton = memo(() => (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton className="h-4 w-full" />
      </div>
    ))}
  </div>
));

const MemoizedTableRow = memo(function MemoizedTableRow<T>({ 
  item, 
  columns, 
  onRowClick, 
  isSelected, 
  onToggleSelection 
}: {
  item: T;
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isSelected?: boolean;
  onToggleSelection?: (item: T) => void;
}) {
  const handleRowClick = useCallback(() => {
    onRowClick?.(item);
  }, [item, onRowClick]);

  const handleCheckboxChange = useCallback(() => {
    onToggleSelection?.(item);
  }, [item, onToggleSelection]);

  return (
    <ShadcnTableRow 
      className={`cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-muted' : ''}`}
      onClick={handleRowClick}
    >
      {onToggleSelection && (
        <TableCell className="w-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            className="rounded border-gray-300"
          />
        </TableCell>
      )}
      {columns.map((column) => (
        <TableCell 
          key={String(column.key)} 
          style={{ width: column.width }}
          className="text-sm"
        >
          {column.render 
            ? column.render(item) 
            : String((item as any)[column.key] || '')
          }
        </TableCell>
      ))}
    </ShadcnTableRow>
  );
}) as <T>(props: {
  item: T;
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isSelected?: boolean;
  onToggleSelection?: (item: T) => void;
}) => React.ReactElement;

function MemoizedTable<T>({
  data,
  columns,
  loading = false,
  onRowClick,
  selectedItems = [],
  onSelectionChange,
  title,
  className = '',
  getRowKey
}: MemoizedTableProps<T>) {
  const selectedKeys = useMemo(
    () => new Set(selectedItems.map(getRowKey)),
    [selectedItems, getRowKey]
  );

  const handleToggleSelection = useCallback((item: T) => {
    const key = getRowKey(item);
    const newSelection = selectedKeys.has(key)
      ? selectedItems.filter(selected => getRowKey(selected) !== key)
      : [...selectedItems, item];
    
    onSelectionChange?.(newSelection);
  }, [selectedItems, selectedKeys, onSelectionChange, getRowKey]);

  const tableContent = useMemo(() => {
    if (loading) {
      return <LoadingSkeleton />;
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <ShadcnTableRow>
            {onSelectionChange && <TableHead className="w-4"></TableHead>}
            {columns.map((column) => (
              <TableHead 
                key={String(column.key)}
                style={{ width: column.width }}
                className="font-semibold"
              >
                {column.header}
              </TableHead>
            ))}
          </ShadcnTableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <MemoizedTableRow
              key={getRowKey(item)}
              item={item}
              columns={columns}
              onRowClick={onRowClick}
              isSelected={selectedKeys.has(getRowKey(item))}
              onToggleSelection={onSelectionChange ? handleToggleSelection : undefined}
            />
          ))}
        </TableBody>
      </Table>
    );
  }, [data, columns, loading, onRowClick, selectedKeys, onSelectionChange, handleToggleSelection, getRowKey]);

  if (title) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {tableContent}
        </CardContent>
      </Card>
    );
  }

  return <div className={className}>{tableContent}</div>;
}

export default memo(MemoizedTable) as <T>(
  props: MemoizedTableProps<T>
) => React.ReactElement;