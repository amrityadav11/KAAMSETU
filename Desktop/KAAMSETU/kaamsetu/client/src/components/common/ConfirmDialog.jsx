import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message,
    confirmLabel = 'Delete',
    variant = 'danger',
    loading = false,
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                    <AlertTriangle size={24} className="text-red-500" />
                </div>
                {message && <p className="text-gray-600 text-sm">{message}</p>}
                <div className="flex gap-3 w-full mt-2">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant={variant} className="flex-1" onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
