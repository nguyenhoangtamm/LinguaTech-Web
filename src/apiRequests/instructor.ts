import http from "@/lib/http";
import {
    InstructorApplicationBodyType,
    InstructorApplicationResType,
    EnhancedCourseCreateBodyType,
} from "@/schemaValidations/instructor.schema";

const instructorApiRequest = {
    // Instructor Application APIs
    submitApplication: (body: InstructorApplicationBodyType) =>
        http.post<InstructorApplicationResType>(
            "/instructor/application",
            body
        ),

    getApplicationStatus: () =>
        http.get<InstructorApplicationResType>(
            "/instructor/application/status"
        ),

    getApplications: (page = 1, limit = 10, status?: string) =>
        http.get<any>(
            `/instructor/applications?page=${page}&limit=${limit}${
                status ? `&status=${status}` : ""
            }`
        ),

    reviewApplication: (
        applicationId: string,
        action: "approve" | "reject",
        note?: string
    ) =>
        http.put<InstructorApplicationResType>(
            `/instructor/applications/${applicationId}/review`,
            {
                action,
                note,
            }
        ),

    // Enhanced Course APIs
    createEnhancedCourse: (body: EnhancedCourseCreateBodyType) =>
        http.post<any>("/instructor/courses/enhanced", body),

    updateEnhancedCourse: (
        courseId: string,
        body: Partial<EnhancedCourseCreateBodyType>
    ) => http.put<any>(`/instructor/courses/${courseId}/enhanced`, body),

    getMyCourses: (page = 1, limit = 10, status?: string) =>
        http.get<any>(
            `/instructor/courses?page=${page}&limit=${limit}${
                status ? `&status=${status}` : ""
            }`
        ),

    getCourseDetail: (courseId: string) =>
        http.get<any>(`/instructor/courses/${courseId}`),

    publishCourse: (courseId: string) =>
        http.put<any>(`/instructor/courses/${courseId}/publish`, {}),

    unpublishCourse: (courseId: string) =>
        http.put<any>(`/instructor/courses/${courseId}/unpublish`, {}),

    deleteCourse: (courseId: string) =>
        http.delete<any>(`/instructor/courses/${courseId}`),

    // Course Statistics
    getCourseStats: (courseId: string, period = "month") =>
        http.get<any>(`/instructor/courses/${courseId}/stats?period=${period}`),

    getInstructorDashboard: () => http.get<any>("/instructor/dashboard"),

    // Course Content Management
    addModule: (courseId: string, moduleData: any) =>
        http.post<any>(`/instructor/courses/${courseId}/modules`, moduleData),

    updateModule: (courseId: string, moduleId: string, moduleData: any) =>
        http.put<any>(
            `/instructor/courses/${courseId}/modules/${moduleId}`,
            moduleData
        ),

    deleteModule: (courseId: string, moduleId: string) =>
        http.delete<any>(`/instructor/courses/${courseId}/modules/${moduleId}`),

    addLesson: (courseId: string, moduleId: string, lessonData: any) =>
        http.post<any>(
            `/instructor/courses/${courseId}/modules/${moduleId}/lessons`,
            lessonData
        ),

    updateLesson: (
        courseId: string,
        moduleId: string,
        lessonId: string,
        lessonData: any
    ) =>
        http.put<any>(
            `/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
            lessonData
        ),

    deleteLesson: (courseId: string, moduleId: string, lessonId: string) =>
        http.delete<any>(
            `/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
        ),

    // File Upload APIs
    uploadCourseThumbnail: (file: File) => {
        const formData = new FormData();
        formData.append("thumbnail", file);
        return http.post<{ url: string }>(
            "/instructor/upload/thumbnail",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },

    uploadCourseVideo: (file: File) => {
        const formData = new FormData();
        formData.append("video", file);
        return http.post<{ url: string }>(
            "/instructor/upload/video",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },

    uploadDocument: (file: File, type: "cv" | "certificate") => {
        const formData = new FormData();
        formData.append("document", file);
        formData.append("type", type);
        return http.post<{ url: string }>(
            "/instructor/upload/document",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },
};

export default instructorApiRequest;
