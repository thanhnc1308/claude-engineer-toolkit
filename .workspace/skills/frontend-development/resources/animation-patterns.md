# Animation Patterns

Modern animation patterns using Framer Motion for React components.

---

## Framer Motion Basics

### Installation

```bash
npm install framer-motion
```

### Import

```typescript
import { motion, AnimatePresence } from 'framer-motion';
```

---

## List Animations

### Animated List Items

```typescript
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedListProps {
    items: Item[];
    renderItem: (item: Item) => React.ReactNode;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({ items, renderItem }) => {
    return (
        <AnimatePresence>
            {items.map((item) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderItem(item)}
                </motion.div>
            ))}
        </AnimatePresence>
    );
};
```

**Key Points:**

- `AnimatePresence` enables exit animations when items are removed
- Each item needs a unique `key` for proper animation tracking
- `initial` → state when item enters
- `animate` → target state
- `exit` → state when item leaves

---

## Modal / Dialog Animations

### Animated Modal with Overlay

```typescript
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
    isOpen,
    onClose,
    children,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 1300,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Content */}
                    <motion.div
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1301,
                        }}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
```

**Note:** For MUI Dialogs, MUI handles transitions internally. Use Framer Motion for custom modal implementations.

---

## Page / Route Transitions

### Fade Transition Wrapper

```typescript
import { motion } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
};

// Usage in route
function MyPage() {
    return (
        <PageTransition>
            <PageContent />
        </PageTransition>
    );
}
```

---

## Stagger Children Animation

### Sequential Item Appearance

```typescript
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Delay between each child
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

interface StaggeredListProps {
    items: Item[];
}

export const StaggeredList: React.FC<StaggeredListProps> = ({ items }) => {
    return (
        <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
        >
            {items.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                    <ItemCard item={item} />
                </motion.div>
            ))}
        </motion.div>
    );
};
```

---

## Hover & Tap Interactions

```typescript
<motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
    <Paper sx={{ p: 2, cursor: 'pointer' }}>
        Interactive Card
    </Paper>
</motion.div>
```

---

## When to Use Animations

**Use animations for:**

- List item enter/exit (add/remove items)
- Modal/dialog open/close
- Page transitions
- Micro-interactions (hover, tap feedback)
- Staggered content loading

**Avoid animations for:**

- Critical content that needs to be immediately visible
- Excessively long durations (keep under 500ms for UI)
- Animations that block user interaction
- Performance-sensitive areas with many simultaneous animations

---

## Summary

**Animation Checklist:**

- ✅ Use `AnimatePresence` for enter/exit animations
- ✅ Keep transitions short (200-400ms for UI elements)
- ✅ Use `spring` transitions for natural feel
- ✅ Stagger children for sequential appearance
- ✅ `whileHover`/`whileTap` for micro-interactions
- ❌ Don't animate everything — be purposeful
- ❌ Don't block user interaction with long animations

**See Also:**

- [component-patterns.md](component-patterns.md) - Component structure
- [performance.md](performance.md) - Performance considerations
