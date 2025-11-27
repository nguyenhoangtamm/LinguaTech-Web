import http from "@/lib/http";

// Types for CourseTag
export interface CourseTag {
    id: number;
    name: string;
    description?: string;
    isActive: boolean;
}

export interface CreateCourseTagRequest {
    name: string;
    description?: string;
}

export interface UpdateCourseTagRequest {
    name?: string;
    description?: string;
}

export interface GetAllCourseTagsDto {
    id: number;
    name: string;
    description?: string;
    isActive: boolean;
}

// API Response interfaces
export interface CourseTagResponse {
    message: string;
    succeeded: boolean;
    data: CourseTag;
    code: number;
}

export interface GetAllCourseTagsResponse {
    message: string;
    succeeded: boolean;
    data: GetAllCourseTagsDto[];
    code: number;
}

// API Functions
const courseTagApiRequest = {
    // Get all course tags
    getAllCourseTags: () =>
        http.get<GetAllCourseTagsResponse>("coursetags/get-all"),

    // Get course tag by ID
    getCourseTag: (id: number) =>
        http.get<CourseTagResponse>(`coursetags/${id}`),

    // Create new course tag
    createCourseTag: (body: CreateCourseTagRequest) =>
        http.post<CourseTagResponse>("coursetags/create", body),

    // Update course tag
    updateCourseTag: (id: number, body: UpdateCourseTagRequest) =>
        http.put<CourseTagResponse>(`coursetags/update/${id}`, body),

    // Delete course tag
    deleteCourseTag: (id: number) =>
        http.delete<CourseTagResponse>(`coursetags/delete/${id}`),
};

export default courseTagApiRequest;
