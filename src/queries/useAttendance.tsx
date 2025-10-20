import {useQuery} from "@tanstack/react-query";
import attendanceApiRequest from "@/apiRequests/attendance";
import {FilterAttendanceHistoryType, FilterExportAttendanceHistoryType} from "@/schemaValidations/attendace.schema";
import {FilterDeviceType} from "@/schemaValidations/device.schema";
import {buildUrlWithParams} from "@/lib/utils";
import envConfig from "@/config";

export const useAttendanceHistoryListQuery = ({pageSize, pageNumber, ...filter}: {
    pageSize: number,
    pageNumber: number
} & Partial<FilterAttendanceHistoryType>) => {
    const params = {pageSize, pageNumber, ...filter}
    return useQuery({
        queryKey: ['attendance-history', params.pageNumber, params.pageSize],
        queryFn: () => attendanceApiRequest.list(params)
    })
}

export const useDashboardTotalQuery = (date: string) => {
    return useQuery({
        queryKey: ["dashboardTotal", date],
        queryFn:  () => attendanceApiRequest.dashboardTotal(date),
    });
};
export const useDashboardDepartmentQuery = (date: string) => {
    return useQuery({
        queryKey: ["dashboardDepartments", date],
        queryFn:  () => attendanceApiRequest.dashboardDepartments(date),
    });
};
export const useExcelReport = (filter: FilterExportAttendanceHistoryType) => {
    return useQuery({
        queryKey: ["excelReport"],
        queryFn: async () => {
            const response = await fetch(buildUrlWithParams(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/Reports/export-months`, filter) );
            return response.blob();
        },
        enabled: false,
    });
};