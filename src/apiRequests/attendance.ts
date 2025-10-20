import http from '@/lib/http'
import {buildUrlWithParams} from "@/lib/utils";
import {
    AttendanceDashboardDepartmentResType,
    AttendanceDashboardTotalResType,
    AttendanceHistoryListResType,
    FilterExportAttendanceHistoryType
} from "@/schemaValidations/attendace.schema";

const controller = "AttendanceLog"
const attendanceApiRequest = {
    list: (filters: {pageNumber: number, pageSize: number}) => http.get<AttendanceHistoryListResType>(buildUrlWithParams(`${controller}/get-pagination`, filters)),
    export: ({ ...filter}: {
    } & Partial<FilterExportAttendanceHistoryType> )=> http.get(buildUrlWithParams(`/reports/export-months`, filter), {
    }),
    dashboardTotal: (date: string) => http.get<AttendanceDashboardTotalResType>(buildUrlWithParams(`${controller}/dashboard-total`, { date: date })),
    dashboardDepartments: (date: string) => http.get<AttendanceDashboardDepartmentResType>(buildUrlWithParams(`${controller}/dashboard-departments`, { date: date })),
}

export default attendanceApiRequest
