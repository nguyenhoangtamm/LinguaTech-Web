import { Popover, Whisper, Button, Modal } from 'rsuite';
import { PiTrashFill } from 'react-icons/pi';
import { useRef } from 'react';
import { Trash2 } from 'lucide-react';

type DeletePopoverProps = {
    title: string;
    description: string;
    onDelete: () => void;
    onCancel?: () => void;
    open?: boolean;
    showTrigger?: boolean;
    buttonName?: string;
};

export default function DeletePopover({
    title,
    description,
    onDelete,
    onCancel,
    open,
    showTrigger = true,
    buttonName 
}: DeletePopoverProps) {
    const whisperRef = useRef<any>(null);

    // Nếu có prop open, sử dụng Modal thay vì Popover
    if (open !== undefined) {
        return (
            <Modal
                open={open}
                onClose={onCancel}
                size="xs"
                backdrop="static"
            >
                <Modal.Header>
                    <Modal.Title className="flex items-center text-sm text-gray-700">
                        <PiTrashFill className="me-2 h-[17px] w-[17px] text-red-500" />
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="leading-relaxed text-gray-500 text-sm">
                        {description}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        size="sm"
                        color="red"
                        appearance="primary"
                        onClick={onDelete}
                    >
                        Có
                    </Button>
                    <Button
                        size="sm"
                        appearance="default"
                        onClick={onCancel}
                    >
                        Không
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    const handleDelete = () => {
        onDelete();
        whisperRef.current?.close();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        whisperRef.current?.close();
    };

    const popoverContent = (
        <Popover className="w-56 p-0">
            <div className="pb-2 pt-1 text-left rtl:text-right p-3">
                <h6 className="mb-0.5 flex items-start text-sm text-gray-700 sm:items-center font-medium">
                    <PiTrashFill className="me-1 h-[17px] w-[17px]" />
                    {title}
                </h6>
                <p className="mb-2 leading-relaxed text-gray-500 text-sm">
                    {description}
                </p>
                <div className="flex items-center justify-end gap-2">
                    <Button
                        size="xs"
                        color="red"
                        appearance="primary"
                        onClick={handleDelete}
                        className="h-7 px-3"
                    >
                        Có
                    </Button>
                    <Button
                        size="xs"
                        appearance="default"
                        onClick={handleCancel}
                        className="h-7 px-3"
                    >
                        Không
                    </Button>
                </div>
            </div>
        </Popover>
    );

    if (!showTrigger) {
        return null;
    }

    return (
        <Whisper
            ref={whisperRef}
            placement="left"
            trigger="click"
            speaker={popoverContent}
            controlId="delete-popover"
        >
            <span className="inline-flex items-center">
                <Trash2 color="red" size={14} className="mr-2" />
                {buttonName ? buttonName : "Xóa"}
            </span>
        </Whisper>
    );
}