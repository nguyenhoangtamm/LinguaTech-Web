import { IconButton, Button, Whisper, Popover } from 'rsuite';
import TrashIcon from '@/components/icons/trash';
import { PiTrashFill } from 'react-icons/pi';
import { useRef, useState } from 'react';

type DeletePopoverProps = {
    title: string;
    description: string;
    onDelete: () => void;
};

export default function DeletePopover({
    title,
    description,
    onDelete,
}: DeletePopoverProps) {
    const whisperRef = useRef(null);
    const [open, setOpen] = useState(false);

    return (
        <Whisper
            ref={whisperRef}
            placement="topEnd"
            trigger="click"
            speaker={
                <Popover>
                    <div className="w-56 pb-2 pt-1 text-left rtl:text-right">
                        <h6 className="mb-0.5 flex items-start text-sm text-gray-700 sm:items-center">
                            <PiTrashFill className="me-1 h-[17px] w-[17px]" /> {title}
                        </h6>
                        <p className="mb-2 leading-relaxed text-gray-500">
                            {description}
                        </p>
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                size="sm"
                                appearance="primary"
                                color="red"
                                onClick={() => {
                                    onDelete();
                                    (whisperRef.current as any)?.close?.();
                                }}
                                className="h-7 px-3"
                            >
                                Có
                            </Button>
                            <Button
                                size="sm"
                                appearance="ghost"
                                className="h-7 px-3"
                                onClick={() => (whisperRef.current as any)?.close?.()}
                            >
                                Không
                            </Button>
                        </div>
                    </div>
                </Popover>
            }
        >
            <IconButton
                size="sm"
                appearance="subtle"
                icon={<TrashIcon color="red" className="h-4 w-4" />}
                title="Xóa"
                className="cursor-pointer hover:text-red-700"
            />
        </Whisper>
    );
}
