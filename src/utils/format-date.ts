import dayjs from 'dayjs';

export function formatDate(
    date?: Date,
    format: string = 'DD/MM/YYYY'
): string {
    if (!date) return '';
    return dayjs(date).format(format);
}