import React, { useState, useLayoutEffect } from 'react';

import { IconButton } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import './modal.css';

export const Modal = ({ title, isOpen, onClose, children }) => {
    const [open, setOpen] = useState(isOpen);

    const handleClose = (event) => {
        event.stopPropagation();
        onClose();

        setOpen(!open);
    }

    useLayoutEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyboardClose = (event) => {
            if (event.key === 'Escape') {
                handleClose(event);
            }
        }

        document.addEventListener('keydown', handleKeyboardClose, false);

        return () => {
            document.removeEventListener('keydown', handleKeyboardClose, false);
        }
        
    
        // eslint-disable-next-line
    }, [open])

    return open ? (
        <div className="modal-backdrop" role="presentation" onClick={handleClose}>
            <div className="modal-container" role="dialog">
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <IconButton className="modal-close" onClick={handleClose} role="button">
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    ) : <></>;
}