import { format, isSameMonth, isSameYear, parseISO } from 'date-fns';

export function getAgendaDateBounds(days) {
    const dates = (days || [])
        .map(day => day?.date)
        .filter(Boolean)
        .sort();

    if (dates.length === 0) return null;

    return {
        startDate: dates[0],
        endDate: dates[dates.length - 1],
    };
}

export function formatAgendaDateRange(days) {
    const dates = (days || [])
        .filter(day => day?.date)
        .map(day => parseISO(day.date))
        .sort((a, b) => a - b);

    if (dates.length === 0) return null;

    const start = dates[0];
    const end = dates[dates.length - 1];

    if (dates.length === 1) return format(start, 'MMMM d, yyyy');
    if (!isSameYear(start, end)) {
        return `${format(start, 'MMMM d, yyyy')}-${format(end, 'MMMM d, yyyy')}`;
    }
    if (!isSameMonth(start, end)) {
        return `${format(start, 'MMMM d')}-${format(end, 'MMMM d, yyyy')}`;
    }

    return `${format(start, 'MMMM d')}-${format(end, 'd, yyyy')}`;
}
