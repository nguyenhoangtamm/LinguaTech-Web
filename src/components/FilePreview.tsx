import { FileText, Image, File } from "lucide-react";

export type FileType = {
    fileId: string;
    fileName: string;
    fileType?: string;
};

const formatSize = (size: number) => {
    return `${(size / 1024).toFixed(0)} KB`;
};

const getIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="text-red-500 w-5 h-5" />;
    if (type.includes("image")) return <Image className="text-blue-500 w-5 h-5" />;
    return <File className="text-gray-500 w-5 h-5" />;
};

export default function FilePreview({ file }: { file: FileType }) {
    return (
        <div className="flex items-center border rounded-lg p-3 gap-3 shadow-sm">
            <div className="bg-red-100 rounded-full p-2 flex-shrink-0">
                {getIcon(file.fileType ?? "")}
            </div>
            <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-blue-800 truncate">{file.fileName}</p>
                {/*<p className="text-xs text-gray-500">{formatSize(file.size)}</p>*/}
            </div>
            <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-red-500 font-semibold hover:underline flex-shrink-0"
            >
                [Xem]
            </a>
        </div>
    );
}
