"use client";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { getDisplayedRowCount, handleErrorApi } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/auto-pagination";
import { PencilIcon, Search, Settings } from "lucide-react";
import { useDeleteRoleMutation } from "@/queries/useRole";
import { Label } from "@/components/ui/label";
import { ClipLoader } from "react-spinners";
import { useProfileListQuery } from "@/queries/useUserProfile";
import { FilterProfileType, ProfileListResType, ProfileResType } from "@/schemaValidations/profile.schema";
import RoleSelector from "@/components/RoleSelector";
import styles from "./user.module.css";
import { PageHeaderProps } from "@/types/page-header-props.type";
import { usePageHeader } from "@/hooks/use-page-header";

type ProfileItem = ProfileListResType["data"][0];

const ProfileTableContext = createContext<{
    setProfileIdEdit: (value: string) => void;
    profileIdEdit: string | undefined;
}>({
    setProfileIdEdit: (value: string | undefined) => {
    },
    profileIdEdit: undefined,
});

export const columns: ColumnDef<ProfileResType>[] = [
    {
        header: "STT",
        accessorKey: "id",
        cell: ({ row, table }: any) => {
            const pagination = table.getState().pagination;
            const pageSize = pagination.pageSize;
            const pageIndex = pagination.pageIndex;
            const stt = pageIndex * pageSize + row.index + 1;
            return <Label>{stt}</Label>;
        },
        meta: {
            style: { textAlign: "center" },
            className: "w-[100px]",
        },
    },
    {
        accessorKey: "profileCode",
        header: "Code",
        cell: ({ row }) => <div className="capitalize">{row.getValue("profileCode")}</div>,
    },
    {
        accessorKey: "name",
        header: "Tên",
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
        header: "Đơn vị",
        accessorKey: "subName",
        cell: ({ row }) => <div>{row.getValue("subName")}</div>,
    },
    {
        header: "Vai trò",
        accessorKey: "roles",
        cell: ({ row }) => {
            const roles = row.getValue("roles") as { code?: string; displayName?: string }[];
            console.log("Roles: ", roles);
            const profileCode = row.getValue("profileCode") as string;
            const userName = row.original.userName ?? "";
            return (
                <RoleSelector roleList={roles} profileCode={profileCode} userName={userName} />
            );
        },
        meta: {
            style: { textAlign: "center" },
            className: "",
        },
    },
    // {
    //     id: "actions",
    //     enableHiding: false,
    //
    //     cell: function Actions({row}) {
    //         const {setProfileIdEdit} = useContext(ProfileTableContext);
    //         const openEditProfile = () => {
    //             setProfileIdEdit(row.original.profileCode);
    //         };
    //         return (
    //             <div className="flex items-center justify-end gap-2 pe-4">
    //                 <Tooltip size="sm" content={"Cấu hình"} placement="top" color="invert">
    //                     <ActionIcon
    //                         onClick={() => openEditProfile()}
    //                         size="sm"
    //                         variant="outline"
    //                         aria-label={"Sửa"}
    //                         className="cursor-pointer hover:!border-gray-900 hover:text-gray-700"
    //                     >
    //                         <Settings className="h-4 w-4"/>
    //                     </ActionIcon>
    //                 </Tooltip>
    //             </div>
    //         );
    //     },
    //     meta: {
    //         style: {textAlign: "center"},
    //         className: "w-[100px]",
    //     },
    // },
];
const PAGE_SIZE = 15;
export default function UserTable({ title, breadcrumb }: PageHeaderProps) {
    usePageHeader({ title, breadcrumb });

    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const [profileIdEdit, setProfileIdEdit] = useState<string | undefined>();

    const [filter, setFilter] = useState<FilterProfileType>({ keywords: "" });
    const profileListQuery = useProfileListQuery({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keywords: filter.keywords,
    });
    const { data, totalCount }: { data: ProfileResType[]; totalCount: number } =
        profileListQuery.data ?? {
            data: [],
            totalCount: 0,
        };
    const [pagination, setPagination] = useState({
        pageIndex,
        pageSize: PAGE_SIZE,
    });
    const table = useReactTable({
        data,
        columns: columns,
        manualPagination: true,
        rowCount: totalCount,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        autoResetPageIndex: false,
        state: {
            pagination,
        },
    });

    useEffect(() => {
        table.setPagination({
            pageIndex,
            pageSize: PAGE_SIZE,
        });
    }, [table, pageIndex]);

    const [activeSearch, setActiveSearch] = useState(false);

    useEffect(() => {
        if (activeSearch) {
            setPagination({
                pageIndex: 0,
                pageSize: PAGE_SIZE,
            });
            profileListQuery.refetch();
            setActiveSearch(false);
        }
    }, [activeSearch, profileListQuery]);

    const handleSearch = () => {
        let actionChange = false;
        if (inputSearchRef.current) {
            const searchValue = inputSearchRef.current?.value ?? "";
            setFilter({ ...filter, keywords: searchValue });
            actionChange = true;
        }
        if (actionChange) {
            setActiveSearch(true);
        }
    };
    const inputSearchRef = useRef<HTMLInputElement>(null);
    const { mutateAsync } = useDeleteRoleMutation();

    return (
        <ProfileTableContext.Provider
            value={{ setProfileIdEdit, profileIdEdit }}
        >
            <div className="w-full">
                <div className="flex items-center py-4 gap-3">
                    <Input
                        ref={inputSearchRef}
                        placeholder="Tìm kiếm"
                        className="max-w-sm"
                    />
                    <Button onClick={handleSearch}>
                        {" "}
                        <Search /> Tìm kiếm
                    </Button>
                    <div className="ml-auto flex items-center gap-2"></div>
                </div>
                <div className="rounded-md border">
                    <div className={styles.responsiveTable}>
                        <Table
                            className="rc-table [&_.rc-table-content]:overflow-x-auto [&_table]:w-full [&_.rc-table-row:hover]:bg-gray-50 [&_.rc-table-row-expand-icon-cell]:w-14 [&_thead]:text-left [&_thead]:rtl:text-right [&_th.rc-table-cell]:uppercase [&_th.rc-table-cell]:text-xs [&_th.rc-table-cell]:font-semibold [&_th.rc-table-cell]:tracking-wider [&_th.rc-table-cell]:text-gray-500 [&_.rc-table-cell]:px-3 [&_th.rc-table-cell]:py-3 [&_td.rc-table-cell]:py-4 [&_thead_th]:bg-gray-100 [&_td.rc-table-cell]:border-b [&_td.rc-table-cell]:border-muted/70 [&_thead_.rc-table-row-expand-icon-cell]:bg-gray-100 rounded-md border border-muted text-sm shadow-sm [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:h-60 [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:justify-center [&_.rc-table-row:last-child_td.rc-table-cell]:border-b-0 [&_thead.rc-table-thead]:border-t-0 rc-table-ping-right rc-table-scroll-horizontal">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    style={(header.column.columnDef.meta as any)?.style}
                                                    className={
                                                        (header.column.columnDef.meta as any)?.className
                                                    }
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {profileListQuery.isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            <ClipLoader
                                                color="#004875e6"
                                                loading={profileListQuery.isLoading}
                                                size={30}
                                                aria-label="Loading Spinner"
                                                data-testid="loader"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                    style={(cell.column.columnDef.meta as any)?.style}
                                                    className={
                                                        (cell.column.columnDef.meta as any)?.className
                                                    }
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            Không có dữ liệu.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="text-sm py-4 flex-1 ">
                        Hiển thị{" "}
                        <strong>
                            {getDisplayedRowCount(
                                pageIndex,
                                PAGE_SIZE,
                                table.getPaginationRowModel().rows.length,
                                totalCount
                            )}
                        </strong>{" "}
                        trong <strong>{totalCount}</strong> kết quả
                    </div>
                    <div>
                        <AutoPagination
                            page={table.getState().pagination.pageIndex + 1}
                            pageSize={table.getPageCount()}
                            pathname="/manage/users"
                        />
                    </div>
                </div>
            </div>
        </ProfileTableContext.Provider>
    );
}
