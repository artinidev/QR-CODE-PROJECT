import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isValid, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "react-day-picker/dist/style.css";

// Custom styles for the calendar to match the Clean SaaS aesthetic
const css = `
  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: #4f46e5; /* Indigo 600 */
    --rdp-background-color: #e0e7ff; /* Indigo 100 */
    margin: 0;
  }
  .rdp-day_selected:not([disabled]), .rdp-day_selected:focus:not([disabled]), .rdp-day_selected:active:not([disabled]), .rdp-day_selected:hover:not([disabled]) {
    background-color: var(--rdp-accent-color);
    color: white;
    font-weight: bold;
  }
  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
    background-color: #f3f4f6; /* Gray 100 */
    color: #111827;
  }
  .dark .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
    background-color: #27272a; /* Zinc 800 */
    color: white;
  }
  .rdp-caption_label {
    font-weight: 700;
    font-size: 0.9rem;
    color: inherit;
  }
  .rdp-nav_button {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }
`;

interface ModernDatePickerProps {
    label: string;
    value: string | undefined;
    onChange: (date: string) => void;
    minDate?: Date;
    placeholder?: string;
}

export function ModernDatePicker({ label, value, onChange, minDate, placeholder = "Select date" }: ModernDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            // Format to match datetime-local expected format mostly, or just ISO
            // The existing inputs expected datetime-local strings roughly (YYYY-MM-DDTHH:mm), 
            // but effectively we can store just date or format it as needed.
            // Let's assume the parent expects an ISO string or similar.
            // For datetime-local input compatibility, we'd need YYYY-MM-DDThh:mm
            // But here we are picking a date. Let's default to start of day.

            // NOTE: The previous input was datetime-local. 
            // If we want to support time, we might need a time picker too. 
            // For "Campaign Duration", usually Date is sufficient, unless specific time is critical.
            // Let's stick to Date for now as it's cleaner, or just auto-set time to 00:00 / 23:59.

            const formatted = format(date, "yyyy-MM-dd'T'00:00");
            onChange(formatted);
            setIsOpen(false);
        }
    };

    const selectedDate = value ? parseISO(value) : undefined;
    const displayDate = selectedDate && isValid(selectedDate) ? format(selectedDate, "MMM dd, yyyy") : "";

    return (
        <div className="relative space-y-2" ref={containerRef}>
            <style>{css}</style>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                {label}
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all text-left group
                    ${isOpen
                        ? 'border-indigo-600 ring-1 ring-indigo-600 bg-white dark:bg-zinc-800'
                        : 'border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800'
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    <CalendarIcon className={`w-5 h-5 ${displayDate ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${displayDate ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                        {displayDate || placeholder}
                    </span>
                </div>
                <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronLeft className="w-4 h-4 text-gray-400 -rotate-90" />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full left-0 mt-2 z-50 p-4 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10"
                    >
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleSelect}
                            fromDate={minDate}
                            showOutsideDays
                            modifiersClassNames={{
                                selected: "rdp-day_selected"
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
