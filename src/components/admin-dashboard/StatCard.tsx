'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
    title: string
    value: number | string
    icon?: React.ReactNode
    subtext?: string
    trend?: {
        value: number
        isPositive: boolean
    }
    className?: string
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

const variantClasses = {
    default: 'bg-white border-l-4 border-gray-300',
    primary: 'bg-white border-l-4 border-blue-500',
    success: 'bg-white border-l-4 border-green-500',
    warning: 'bg-white border-l-4 border-yellow-500',
    danger: 'bg-white border-l-4 border-red-500',
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    subtext,
    trend,
    className,
    variant = 'default',
}) => {
    return (
        <div className={cn(
            'p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow',
            variantClasses[variant],
            className
        )}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {subtext && (
                        <p className="text-gray-500 text-xs mt-2">{subtext}</p>
                    )}
                    {trend && (
                        <div className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            <span className={trend.isPositive ? 'mr-1' : 'mr-1'}>
                                {trend.isPositive ? '↑' : '↓'}
                            </span>
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className="ml-4 text-2xl opacity-20">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}

export default StatCard
