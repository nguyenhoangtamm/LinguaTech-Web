import http from "@/lib/http";
import { SubmissionStatus } from "@/lib/enums/submission-status";

// Assignment API endpoints
const assignmentApiRequest = {
    // Get assignment details by ID
    getAssignmentById: (assignmentId: string) =>
        http.get<Assignment>(`/assignments/${assignmentId}`),

    // Get assignments for a lesson
    getAssignmentsByLesson: (lessonId: string) =>
        http.get<{ data: Assignment[]; message: string }>(
            `/assignments/lesson/${lessonId}`
        ),

    // Submit assignment answers
    submitAssignment: (assignmentId: string, body: SubmitAssignmentRequest) =>
        http.post<SubmitAssignmentResponse>(
            `/submissions/${assignmentId}/submit`,
            body
        ),

    // Save draft answers (auto-save)
    saveDraftAnswers: (assignmentId: string, body: SaveDraftRequest) =>
        http.post<SaveDraftResponse>(
            `/assignments/${assignmentId}/draft`,
            body
        ),

    // Get user's submission for an assignment
    getUserSubmission: (assignmentId: string) =>
        http.get<UserSubmission>(`/submissions/by-assignment/${assignmentId}`),

    // Get all submissions for an assignment (for teachers)
    getAssignmentSubmissions: (assignmentId: string) =>
        http.get<{ data: UserSubmission[]; message: string }>(
            `/submissions/by-assignment/${assignmentId}`
        ),

    // Grade assignment submission
    gradeSubmission: (submissionId: string, body: GradeSubmissionRequest) =>
        http.post<GradeSubmissionResponse>(
            `/submissions/${submissionId}/grade`,
            body
        ),
};

// Type definitions for assignment-related requests and responses
export interface Assignment {
    id: string;
    title: string;
    description: string;
    dueDate: string | Date;
    completionDate: string | Date | null;
    isDeleted: boolean;
    lessonId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    totalScore: number;
    questions: Question[];
}

export interface Question {
    id: string;
    content: string;
    score: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    isDeleted: boolean;
    assignmentId: string;
    questionTypeId: "essay" | "multiple_choice" | "true_false" | "fill_blank";
    instructions?: string;
    options?: QuestionOption[];
}

export interface QuestionOption {
    id: string;
    content: string;
    isCorrect: boolean;
    questionId: string;
}

export interface AnswerRequest {
    questionId: string;
    answer?: string;
    selectedOptionId?: string; // For multiple choice questions
}

export interface SubmitAssignmentRequest {
    answers: AnswerRequest[];
}

export interface SubmitAssignmentResponse {
    submissionId: string;
    score: number | null;
    submittedAt: string | Date;
    status: SubmissionStatus;
    message: string;
}

export interface SaveDraftRequest {
    answers: AnswerRequest[];
}

export interface SaveDraftResponse {
    message: string;
    savedAt: string | Date;
}

export interface UserSubmission {
    id: string;
    assignmentId: string;
    userId: string;
    score: number | null;
    submittedAt: string | Date | null;
    gradedAt: string | Date | null;
    status: SubmissionStatus;
    answers: SubmissionAnswer[];
    feedback?: string;
}

export interface SubmissionAnswer {
    id: string;
    questionId: string;
    answer?: string;
    selectedOptionId?: string;
    isCorrect?: boolean;
    score?: number;
    feedback?: string;
}

export interface GradeSubmissionRequest {
    answers: GradeAnswerRequest[];
    totalScore: number;
    feedback?: string;
}

export interface GradeAnswerRequest {
    answerId: string;
    score: number;
    feedback?: string;
}

export interface GradeSubmissionResponse {
    submissionId: string;
    totalScore: number;
    gradedAt: string | Date;
    message: string;
}

export default assignmentApiRequest;
