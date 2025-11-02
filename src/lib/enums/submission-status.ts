export enum SubmissionStatus {
    Draft = 1,
    Submitted = 2,
    Graded = 3,
    Overdue = 4,
}

export const SubmissionStatusNames: Record<SubmissionStatus, string> = {
    [SubmissionStatus.Draft]: "Bản nháp",
    [SubmissionStatus.Submitted]: "Đã nộp",
    [SubmissionStatus.Graded]: "Đã chấm điểm",
    [SubmissionStatus.Overdue]: "Quá hạn",
};

export function getSubmissionStatusName(status: SubmissionStatus): string {
    return SubmissionStatusNames[status] ?? "Không xác định";
}

export const SubmissionStatusColors: Record<SubmissionStatus, string> = {
    [SubmissionStatus.Draft]: "bg-yellow-100 text-yellow-700", // Bản nháp
    [SubmissionStatus.Submitted]: "bg-blue-100 text-blue-700", // Đã nộp
    [SubmissionStatus.Graded]: "bg-green-100 text-green-700", // Đã chấm điểm
    [SubmissionStatus.Overdue]: "bg-red-100 text-red-700", // Quá hạn
};

export function getSubmissionStatusColor(status: SubmissionStatus): string {
    return SubmissionStatusColors[status] ?? "bg-gray-100 text-gray-600";
}
