// Common API response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
    statusCode?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}

// Common filter types
export interface BaseFilter {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

// File upload types
export interface FileUpload {
    file: File;
    fileName?: string;
    category?: string;
}

export interface UploadedFile {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    size: number;
    uploadedAt: Date;
}

// Common status types
export type Status = "active" | "inactive" | "pending" | "archived";
export type PublishStatus = "draft" | "published" | "archived";
