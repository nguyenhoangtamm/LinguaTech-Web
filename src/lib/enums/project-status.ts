export enum ProjectStatus {
    Open = 1,
    Closed = 2,
}

export const ProjectStatusNames: Record<ProjectStatus, string> = {
    [ProjectStatus.Open]: "Mở",
    [ProjectStatus.Closed]: "Đóng"
};

export function getProjectStatusName(status: ProjectStatus): string {
    return ProjectStatusNames[status] ?? "Không xác định";
}

export const ProjectStatusColors: Record<ProjectStatus, string> = {
    [ProjectStatus.Open]: "bg-emerald-100 text-emerald-700", // Mở
    [ProjectStatus.Closed]: "bg-gray-300 text-gray-800"       // Đóng
};

export function getProjectStatusColor(status: ProjectStatus): string {
    return ProjectStatusColors[status] ?? "bg-gray-100 text-gray-600";
}
