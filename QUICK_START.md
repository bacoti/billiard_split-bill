# 🚀 QUICK START GUIDE - New Components

## ⚡ 5-Minute Overview

### What's New?
7 new components + utilities untuk improve UI/UX dari Billiard Split Bill app.

### Where to Use Them?
Sudah implemented di:
- ✅ `Dashboard.jsx`
- ✅ `PlayerManagement.jsx`
- ✅ `SessionHistory.jsx`
- ✅ Semua halaman lainnya

---

## 🛠️ Quick Reference

### 1. Display Statistics
```jsx
import StatCard from '@/Components/StatCard';
import { TrendingUp } from 'lucide-react';

<StatCard 
  icon={TrendingUp} 
  label="Total Sales" 
  value="$10,000" 
/>
```

### 2. Show Empty State
```jsx
import EmptyState from '@/Components/EmptyState';

<EmptyState
  title="No data yet"
  description="Create something new"
  actionLabel="Create"
  onAction={() => handleCreate()}
/>
```

### 3. Add Search
```jsx
import SearchFilter from '@/Components/SearchFilter';

<SearchFilter
  placeholder="Search..."
  onSearch={(val) => setSearch(val)}
/>
```

### 4. Form Field with Validation
```jsx
import FormField from '@/Components/FormField';

<FormField
  id="email"
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  helperText="Enter a valid email"
  required
/>
```

### 5. Dynamic Array Input
```jsx
import DynamicFormArray from '@/Components/DynamicFormArray';

<DynamicFormArray
  label="Items"
  items={items}
  onAdd={() => addItem()}
  onRemove={(i) => removeItem(i)}
  onChange={handleChange}
  fields={[
    { name: 'name', placeholder: 'Name', required: true }
  ]}
  errors={errors}
/>
```

### 6. Loading Skeleton
```jsx
import { TableSkeleton } from '@/Components/Skeleton';

{isLoading ? <TableSkeleton /> : <Table />}
```

### 7. Validation
```jsx
import { validateRequired, validateNumber } from '@/lib/formValidation';

const error = validateRequired(value, 'Email');
if (error) console.log(error);
```

---

## 📋 Common Patterns

### Pattern 1: Form with Validation
```jsx
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  
  // Validate
  const newErrors = {};
  if (!formData.name) newErrors.name = 'Name required';
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  // Submit
  submitForm(formData);
};

return (
  <form onSubmit={handleSubmit}>
    <FormField
      label="Name"
      value={formData.name}
      onChange={(e) => setFormData({...formData, name: e.target.value})}
      error={errors.name}
      required
    />
    <button type="submit">Save</button>
  </form>
);
```

### Pattern 2: List with Loading & Empty
```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchData();
}, []);

return (
  <>
    {loading ? (
      <TableSkeleton rows={3} />
    ) : data.length > 0 ? (
      <Table data={data} />
    ) : (
      <EmptyState title="No data" />
    )}
  </>
);
```

### Pattern 3: Dashboard with Stats
```jsx
return (
  <div className="space-y-6">
    {/* Stats Row */}
    <div className="grid grid-cols-3 gap-4">
      <StatCard icon={Users} label="Users" value={100} />
      <StatCard icon={Wallet} label="Revenue" value="Rp 5M" />
      <StatCard icon={TrendingUp} label="Growth" value="+50%" />
    </div>
    
    {/* Search */}
    <SearchFilter onSearch={setSearch} />
    
    {/* Content */}
    {/* Your content here */}
  </div>
);
```

---

## 🎨 Styling Tips

### Custom Styling
All components support Tailwind classes:

```jsx
// Add custom styling
<StatCard 
  className="border-2 border-blue-500 rounded-xl"
/>

<EmptyState
  className="py-20 bg-blue-50"
/>
```

### Dark Mode
All components support dark mode automatically:
```jsx
// Works in both light and dark mode
<FormField label="Name" />
```

### Responsive
All components are responsive by default:
```jsx
// Automatically responsive
<DynamicFormArray />

// Mobile: stacked
// Desktop: side-by-side
```

---

## 📱 Mobile Tips

### Touch Targets
All buttons automatically 44x44px on mobile ✓

### Input Heights
All inputs automatically 44px on mobile ✓

### Font Sizes
Automatically 16px on mobile (prevents zoom) ✓

### Spacing
Automatically adjusted for mobile ✓

---

## ✅ Troubleshooting

### Component not showing?
1. Check import path: `@/Components/ComponentName`
2. Check if component is exported
3. Check console for errors

### Form validation not working?
1. Make sure to set errors state
2. Pass error prop to FormField
3. Call validate function before submit

### Mobile looking weird?
1. Check responsive classes (sm:, md:, lg:)
2. Use mobile-first approach
3. Test in DevTools mobile mode

### Dark mode not working?
1. Check parent has dark class
2. Components inherit from parent
3. Use dark: prefix for classes

---

## 📚 Full Documentation

For detailed docs, see:
- `DEVELOPER_GUIDE.md` - Complete reference
- `UI_ENHANCEMENT_SUMMARY.md` - What's new
- `VERIFICATION_CHECKLIST.md` - Testing checklist

---

## 🆘 Need Help?

1. **Check Examples**: Look at `Dashboard.jsx` for real usage
2. **Read Docs**: `DEVELOPER_GUIDE.md` has all details
3. **Check Props**: Each component has prop documentation
4. **Test Locally**: Try in development first

---

## ✨ You're All Set!

Start using the new components today:

```bash
# Dev server running?
npm run dev

# PHP server running?
php artisan serve

# Visit: http://localhost:8000
```

Enjoy building! 🚀
