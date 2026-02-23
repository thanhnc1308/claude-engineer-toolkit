# Accessibility Patterns

Accessibility (a11y) patterns for keyboard navigation, ARIA attributes, focus management, and screen reader support in React applications.

---

## Keyboard Navigation

### Custom Dropdown / Menu

```typescript
import React, { useState, useRef } from 'react';

interface DropdownProps {
    options: string[];
    onSelect: (option: string) => void;
    label: string;
}

export const AccessibleDropdown: React.FC<DropdownProps> = ({
    options,
    onSelect,
    label,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const listRef = useRef<HTMLUListElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    setActiveIndex((i) => Math.min(i + 1, options.length - 1));
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (isOpen) {
                    onSelect(options[activeIndex]);
                    setIsOpen(false);
                } else {
                    setIsOpen(true);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
            case 'Home':
                e.preventDefault();
                setActiveIndex(0);
                break;
            case 'End':
                e.preventDefault();
                setActiveIndex(options.length - 1);
                break;
        }
    };

    return (
        <div
            role='combobox'
            aria-expanded={isOpen}
            aria-haspopup='listbox'
            aria-label={label}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={() => setIsOpen(!isOpen)}
        >
            <span>{options[activeIndex] || label}</span>

            {isOpen && (
                <ul
                    ref={listRef}
                    role='listbox'
                    aria-label={label}
                >
                    {options.map((option, index) => (
                        <li
                            key={option}
                            role='option'
                            aria-selected={index === activeIndex}
                            onClick={() => {
                                onSelect(option);
                                setIsOpen(false);
                            }}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
```

**Key keyboard bindings:**

- `ArrowDown` / `ArrowUp` — Navigate options
- `Enter` / `Space` — Select current option
- `Escape` — Close dropdown
- `Home` / `End` — Jump to first/last option

---

## Focus Management

### Modal Focus Trap

When a modal opens, focus should move to the modal and be trapped inside. When it closes, focus should return to the trigger element.

```typescript
import React, { useRef, useEffect } from 'react';

interface AccessibleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Save the element that had focus before modal opened
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Move focus into the modal
            modalRef.current?.focus();
        } else {
            // Restore focus to the element that triggered the modal
            previousFocusRef.current?.focus();
        }
    }, [isOpen]);

    // Trap focus inside modal
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
            return;
        }

        if (e.key === 'Tab' && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                aria-hidden='true'
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1300,
                }}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                role='dialog'
                aria-modal='true'
                aria-label={title}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1301,
                }}
            >
                {children}
            </div>
        </>
    );
};
```

**Note:** MUI `Dialog` handles focus trapping automatically. Use this pattern for custom modal implementations.

---

## ARIA Attributes Quick Reference

### Common Roles

| Role         | Use For                                     |
| ------------ | ------------------------------------------- |
| `button`     | Interactive elements that aren't `<button>` |
| `dialog`     | Modal dialogs                               |
| `alert`      | Important messages (auto-announced)         |
| `listbox`    | Custom select/dropdown lists                |
| `option`     | Items within a listbox                      |
| `combobox`   | Input + dropdown combination                |
| `tablist`    | Tab container                               |
| `tab`        | Individual tab                              |
| `tabpanel`   | Tab content panel                           |
| `navigation` | Navigation landmarks                        |

### Common Properties

```typescript
// State
aria-expanded={isOpen}        // Dropdown/accordion open state
aria-selected={isActive}      // Selected item in list
aria-checked={isChecked}      // Checkbox/toggle state
aria-disabled={isDisabled}    // Disabled state (when not using native disabled)
aria-hidden={true}            // Hide from screen readers (decorative elements)

// Relationships
aria-labelledby='heading-id'  // Label from another element
aria-describedby='desc-id'    // Additional description
aria-controls='panel-id'      // Controls another element

// Labels
aria-label='Close dialog'     // Direct text label
aria-placeholder='Search...'  // Placeholder for screen readers
```

---

## Accessible Tab Component

```typescript
interface TabsProps {
    tabs: { id: string; label: string; content: React.ReactNode }[];
}

export const AccessibleTabs: React.FC<TabsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0]?.id);

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        let newIndex = index;

        switch (e.key) {
            case 'ArrowRight':
                newIndex = (index + 1) % tabs.length;
                break;
            case 'ArrowLeft':
                newIndex = (index - 1 + tabs.length) % tabs.length;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = tabs.length - 1;
                break;
            default:
                return;
        }

        e.preventDefault();
        setActiveTab(tabs[newIndex].id);

        // Focus the new tab button
        const tabButton = document.getElementById(`tab-${tabs[newIndex].id}`);
        tabButton?.focus();
    };

    return (
        <div>
            <div role='tablist' aria-label='Content tabs'>
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        id={`tab-${tab.id}`}
                        role='tab'
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        tabIndex={activeTab === tab.id ? 0 : -1}
                        onClick={() => setActiveTab(tab.id)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    id={`panel-${tab.id}`}
                    role='tabpanel'
                    aria-labelledby={`tab-${tab.id}`}
                    hidden={activeTab !== tab.id}
                    tabIndex={0}
                >
                    {tab.content}
                </div>
            ))}
        </div>
    );
};
```

---

## Live Regions for Dynamic Content

```typescript
// Announce changes to screen readers
<div aria-live='polite' aria-atomic='true'>
    {statusMessage}
</div>

// For urgent announcements (e.g., errors)
<div aria-live='assertive' role='alert'>
    {errorMessage}
</div>
```

**Note:** `useMuiSnackbar` uses MUI Snackbar which includes `aria-live` support by default.

---

## Accessibility Checklist

- ✅ All interactive elements are keyboard-accessible (Tab, Enter, Space, Escape)
- ✅ Focus is visible (don't remove outline without replacement)
- ✅ Modals trap focus and restore it on close
- ✅ Custom components have appropriate ARIA roles
- ✅ Images have alt text (decorative images use `alt=''`)
- ✅ Form inputs have associated labels (`<label>` or `aria-label`)
- ✅ Color is not the only way to convey information
- ✅ Sufficient color contrast (4.5:1 for text, 3:1 for large text)
- ✅ Dynamic content changes are announced via `aria-live`

---

## Summary

**Key Principles:**

1. **Keyboard First**: All functionality accessible via keyboard
2. **Focus Management**: Logical focus order, visible focus indicators, focus trapping in modals
3. **Semantic HTML**: Use native elements (`<button>`, `<input>`) when possible — they have built-in accessibility
4. **ARIA as Supplement**: ARIA fills gaps where semantic HTML is insufficient, not as a replacement
5. **Test with Screen Readers**: VoiceOver (macOS), NVDA/JAWS (Windows)

**See Also:**

- [component-patterns.md](component-patterns.md) - Component structure
- [common-patterns.md](common-patterns.md) - Dialog patterns (MUI handles a11y)
