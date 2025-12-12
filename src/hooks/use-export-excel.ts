import { useState } from "react";
import { useToast } from "./use-toast";
import {
    exportToExcel,
    exportStatisticsReport,
    type ExcelColumn,
} from "@/utils/excel-export";

interface UseExportExcelOptions {
    fileName: string;
    sheetName?: string;
    columns: ExcelColumn[];
    title?: string;
}

interface UseExportExcelReturn {
    isExporting: boolean;
    exportData: (data: any[]) => Promise<void>;
    error: string | null;
}

/**
 * Hook để xuất dữ liệu ra file Excel
 */
export const useExportExcel = (
    options: UseExportExcelOptions
): UseExportExcelReturn => {
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const exportData = async (data: any[]) => {
        if (!data || data.length === 0) {
            toast({
                title: "Lỗi",
                description: "Không có dữ liệu để xuất",
                variant: "destructive",
            });
            setError("Không có dữ liệu để xuất");
            return;
        }

        try {
            setIsExporting(true);
            setError(null);

            await exportToExcel({
                fileName: options.fileName,
                sheetName: options.sheetName || "Sheet1",
                columns: options.columns,
                data,
                title: options.title,
            });

            toast({
                title: "Thành công",
                description: "Xuất dữ liệu ra Excel thành công",
            });
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Lỗi không xác định";
            setError(errorMessage);
            toast({
                title: "Lỗi",
                description: `Xuất Excel thất bại: ${errorMessage}`,
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    return {
        isExporting,
        exportData,
        error,
    };
};

/**
 * Hook để xuất báo cáo thống kê
 */
export const useExportStatisticsReport = () => {
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);

    const exportReport = async (
        fileName: string,
        statistics: any,
        reportTitle: string
    ) => {
        try {
            setIsExporting(true);
            await exportStatisticsReport(fileName, statistics, reportTitle);

            toast({
                title: "Thành công",
                description: "Xuất báo cáo thành công",
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Lỗi không xác định";
            toast({
                title: "Lỗi",
                description: `Xuất báo cáo thất bại: ${errorMessage}`,
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    return { isExporting, exportReport };
};
