// Table.js

import React from "react";
import { useTable, usePagination } from "react-table";
import {MdStarBorder} from 'react-icons/md';
import {IconContext} from 'react-icons';


export default function Table({ columns, data }) {
  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },    
    prepareRow // Prepare the row (this function needs to be called for each row before getting the row props)
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0, pageSize: 10 }
  }, usePagination);

  /* 
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
  */
  return (
      <>
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
              <th></th>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} >{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
                <td>
                    <IconContext.Provider value={{ className: "star-icon" }}>
                        <MdStarBorder/>
                    </IconContext.Provider>
                </td>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
     <div className="pagination">
        <div>
            Row per pages: 
            <select
            className="pagination-dropdown"
            value={pageSize}
            onChange={e => {
                setPageSize(Number(e.target.value))
            }}
            >
            {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                {pageSize}
                </option>
            ))}
            </select>
        </div>
        
        <span className="pagination-details">
            {(pageIndex * pageSize + 1)}-{pageSize*(pageIndex+1)} of {pageOptions.length * pageSize}
            {' '}
        </span>
        <div>
            <button className="pagination-buttons" onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
            </button>{' '}
            <button className="pagination-buttons" onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
            </button>{' '}
        </div>
      </div>
      </>
  );
}