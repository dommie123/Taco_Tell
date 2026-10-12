import React, { Children, useState, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setCMOpen } from '../../../slices/globalSlice';
import { InvalidAnchorPositionError } from '../../../errors';

import './contextMenu.css';

export const ContextMenu = ({ isOpen = false, anchorPosition, onMenuItemClick, children }) => {
    const anchorCoords = useSelector(state => state.global.cmCoords);
    const open = useSelector(state => state.global.cmOpen);
    const [moddedAnchorCoords, setModdedAnchorCoords] = useState(anchorCoords);
    const dispatch = useDispatch();

    const listRef = useRef();

    const validateAndUpdateAnchorPosition = () => {
        if (!listRef.current) {
            console.warn("WARNING: The list ref is not defined! This may break some features!");
            return true;
        }

        switch(anchorPosition) {
            case "top-left": 
                setModdedAnchorCoords(anchorCoords);
                return true;
            case "top-right": 
                setModdedAnchorCoords({...anchorCoords, x: anchorCoords.x - listRef.current.width});
                return true;
            case "bottom-right": 
                setModdedAnchorCoords({
                    x: anchorCoords.x - listRef.current.width, 
                    y: anchorCoords.y - listRef.current.height
                })
                return true;
            case "bottom-left": 
                setModdedAnchorCoords({...anchorCoords, y: anchorCoords.y - listRef.current.height});
                return true;
            default: 
                throw new InvalidAnchorPositionError();
        }
    }

    const handleMenuItemClick = (itemIndex) => {
        onMenuItemClick(itemIndex);
        dispatch(setCMOpen(false));
    }

    const handleCloseMenu = (event) => {
        event.stopPropagation();
        dispatch(setCMOpen(false));
    }

    useLayoutEffect(() => {
        if (isOpen) {
            dispatch(setCMOpen(isOpen));
        }

        try {
            validateAndUpdateAnchorPosition();
        } catch (err) {
            console.error(`ERROR: ${err.message}`);
            return;
        }

        document.body.addEventListener("click", handleCloseMenu);

        return () => {
            document.body.removeEventListener("click", handleCloseMenu);
        }

        // eslint-disable-next-line
    }, [open, anchorPosition, anchorCoords]);

    return (
        <>
            { open ? <ul 
                className="context-menu" 
                role="menu" 
                aria-hidden={!open}
                ref={listRef}
                style={{
                    zIndex: 1000,
                    position: "absolute",
                    top: moddedAnchorCoords.y,
                    left: moddedAnchorCoords.x,
                    width: "fit-content",
                    height: "fit-content", 
                    minWidth: "25px",
                    minHeight: "5px"
                }}
            >
                { Children.map(children, (child, index) => 
                    <li 
                        className={`conext-menu-item-${index} context-menu-item`} 
                        onClick={() => { handleMenuItemClick(child.props.children) }}
                        role="menuitem"
                    >
                        {child}
                    </li>) 
                }
            </ul> : <></>}
        </>
    )
}