import z from 'zod'

export const AttendanceHistorySchema = z.object({
    personCode: z.string(),
    lastName: z.string(),
    firstName: z.string(),
    departmentCode: z.string(),
    departmentName: z.string(),
    createdDate: z.string()
})

export type AttendanceHistoryType = z.TypeOf<typeof AttendanceHistorySchema>

export const AttendanceHistoryListRes = z.object({
    data: z.array(AttendanceHistorySchema),
    totalCount: z.number(),
    message: z.string()
})

export type AttendanceHistoryListResType = z.TypeOf<typeof AttendanceHistoryListRes>

export const AttendanceDashboardTotalSchema = z.object({
    total: z.number(),
    lanhDao: z.number(),
    giangVien: z.number(),
    chuyenVien: z.number(),
})
export const AttendanceDashboardTotalRes = z.object({
    data: AttendanceDashboardTotalSchema,
    message: z.string()
})

export type AttendanceDashboardTotalResType = z.TypeOf<typeof AttendanceDashboardTotalRes>

export const AttendanceDashboardDepartmentSchema = z.object({
    departmentCode: z.string(),
    departmentName: z.string(),
    total: z.number(),
    current: z.number(),
})
export const AttendanceDashboardDepartmentRes = z.object({
    data: z.array(AttendanceDashboardDepartmentSchema),
    message: z.string()
})

export type AttendanceDashboardDepartmentResType = z.TypeOf<typeof AttendanceDashboardDepartmentRes>

export const FilterAttendanceHistory = z.object({
    keywords: z.string().optional(),
    departmentCode: z.string().optional(),
    userName: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
})

export type FilterAttendanceHistoryType = z.TypeOf<typeof FilterAttendanceHistory>



export const FilterExportAttendanceHistory = z.object({
    months: z.array(z.string()).optional(),
    year: z.string().optional(),
    departmentCode: z.string().optional(),
    fileName: z.string().optional(),
})

export type FilterExportAttendanceHistoryType = z.TypeOf<typeof FilterExportAttendanceHistory>