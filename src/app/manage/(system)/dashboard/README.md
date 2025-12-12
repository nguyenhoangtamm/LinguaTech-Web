# Admin Dashboard

## Overview

The Admin Dashboard is a comprehensive system analytics and administration interface for LinguaTech. It provides real-time insights into system statistics, course analytics, user growth trends, and more.

## Features

### 1. Dashboard Statistics

-   **Total Users**: Count of all registered users with active user breakdown
-   **Total Courses**: All courses in the system with published count
-   **Enrollments**: Total enrollments with average per course
-   **Lessons & Materials**: Total count and storage information
-   **Assignments**: Total assignments in the system
-   **Course Completion Rate**: System-wide completion percentage
-   **Average Course Rating**: Overall course quality metric

### 2. System Overview

Real-time system metrics including:

-   User breakdown by role
-   Course status distribution (Active, Draft, Archived)
-   Storage usage information
-   Performance metrics and averages

### 3. User Growth Statistics

Visual chart showing daily user growth over a customizable period:

-   Daily new user registrations
-   Cumulative total users
-   Daily active users
-   Time-range filtering (7, 30, 90, 180, 365 days)

### 4. Course Analytics

Detailed course information with:

-   Top courses by enrollment count
-   Top courses by rating
-   Course creation date
-   Publication status
-   Star ratings visualization

## File Structure

```
src/
├── apiRequests/
│   └── adminDashboard.ts          # API client for dashboard endpoints
├── schemaValidations/
│   └── adminDashboard.schema.ts   # Type definitions and validation schemas
├── components/
│   └── admin-dashboard/
│       ├── StatCard.tsx            # Reusable stat card component
│       ├── DashboardStats.tsx       # Main stats grid component
│       ├── CourseAnalyticsTable.tsx # Course analytics table component
│       ├── UserGrowthChart.tsx      # User growth visualization
│       └── DashboardOverview.tsx    # System overview section
├── queries/
│   └── useAdminDashboard.tsx       # React Query hooks for data fetching
└── app/manage/(system)/
    └── dashboard/
        ├── page.tsx                 # Main dashboard page (with manual state)
        └── page-v2.tsx              # Alternative dashboard page (with React Query)
```

## Component Usage

### DashboardStats

Displays the main statistics grid with 8 key metrics.

```tsx
<DashboardStats stats={statsData} isLoading={false} />
```

### StatCard

Individual metric card with optional trend indicator.

```tsx
<StatCard
    title="Total Users"
    value={150}
    subtext="120 active"
    variant="primary"
    trend={{ value: 5, isPositive: true }}
/>
```

### CourseAnalyticsTable

Displays course information in a table format.

```tsx
<CourseAnalyticsTable
    courses={coursesData}
    isLoading={false}
    title="Top 10 Courses by Enrollment"
/>
```

### UserGrowthChart

Bar chart visualization of user growth over time.

```tsx
<UserGrowthChart data={growthData} isLoading={false} />
```

### DashboardOverview

System overview with user and course breakdowns.

```tsx
<DashboardOverview stats={statsData} isLoading={false} />
```

## API Integration

The dashboard uses the following API endpoints:

### Get Dashboard Statistics

```
GET /api/v1/admindashboard/stats
```

### Get Course Analytics

```
GET /api/v1/admindashboard/courses/analytics
```

### Get Top Courses by Enrollment

```
GET /api/v1/admindashboard/courses/top-by-enrollment?limit=10
```

### Get Top Courses by Rating

```
GET /api/v1/admindashboard/courses/top-by-rating?limit=10
```

### Get User Growth Statistics

```
GET /api/v1/admindashboard/users/growth-stats?days=30
```

All endpoints require JWT authentication with Admin role.

## Data Types

### AdminDashboardStatsType

```typescript
{
  totalUsers: number
  totalCourses: number
  publishedCourses: number
  totalLessons: number
  totalMaterials: number
  totalAssignments: number
  totalEnrollments: number
  activeUsers: number
  activeCourses: number
  totalMaterialsSize: number (bytes)
  usersByRole: { [key: string]: number }
  coursesByStatus: { [key: string]: number }
  systemOverview: {
    lastUpdated: string (ISO datetime)
    averageEnrollmentPerCourse: number
    totalStorageUsedMB: number
    courseCompletionRate: number
    averageCourseRating: number
  }
}
```

### CourseAnalyticsType

```typescript
{
  id: number
  title: string
  enrollmentCount: number
  rating: number (0-5)
  status: string
  isPublished: boolean
  createdDate: string (ISO datetime)
}
```

### UserGrowthStatsType

```typescript
{
  date: string (ISO datetime)
  newUsers: number
  totalUsers: number
  activeUsers: number
}
```

## Usage

### Using the Dashboard Page

Navigate to `/manage/dashboard` to access the main dashboard page.

The page automatically loads all dashboard data on mount and provides filter options for:

-   User growth statistics (7, 30, 90, 180, 365 days)
-   Top courses by enrollment (5, 10, 20 courses)
-   Top courses by rating (5, 10, 20 courses)

### Using React Query Hooks

For custom implementations, use the provided hooks:

```tsx
import {
  useDashboardStats,
  useTopCoursesByEnrollment,
  useUserGrowthStats
} from '@/queries/useAdminDashboard'

export default function CustomDashboard() {
  const { data: stats, isLoading } = useDashboardStats()
  const { data: topCourses } = useTopCoursesByEnrollment(10)
  const { data: growthData } = useUserGrowthStats(30)

  return (
    // Your custom dashboard layout
  )
}
```

## Styling

The dashboard uses Tailwind CSS for styling. Color variants for cards:

-   `default`: Gray border
-   `primary`: Blue border
-   `success`: Green border
-   `warning`: Yellow border
-   `danger`: Red border

## Performance Considerations

1. **Dashboard Stats**: Aggregates data across multiple entities. Recommended cache duration: 5-10 minutes.

2. **Course Analytics**: May take time for large datasets. Consider pagination or filtering.

3. **User Growth Stats**: For large date ranges (365+ days), the endpoint may consume significant memory. Recommend limiting to 90-day queries by default.

4. **Rate Limiting**: Implement rate limiting to prevent abuse:
    - 100 requests per minute for dashboard stats
    - 50 requests per minute for detailed analytics

## Authentication

All dashboard endpoints require:

-   JWT Bearer token in Authorization header
-   User must have "Admin" role
-   Token must not be expired

## Error Handling

The dashboard includes error handling for:

-   401 Unauthorized: User not authenticated
-   403 Forbidden: User doesn't have Admin role
-   400 Bad Request: Invalid query parameters
-   500 Internal Server Error: Server-side issues

Errors are displayed as toast notifications to the user.

## Best Practices

1. **Caching**: Consider caching dashboard statistics for 5-10 minutes to improve performance.

2. **Filtering**: Use date filters when querying growth statistics to reduce payload size.

3. **Error Handling**: Always check the `succeeded` field before accessing `data`.

4. **Token Management**: Ensure JWT tokens are refreshed before expiration.

5. **Logging**: Log all admin dashboard access for security auditing.

## Customization

To customize the dashboard:

1. **Add New Metrics**: Create new components in `src/components/admin-dashboard/`

2. **Modify Layout**: Edit the main page component to rearrange sections

3. **Change Colors**: Update color variants in `StatCard` component

4. **Adjust Chart**: Modify the bar chart in `UserGrowthChart` for different visualizations

5. **Add Filters**: Extend the filter options by adding new state and query parameters

## Troubleshooting

### Missing Data

-   Check API endpoint availability
-   Verify JWT token is valid and not expired
-   Ensure user has Admin role

### Slow Performance

-   Reduce the date range for growth statistics
-   Limit the number of courses displayed
-   Enable response caching on the server

### CORS Issues

-   Check API CORS configuration
-   Verify API base URL in `src/config.ts`

## Support

For issues or questions regarding the Admin Dashboard, contact the development team or refer to the API documentation at `/docs/api/admin-dashboard.md`.
