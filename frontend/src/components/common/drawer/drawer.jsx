import React, { useEffect, Children } from 'react';

import './drawer.css';

export const Drawer = ({ className, isOpen, onClose, onItemSelect, children }) => {
    /* --- No changes to existing logic or event listeners --- */
    
    const handleItemSelect = (item) => {
        onItemSelect(item);
        onClose();
    }

    useEffect(() => {
        const handleKeyboardClose = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        }
        document.body.addEventListener("keydown", handleKeyboardClose);

        return () => {
            document.body.removeEventListener("keydown", handleKeyboardClose);
        }
        
        // eslint-disable-next-line
    }, [])

    return (
        <div 
            className={`${className} drawer-container ${isOpen ? 'drawer-open' : 'drawer-closed'}`} 
            onClick={onClose} 
            role="presentation">
            
            <div 
                className={`drawer-content ${isOpen ? 'drawer-visible' : 'drawer-hidden'}`} 
                role="dialog" 
                aria-modal="true" 
                aria-hidden={!isOpen}>
                
                <ul className="drawer-list">
                    {Children.map(children, (child) => 
                        <li key={Math.random()} className="drawer-list-item" onClick={() => handleItemSelect(child)}>{child}</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

// end of drawer.jsx
