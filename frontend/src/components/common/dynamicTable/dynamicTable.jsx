import React from 'react';
import { IconButton } from '@mui/material';

import { toPascalCase } from '../../../utils/strings';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import './dynamicTable.css';

export const DynamicTable = ({ className, items, dataOptionsEnabled, onEntryOptionsClicked, columns = null }) => {
    const listItems = Boolean(items) ? items : [];
    const tableColumns = Boolean(columns) ? columns : items.length > 0 ? Object.keys(items[0]).filter(col => col !== "id") : []

    const handleEntryOptionsClicked = (event, item) => {
        if (!onEntryOptionsClicked) {
            console.warn("WARNING: No function defined for toggling data options! Please define a function!");
            return;
        } else if (typeof onEntryOptionsClicked !== "function") {
            console.warn(`WARNING: onEntryOptionsClicked is currently not a valid function! Please change it from a ${typeof onEntryOptionsClicked} to a function!`);
            return;
        }

        onEntryOptionsClicked(event, item);
    }

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
                    {listItems.map((item, index) => (
                    <tr 
                        key={Math.random()} 
                        className={`${className}-tr-${index} dynamic-table-tr-${index}`} 
                        role="row" 
                    >
                        {tableColumns.map((col, index) => <td key={Math.random()} className={`${className}-td-${item[col]} dynamic-table-td-${item[col]} dynamic-table-td`}>
                            {(index === 0 && dataOptionsEnabled ? 
                            <IconButton onClick={(event) => { handleEntryOptionsClicked(event, item); }}>
                                <MoreVertIcon fontSize="small" />
                            </IconButton> : <></>)} {item[col]}
                        </td>)}
                    </tr>
                ))}
                </tbody>
            </> : 
            <caption className="dynamic-table-no-data-message">No data currently available.</caption>
            }

        </table>
    )
}