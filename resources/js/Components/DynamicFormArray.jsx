import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

export default function DynamicFormArray({
    label,
    items,
    onAdd,
    onRemove,
    onChange,
    fields, // Array of { name, placeholder, type, required }
    minItems = 1,
    errors = {},
    helperText,
    addButtonLabel = 'Tambah Item'
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">{label}</Label>
                {helperText && (
                    <span className="text-xs text-muted-foreground">{helperText}</span>
                )}
            </div>

            <div className="space-y-3 p-3 sm:p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-900/50">
                {items.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">Belum ada item</p>
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div key={index} className="space-y-2 sm:space-y-3">
                            <div className="flex gap-2 items-end flex-col sm:flex-row">
                                <div className="flex-1 w-full space-y-2 order-2 sm:order-1">
                                    {fields.map((field) => (
                                        <div key={field.name} className="space-y-1">
                                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                                {field.placeholder}
                                                {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            <Input
                                                name={field.name}
                                                type={field.type || 'text'}
                                                placeholder={field.placeholder}
                                                value={item[field.name] || ''}
                                                onChange={(e) => onChange(index, e)}
                                                className={`text-base sm:text-sm h-10 sm:h-9 ${
                                                    errors[`${index}.${field.name}`]
                                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                                        : ''
                                                }`}
                                                required={field.required}
                                            />
                                            {errors[`${index}.${field.name}`] && (
                                                <div className="flex items-center gap-1 text-xs text-red-600">
                                                    <AlertCircle className="h-3 w-3" />
                                                    <span>{errors[`${index}.${field.name}`]}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => onRemove(index)}
                                    disabled={items.length <= minItems}
                                    title={items.length <= minItems ? `Minimal ${minItems} item` : 'Hapus item'}
                                    className="shrink-0 h-10 w-10 order-1 sm:order-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            {index < items.length - 1 && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3" />
                            )}
                        </div>
                    ))
                )}
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAdd}
                className="w-full h-10 text-base sm:text-sm"
            >
                <Plus className="h-4 w-4 mr-2" /> {addButtonLabel}
            </Button>
        </div>
    );
}
