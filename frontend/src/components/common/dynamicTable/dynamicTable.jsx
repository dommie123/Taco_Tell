import React from 'react';

import { toPascalCase } from '../../../utils/strings';

import './dynamicTable.css';
import { AtmSharp } from '@mui/icons-material';

export const DynamicTable = ({ className, items, columns = null }) => {
    const listItems = Boolean(items) ? items : [];
    const tableColumns = Boolean(columns) ? columns : items.length > 0 ? Object.keys(items[0]) : []

    return (
        <table className={`${className} dynamic-table`} role="table">
            {listItems.length > 0 ? 
            <>
                <thead className={`${className}-head dynamic-table-head`} role="rowheader">
                    <tr className={`${className}-tr dynamic-table-th`} role="row">
                        {tableColumns.map(key => 
                            <th key={key} className={`${className}-th dynamic-table-th`}>{toPascalCase(key, "_")}</th>
                        )}
                    </tr>
                </thead>
                <tbody className={`${className}-body dynamic-table-body`}>
                    {listItems.map((item, index) => <tr key={Math.random()} className={`${className}-tr-${index} dynamic-table-tr-${index}`} role="row">
                        {tableColumns.map(col => <td key={Math.random()} className={`${className}-td-${item[col]} dynamic-table-td-${item[col]} dynamic-table-td`}>
                            {item[col]}
                        </td>)}
                    </tr>)}
                </tbody>
            </> : 
            <caption className="dynamic-table-no-data-message">No data currently available.</caption>
            }

        </table>
    )
}