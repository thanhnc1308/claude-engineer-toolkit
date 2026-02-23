# Common Patterns

Frequently used patterns for forms, authentication, DataGrid, dialogs, and other common UI elements.

---

## Authentication with useAuth

### Getting Current User

```typescript
import { useAuth } from '@/hooks/useAuth';

export const MyComponent: React.FC = () => {
    const { user } = useAuth();

    // Available properties:
    // - user.id: string
    // - user.email: string
    // - user.username: string
    // - user.roles: string[]

    return (
        <div>
            <p>Logged in as: {user.email}</p>
            <p>Username: {user.username}</p>
            <p>Roles: {user.roles.join(', ')}</p>
        </div>
    );
};
```

**NEVER make direct API calls for auth** - always use `useAuth` hook.

---

## Forms with React Hook Form

### Basic Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Button } from '@mui/material';
import { useMuiSnackbar } from '@/hooks/useMuiSnackbar';

// Zod schema for validation
const formSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    age: z.number().min(18, 'Must be 18 or older'),
});

type FormData = z.infer<typeof formSchema>;

export const MyForm: React.FC = () => {
    const { showSuccess, showError } = useMuiSnackbar();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            email: '',
            age: 18,
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await api.submitForm(data);
            showSuccess('Form submitted successfully');
        } catch (error) {
            showError('Failed to submit form');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                {...register('username')}
                label='Username'
                error={!!errors.username}
                helperText={errors.username?.message}
            />

            <TextField
                {...register('email')}
                label='Email'
                error={!!errors.email}
                helperText={errors.email?.message}
                type='email'
            />

            <TextField
                {...register('age', { valueAsNumber: true })}
                label='Age'
                error={!!errors.age}
                helperText={errors.age?.message}
                type='number'
            />

            <Button type='submit' variant='contained'>
                Submit
            </Button>
        </form>
    );
};
```

---

## Dialog Component Pattern

### Standard Dialog Structure

From BEST_PRACTICES.md - All dialogs should have:

- Icon in title
- Close button (X)
- Action buttons at bottom

```typescript
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import { Close, Info } from '@mui/icons-material';

interface MyDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const MyDialog: React.FC<MyDialogProps> = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Info color='primary' />
                        Dialog Title
                    </Box>
                    <IconButton onClick={onClose} size='small'>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {/* Content here */}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} variant='contained'>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};
```

---

## DataGrid Wrapper Pattern

### Wrapper Component Contract

From BEST_PRACTICES.md - DataGrid wrappers should accept:

**Required Props:**

- `rows`: Data array
- `columns`: Column definitions
- Loading/error states

**Optional Props:**

- Toolbar components
- Custom actions
- Initial state

```typescript
import { DataGridPro } from '@mui/x-data-grid-pro';
import type { GridColDef } from '@mui/x-data-grid-pro';

interface DataGridWrapperProps {
    rows: any[];
    columns: GridColDef[];
    loading?: boolean;
    toolbar?: React.ReactNode;
    onRowClick?: (row: any) => void;
}

export const DataGridWrapper: React.FC<DataGridWrapperProps> = ({
    rows,
    columns,
    loading = false,
    toolbar,
    onRowClick,
}) => {
    return (
        <DataGridPro
            rows={rows}
            columns={columns}
            loading={loading}
            slots={{ toolbar: toolbar ? () => toolbar : undefined }}
            onRowClick={(params) => onRowClick?.(params.row)}
            // Standard configuration
            pagination
            pageSizeOptions={[25, 50, 100]}
            initialState={{
                pagination: { paginationModel: { pageSize: 25 } },
            }}
        />
    );
};
```

---

## Mutation Patterns

### Update with Cache Invalidation

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMuiSnackbar } from '@/hooks/useMuiSnackbar';

export const useUpdateEntity = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useMuiSnackbar();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateEntity(id, data),

    onSuccess: (result, variables) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: ['entity', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['entities'] });

      showSuccess('Entity updated');
    },

    onError: () => {
      showError('Failed to update entity');
    },
  });
};

// Usage
const updateEntity = useUpdateEntity();

const handleSave = () => {
  updateEntity.mutate({ id: 123, data: { name: 'New Name' } });
};
```

---

## State Management Patterns

### TanStack Query for Server State (PRIMARY)

Use TanStack Query for **all server data**:

- Fetching: useSuspenseQuery
- Mutations: useMutation
- Caching: Automatic
- Synchronization: Built-in

```typescript
// ✅ CORRECT - TanStack Query for server data
const { data: users } = useSuspenseQuery({
  queryKey: ['users'],
  queryFn: () => userApi.getUsers(),
});
```

### useState for UI State

Use `useState` for **local UI state only**:

- Form inputs (uncontrolled)
- Modal open/closed
- Selected tab
- Temporary UI flags

```typescript
// ✅ CORRECT - useState for UI state
const [modalOpen, setModalOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState(0);
```

### Context + Reducer for Complex Component State

Use `useReducer` + `createContext` when a component tree has **complex state with multiple actions**:

```typescript
import React, { createContext, useContext, useReducer, type Dispatch } from 'react';

// 1. Define state and actions with discriminated unions
interface FeatureState {
    items: Item[];
    selectedItem: Item | null;
    filter: string;
    loading: boolean;
}

type FeatureAction =
    | { type: 'SET_ITEMS'; payload: Item[] }
    | { type: 'SELECT_ITEM'; payload: Item | null }
    | { type: 'SET_FILTER'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean };

// 2. Reducer function
function featureReducer(state: FeatureState, action: FeatureAction): FeatureState {
    switch (action.type) {
        case 'SET_ITEMS':
            return { ...state, items: action.payload };
        case 'SELECT_ITEM':
            return { ...state, selectedItem: action.payload };
        case 'SET_FILTER':
            return { ...state, filter: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
}

// 3. Context
const FeatureContext = createContext<{
    state: FeatureState;
    dispatch: Dispatch<FeatureAction>;
} | undefined>(undefined);

// 4. Provider
export const FeatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(featureReducer, {
        items: [],
        selectedItem: null,
        filter: '',
        loading: false,
    });

    return (
        <FeatureContext.Provider value={{ state, dispatch }}>
            {children}
        </FeatureContext.Provider>
    );
};

// 5. Custom hook
export function useFeature() {
    const context = useContext(FeatureContext);
    if (!context) throw new Error('useFeature must be used within FeatureProvider');
    return context;
}

// Usage
const { state, dispatch } = useFeature();
dispatch({ type: 'SET_FILTER', payload: 'active' });
```

**When to use Context + Reducer:**

- Component tree with 3+ related state values
- Multiple actions that modify state
- State logic is complex enough to warrant a reducer
- Avoids prop drilling across 3+ levels

**When NOT to use (prefer simpler alternatives):**

- Simple boolean toggles → `useState`
- Server data → TanStack Query
- Global UI state → Zustand

---

### Zustand for Global Client State (Minimal)

Use Zustand only for **global client state**:

- Theme preference
- Sidebar collapsed state
- User preferences (not from server)

```typescript
import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppState = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

**Avoid prop drilling** - use context or Zustand instead.

---

## Custom Utility Hooks

### useToggle

Simple boolean toggle hook for modals, dropdowns, etc.

```typescript
import { useState, useCallback } from 'react';

export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, toggle];
}

// Usage
const [isOpen, toggleOpen] = useToggle();
// toggleOpen() flips between true/false
```

### useDebounce

Custom debounce hook (alternative to `use-debounce` library):

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebounce(searchQuery, 300);

// Use debouncedQuery in useSuspenseQuery queryKey
```

**Note:** The project uses the `use-debounce` library. Use the library version for consistency, but this pattern is useful for understanding how debouncing works or for cases where a custom implementation is preferred.

### Guidelines for Custom Hooks

- **Prefix with `use`** (required by React rules of hooks)
- **Single responsibility**: One hook does one thing
- **Return stable references**: Use `useCallback` for returned functions
- **Type the return value**: Explicit return types for clarity
- **Document usage**: JSDoc comment explaining purpose and usage

---

## Summary

**Common Patterns:**

- ✅ useAuth hook for current user (id, email, roles, username)
- ✅ React Hook Form + Zod for forms
- ✅ Dialog with icon + close button
- ✅ DataGrid wrapper contracts
- ✅ Mutations with cache invalidation
- ✅ TanStack Query for server state
- ✅ useState for UI state
- ✅ Context + Reducer for complex component state
- ✅ Zustand for global client state (minimal)

**See Also:**

- [data-fetching.md](data-fetching.md) - TanStack Query patterns
- [component-patterns.md](component-patterns.md) - Component structure
- [loading-and-error-states.md](loading-and-error-states.md) - Error handling
