import React from 'react';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const vietnameseStrings = {
    prefixAgo: '',
    prefixFromNow: '',
    suffixAgo: 'trước',
    suffixFromNow: 'sau',
    seconds: 'vài giây',
    minute: 'một phút',
    minutes: '%d phút',
    hour: 'một giờ',
    hours: '%d giờ',
    day: 'một ngày',
    days: '%d ngày',
    month: 'một tháng',
    months: '%d tháng',
    year: 'một năm',
    years: '%d năm',
};

const formatter = buildFormatter(vietnameseStrings);

interface TimeAgoOrFullDateProps {
    date: string | Date;
}

const TimeAgoOrFullDate: React.FC<TimeAgoOrFullDateProps> = ({ date }) => {
    const dateObject = new Date(date);

    const isOverOneDay = (new Date().getTime() - dateObject.getTime()) > 24 * 60 * 60 * 1000; // 24 giờ tính bằng milliseconds
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };
        return new Intl.DateTimeFormat('vi-VN', options).format(date);
    };
    return (
        <span>
            {isOverOneDay ? (
                <span>{formatDate(dateObject)}</span>
            ) : (
                <TimeAgo date={dateObject} formatter={formatter} />
            )}
        </span>
    );
};

export default TimeAgoOrFullDate;
