import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export interface ExcelColumn {
    header: string;
    key: string;
    width?: number;
    type?: string;
    format?: string;
}

interface ExcelOptions {
    fileName: string;
    sheetName?: string;
    columns: ExcelColumn[];
    data: any[];
    title?: string;
    titleRowColor?: string;
    headerRowColor?: string;
    autoFilter?: boolean;
    freezePane?: boolean;
}

/**
 * Xuất dữ liệu ra file Excel
 * @param options - Cấu hình cho file Excel
 */
export const exportToExcel = async (options: ExcelOptions) => {
    const {
        fileName,
        sheetName = "Sheet1",
        columns,
        data,
        title,
        titleRowColor = "FFE699",
        headerRowColor = "4472C4",
        autoFilter = true,
        freezePane = true,
    } = options;

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);

        // Thêm tiêu đề nếu có
        let currentRow = 1;
        if (title) {
            const titleCell = worksheet.getCell(currentRow, 1);
            titleCell.value = title;
            titleCell.font = {
                bold: true,
                size: 14,
                color: { argb: "000000" },
            };
            titleCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: titleRowColor },
            };
            titleCell.alignment = { horizontal: "center", vertical: "middle" };
            worksheet.mergeCells(currentRow, 1, currentRow, columns.length);
            worksheet.getRow(currentRow).height = 25;
            currentRow++;

            // Dòng trống sau tiêu đề
            currentRow++;
        }

        // Thêm headers
        const headerRow = worksheet.getRow(currentRow);
        columns.forEach((col, index) => {
            const cell = headerRow.getCell(index + 1);
            cell.value = col.header;
            cell.font = { bold: true, color: { argb: "FFFFFF" } };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: headerRowColor },
            };
            cell.alignment = {
                horizontal: "center",
                vertical: "middle",
                wrapText: true,
            };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };

            // Đặt độ rộng cột
            worksheet.getColumn(index + 1).width = col.width || 15;
        });
        headerRow.height = 25;
        currentRow++;

        // Thêm dữ liệu
        data.forEach((row, rowIndex) => {
            const excelRow = worksheet.getRow(currentRow);
            columns.forEach((col, colIndex) => {
                const cell = excelRow.getCell(colIndex + 1);
                let value = row[col.key];

                // Format dữ liệu nếu cần
                if (col.type === "date" && value) {
                    const date = new Date(value);
                    value = date.toLocaleDateString("vi-VN");
                } else if (
                    col.type === "number" &&
                    value !== null &&
                    value !== undefined
                ) {
                    value = Number(value);
                }

                cell.value = value;
                cell.alignment = {
                    horizontal: "left",
                    vertical: "middle",
                    wrapText: true,
                };
                cell.border = {
                    top: { style: "thin", color: { argb: "D3D3D3" } },
                    left: { style: "thin", color: { argb: "D3D3D3" } },
                    bottom: { style: "thin", color: { argb: "D3D3D3" } },
                    right: { style: "thin", color: { argb: "D3D3D3" } },
                };

                // Áp dụng format nếu có
                if (col.format) {
                    cell.numFmt = col.format;
                }
            });
            excelRow.height = 20;
            currentRow++;
        });

        // Thêm auto filter nếu cần
        if (autoFilter && data.length > 0 && worksheet.autoFilter) {
            const startRow = title ? 3 : 1;
            const endRow = currentRow - 1;
            const endCol = String.fromCharCode(64 + columns.length);
            (
                worksheet.autoFilter as any
            ).ref = `A${startRow}:${endCol}${endRow}`;
        }

        // Freeze pane nếu cần
        if (freezePane) {
            worksheet.views = [
                { state: "frozen", xSplit: 0, ySplit: title ? 3 : 1 },
            ];
        }

        // Tạo file và tải xuống
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(
            blob,
            `${fileName}-${new Date().toISOString().split("T")[0]}.xlsx`
        );

        return true;
    } catch (error) {
        console.error("Lỗi khi xuất Excel:", error);
        throw error;
    }
};

/**
 * Xuất báo cáo thống kê
 */
export const exportStatisticsReport = async (
    fileName: string,
    statistics: any,
    reportTitle: string
) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Báo cáo");

    let row = 1;

    // Tiêu đề
    const titleCell = worksheet.getCell(row, 1);
    titleCell.value = reportTitle;
    titleCell.font = { bold: true, size: 16, color: { argb: "FFFFFF" } };
    titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "203864" },
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.mergeCells(row, 1, row, 4);
    worksheet.getRow(row).height = 30;
    row += 2;

    // Dữ liệu thống kê
    Object.entries(statistics).forEach(([key, value]) => {
        const labelCell = worksheet.getCell(row, 1);
        labelCell.value = key;
        labelCell.font = { bold: true };
        labelCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E7E6E6" },
        };

        const valueCell = worksheet.getCell(row, 2);
        valueCell.value = value as any;
        valueCell.font = { size: 12 };

        worksheet.mergeCells(row, 1, row, 1);
        worksheet.mergeCells(row, 2, row, 4);

        row++;
    });

    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 20;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}-${new Date().toISOString().split("T")[0]}.xlsx`);

    return true;
};
