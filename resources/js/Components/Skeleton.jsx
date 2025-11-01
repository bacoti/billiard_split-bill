export function Skeleton({ className = '' }) {
    return (
        <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
    );
}

export function CardSkeleton() {
    return (
        <div className="space-y-3 p-4 border rounded-lg">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-3 w-48" />
        </div>
    );
}

export function TableSkeleton({ rows = 5 }) {
    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex gap-4 p-3 border rounded">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20 ml-auto" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 p-3 border rounded">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-16 ml-auto" />
                </div>
            ))}
        </div>
    );
}

export function FormSkeleton() {
    return (
        <div className="space-y-6">
            {/* Input 1 */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
            </div>
            {/* Input 2 */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
            </div>
            {/* Button */}
            <Skeleton className="h-10 w-full" />
        </div>
    );
}
