import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FormField({ 
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    helperText,
    required = false,
    disabled = false,
    min,
    max,
    step,
    className = '',
    inputClassName = ''
}) {
    const hasError = !!error;

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <div className="flex items-center justify-between">
                    <Label htmlFor={id} className="flex items-center gap-1 text-sm font-medium">
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </Label>
                    {!hasError && value && type !== 'number' && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                        </div>
                    )}
                </div>
            )}
            
            <div className="relative">
                <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    min={min}
                    max={max}
                    step={step}
                    required={required}
                    className={`h-10 sm:h-11 text-base sm:text-sm ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''} ${inputClassName}`}
                    aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                />
            </div>

            {hasError && (
                <div id={`${id}-error`} className="flex items-center gap-2 text-xs sm:text-sm text-red-600">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {helperText && !hasError && (
                <p id={`${id}-helper`} className="text-xs text-muted-foreground">
                    {helperText}
                </p>
            )}
        </div>
    );
}
