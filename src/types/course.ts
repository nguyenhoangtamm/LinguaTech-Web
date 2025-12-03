export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    duration: number; // in hours
    level: number;
    price: number;
    rating: number;
    studentsCount: number;
    category: CourseCategory;
    tags: number[];
    thumbnailUrl: string;
    videoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    isPublished: boolean;
}

export interface CourseCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
}

export interface UserProgress {
    courseId: string;
    userId: string;
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
    lastAccessedAt: Date;
    startedAt: Date;
    completedAt?: Date;
}

export interface Enrollment {
    id: string;
    userId: string;
    courseId: string;
    enrolledAt: Date;
    status: "active" | "completed" | "paused" | "cancelled";
    progress: UserProgress;
}

export interface UserDashboardStats {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalStudyHours: number;
    streak: number;
    achievements: Achievement[];
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: Date;
    type: "course_completion" | "streak" | "study_hours" | "skill" | "other";
}

export interface CourseFilter {
    category?: string;
    level?: Course["level"];
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    tags?: string[];
    search?: string;
}
