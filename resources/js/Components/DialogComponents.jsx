import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, InfoIcon, AlertTriangle } from 'lucide-react';

/**
 * Modal Dialog - Digunakan untuk form, input data, atau informasi penting
 */
export const ModalDialog = ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                role="presentation"
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-full ${sizeClasses[size]} w-full transform transition-all`}
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {title}
                        </h2>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                aria-label="Close dialog"
                            >
                                <X className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Alert Dialog - Untuk konfirmasi aksi berbahaya atau penting
 */
export const AlertDialog = ({
    isOpen,
    onClose,
    title,
    description,
    actionLabel = 'Hapus',
    onAction,
    isLoading = false,
    variant = 'warning' // warning, danger, info
}) => {
    if (!isOpen) return null;

    const variantConfig = {
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            borderColor: 'border-yellow-200 dark:border-yellow-800',
            iconColor: 'text-yellow-600 dark:text-yellow-400'
        },
        danger: {
            icon: AlertCircle,
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800',
            iconColor: 'text-red-600 dark:text-red-400'
        },
        info: {
            icon: InfoIcon,
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            iconColor: 'text-blue-600 dark:text-blue-400'
        }
    };

    const config = variantConfig[variant];
    const IconComponent = config.icon;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Dialog */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                    {/* Alert Box */}
                    <div className={`p-6 border-b ${config.bgColor} ${config.borderColor}`}>
                        <div className="flex gap-4">
                            <IconComponent className={`h-8 w-8 flex-shrink-0 ${config.iconColor}`} />
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                    {title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 p-6 justify-end">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onAction}
                            disabled={isLoading}
                            className={`px-4 py-2 text-white rounded-lg font-medium transition-all disabled:opacity-50 ${
                                variant === 'danger'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : variant === 'warning'
                                    ? 'bg-yellow-600 hover:bg-yellow-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isLoading ? 'Memproses...' : actionLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Success Dialog - Untuk notifikasi keberhasilan aksi
 */
export const SuccessDialog = ({ isOpen, onClose, title, message, autoCloseTime = 3000 }) => {
    React.useEffect(() => {
        if (isOpen && autoCloseTime) {
            const timer = setTimeout(onClose, autoCloseTime);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoCloseTime, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>

            {/* Dialog */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="p-6 text-center">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            {title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {message}
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Tutup
                        </button>
                    </div>

                    {/* Progress bar */}
                    {autoCloseTime && (
                        <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 animate-pulse"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Confirmation Dialog - Untuk konfirmasi aksi umum
 */
export const ConfirmationDialog = ({
    isOpen,
    onClose,
    title,
    message,
    confirmLabel = 'Ya, Lanjutkan',
    cancelLabel = 'Batal',
    onConfirm,
    isLoading = false,
    isDangerous = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Dialog */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                    {/* Content */}
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            {title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 p-6 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 font-medium"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-all disabled:opacity-50 ${
                                isDangerous
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isLoading ? 'Memproses...' : confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Sheet Dialog - Dialog yang muncul dari samping (untuk mobile-friendly)
 */
export const SheetDialog = ({ isOpen, onClose, title, children, side = 'right' }) => {
    if (!isOpen) return null;

    const sideClasses = {
        left: 'left-0',
        right: 'right-0'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Sheet */}
            <div className={`fixed top-0 bottom-0 w-full sm:w-96 ${sideClasses[side]} bg-white dark:bg-slate-800 shadow-xl transition-transform duration-300`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Close sheet"
                    >
                        <X className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto h-full pb-20">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default {
    ModalDialog,
    AlertDialog,
    SuccessDialog,
    ConfirmationDialog,
    SheetDialog
};
