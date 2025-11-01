import { Button } from '@/Components/ui/button';

export default function EmptyState({ 
    icon: Icon,
    title, 
    description, 
    actionLabel,
    onAction,
    className = ''
}) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
            {Icon && (
                <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Icon className="h-12 w-12 text-gray-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mt-2 max-w-sm">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button 
                    onClick={onAction}
                    className="mt-6"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
