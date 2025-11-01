# 📚 DEVELOPER GUIDE - New Components & Utils

## 🎨 New Components Overview

### 1. StatCard.jsx
**Location**: `resources/js/Components/StatCard.jsx`

Displays a statistic card with icon, label, value, and optional trend indicator.

```jsx
import StatCard from '@/Components/StatCard';
import { TrendingUp } from 'lucide-react';

<StatCard
    icon={TrendingUp}
    label="Total Sessions"
    value={42}
    subtext="Sessions created"
    trend="+12%"
    trendDirection="up"
/>
```

**Props**:
- `icon` (LucideIcon) - Icon component
- `label` (string) - Card label
- `value` (string | number) - Main value
- `subtext` (string, optional) - Subtitle
- `trend` (string, optional) - Trend indicator (e.g., "+12%")
- `trendDirection` (string) - "up" or "down"
- `className` (string, optional) - Additional CSS classes

---

### 2. EmptyState.jsx
**Location**: `resources/js/Components/EmptyState.jsx`

Displays an empty state with icon, title, description, and optional CTA.

```jsx
import EmptyState from '@/Components/EmptyState';
import { Inbox } from 'lucide-react';

<EmptyState
    icon={Inbox}
    title="No data available"
    description="Start by creating something new"
    actionLabel="Create New"
    onAction={() => handleCreate()}
/>
```

**Props**:
- `icon` (LucideIcon, optional) - Icon component
- `title` (string) - Empty state title
- `description` (string) - Description text
- `actionLabel` (string, optional) - CTA button label
- `onAction` (function, optional) - CTA button click handler
- `className` (string, optional) - Additional CSS classes

---

### 3. SearchFilter.jsx
**Location**: `resources/js/Components/SearchFilter.jsx`

Search bar with optional advanced filters.

```jsx
import SearchFilter from '@/Components/SearchFilter';

<SearchFilter
    placeholder="Search sessions..."
    onSearch={(value) => setSearch(value)}
    showFilters={true}
    onFilter={(filters) => handleFilter(filters)}
/>
```

**Props**:
- `placeholder` (string) - Input placeholder
- `onSearch` (function) - Search callback
- `onFilter` (function, optional) - Filter callback
- `showFilters` (boolean) - Show advanced filters

**Returned Filter Object**:
```js
{
    search: "search term",
    dateFrom: "2025-01-01",
    dateTo: "2025-12-31"
}
```

---

### 4. FormField.jsx
**Location**: `resources/js/Components/FormField.jsx`

Reusable form field with validation, error display, and helper text.

```jsx
import FormField from '@/Components/FormField';

<FormField
    id="email"
    label="Email Address"
    type="email"
    placeholder="user@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={errors.email}
    helperText="We'll never share your email"
    required
/>
```

**Props**:
- `id` (string) - Input ID
- `label` (string, optional) - Label text
- `type` (string) - Input type (default: "text")
- `placeholder` (string, optional)
- `value` (string | number) - Input value
- `onChange` (function) - Change handler
- `error` (string, optional) - Error message
- `helperText` (string, optional) - Helper text
- `required` (boolean) - Mark as required
- `disabled` (boolean) - Disable input
- `min` (number, optional) - Min value
- `max` (number, optional) - Max value
- `step` (string, optional) - Step value
- `className` (string, optional)
- `inputClassName` (string, optional)

**Features**:
- ✅ Red border on error
- ✅ Helper text below input
- ✅ Success indicator (checkmark)
- ✅ ARIA labels for accessibility

---

### 5. DynamicFormArray.jsx
**Location**: `resources/js/Components/DynamicFormArray.jsx`

Component untuk manage dynamic array inputs (e.g., tables, members).

```jsx
import DynamicFormArray from '@/Components/DynamicFormArray';

<DynamicFormArray
    label="Players"
    items={players}
    onAdd={() => setPlayers([...players, { name: '', age: '' }])}
    onRemove={(index) => setPlayers(players.filter((_, i) => i !== index))}
    onChange={(index, e) => {
        const updated = [...players];
        updated[index][e.target.name] = e.target.value;
        setPlayers(updated);
    }}
    fields={[
        { name: 'name', placeholder: 'Player Name', required: true },
        { name: 'age', placeholder: 'Age', type: 'number', required: true }
    ]}
    errors={validationErrors}
    minItems={1}
    helperText="Add players to the session"
    addButtonLabel="Add Player"
/>
```

**Props**:
- `label` (string) - Array label
- `items` (array) - Array of items
- `onAdd` (function) - Add item callback
- `onRemove` (function) - Remove item callback
- `onChange` (function) - Field change callback
- `fields` (array) - Field definitions
- `errors` (object) - Error messages keyed by index
- `minItems` (number) - Minimum items required
- `helperText` (string, optional)
- `addButtonLabel` (string) - Add button text

**Field Definition**:
```js
{
    name: 'fieldName',
    placeholder: 'Field label',
    type: 'text', // or 'number', 'email', etc.
    required: true
}
```

---

### 6. Skeleton.jsx
**Location**: `resources/js/Components/Skeleton.jsx`

Loading skeleton components for different content types.

```jsx
import { Skeleton, CardSkeleton, TableSkeleton, FormSkeleton } from '@/Components/Skeleton';

// Skeleton base (generic)
<Skeleton className="h-4 w-32" />

// Card skeleton
<CardSkeleton />

// Table skeleton with 3 rows
<TableSkeleton rows={3} />

// Form skeleton
<FormSkeleton />
```

**Available Components**:
- `Skeleton` - Generic skeleton box
- `CardSkeleton` - Card loading state
- `TableSkeleton` - Table loading state
- `FormSkeleton` - Form loading state

**Props**:
- `Skeleton` - `className` for sizing
- `TableSkeleton` - `rows` prop for number of rows
- Others - No required props

---

## 🛠️ Validation Utilities

**Location**: `resources/js/lib/formValidation.js`

### Available Functions

#### validateRequired(value, fieldName)
Validates that a field is not empty.

```js
const error = validateRequired('', 'Email');
// Returns: "Email harus diisi"
```

#### validateNumber(value, fieldName, min = 0)
Validates that value is a number >= min.

```js
const error = validateNumber('abc', 'Price', 0);
// Returns: "Price harus berupa angka"
```

#### validateEmail(email)
Validates email format.

```js
const isValid = validateEmail('user@example.com');
// Returns: true
```

#### validatePhoneNumber(phone)
Validates Indonesian phone number.

```js
const isValid = validatePhoneNumber('081234567890');
// Returns: true
```

#### validateMinLength(value, fieldName, minLength)
Validates minimum string length.

```js
const error = validateMinLength('ab', 'Password', 8);
// Returns: "Password minimal 8 karakter"
```

#### validateArrayNotEmpty(array, fieldName)
Validates array is not empty.

```js
const error = validateArrayNotEmpty([], 'Players');
// Returns: "Minimal 1 Players harus ditambahkan"
```

#### validateArrayItems(array, requiredFields, fieldName)
Validates all required fields in array items.

```js
const errors = validateArrayItems(
    [{ name: '', age: 25 }],
    ['name', 'age'],
    'Players'
);
// Returns: { '0.name': 'name harus diisi' }
```

---

## 📝 Usage Examples

### Complete Form with Validation

```jsx
import { useState } from 'react';
import FormField from '@/Components/FormField';
import DynamicFormArray from '@/Components/DynamicFormArray';
import { validateRequired, validateNumber, validateArrayItems } from '@/lib/formValidation';

export default function MyForm() {
    const [name, setName] = useState('');
    const [items, setItems] = useState([{ title: '', amount: '' }]);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!name) newErrors.name = 'Name is required';
        
        const itemErrors = validateArrayItems(items, ['title', 'amount']);
        Object.assign(newErrors, itemErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('Form valid!', { name, items });
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormField
                id="name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                required
            />

            <DynamicFormArray
                label="Items"
                items={items}
                onAdd={() => setItems([...items, { title: '', amount: '' }])}
                onRemove={(idx) => setItems(items.filter((_, i) => i !== idx))}
                onChange={(idx, e) => {
                    const updated = [...items];
                    updated[idx][e.target.name] = e.target.value;
                    setItems(updated);
                }}
                fields={[
                    { name: 'title', placeholder: 'Item Title', required: true },
                    { name: 'amount', placeholder: 'Amount', type: 'number', required: true }
                ]}
                errors={errors}
            />

            <button type="submit">Submit</button>
        </form>
    );
}
```

### Dashboard with Stats & Empty States

```jsx
import StatCard from '@/Components/StatCard';
import EmptyState from '@/Components/EmptyState';
import { TableSkeleton } from '@/Components/Skeleton';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="grid grid-cols-3 gap-6">
                <StatCard icon={Users} label="Users" value={150} />
                <StatCard icon={Wallet} label="Revenue" value="Rp 10M" />
                <StatCard icon={TrendingUp} label="Growth" value="+25%" trend="up" />
            </div>

            {loading ? (
                <TableSkeleton rows={5} />
            ) : data.length > 0 ? (
                // Your table here
            ) : (
                <EmptyState 
                    icon={Inbox}
                    title="No data"
                    description="Create your first item"
                />
            )}
        </>
    );
}
```

---

## 🚀 Best Practices

1. **Always import from components correctly**:
   ```js
   import FormField from '@/Components/FormField';
   import { TableSkeleton } from '@/Components/Skeleton';
   ```

2. **Handle errors properly**:
   ```js
   const [errors, setErrors] = useState({});
   // Validate before submit
   if (!validateForm()) return;
   ```

3. **Use loading states**:
   ```js
   {isLoading ? <TableSkeleton /> : <Table data={data} />}
   ```

4. **Provide feedback**:
   - Show loading states
   - Display error messages
   - Show success indicators

5. **Mobile-first approach**:
   - All components already responsive
   - Touch targets min 44x44px
   - Test on mobile devices

---

## 📞 Questions?

Refer to example implementations in:
- `Dashboard.jsx` - Complete form with validation
- `PlayerManagement.jsx` - Empty states and loading
- `SessionHistory.jsx` - Search and filtering
