import { Card, CardContent } from '@/Components/ui/card';

export default function StatCard({ 
    icon: Icon, 
    label, 
    value, 
    subtext, 
    trend,
    trendDirection = 'up',
    className = '' 
}) {
    return (
        <Card className={`overflow-hidden transition-all hover:shadow-lg ${className}`}>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground font-medium">{label}</p>
                        <p className="text-3xl font-bold mt-2">{value}</p>
                        {subtext && (
                            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
                        )}
                    </div>
                    {Icon && (
                        <div className="ml-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-200" />
                        </div>
                    )}
                </div>
                {trend && (
                    <div className={`text-xs font-semibold mt-3 flex items-center gap-1 ${
                        trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                        <span>{trendDirection === 'up' ? '↑' : '↓'}</span>
                        <span>{trend}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
