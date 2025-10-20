"use client";

import { useAtomValue } from "jotai";
import { z } from "zod";
import { LuReply } from "react-icons/lu";
import { useState, useEffect } from "react";
import { PiCaretDownBold } from "react-icons/pi";
import {
  Title,
  Text,
  Badge,
  Button,
  Avatar,
  Empty,
  Select,
  Loader,
} from "rizzui";
import cn from "@/utils/class-names";
import {
  dataAtom,
  messageIdAtom,
} from "@/app/shared/support/inbox/message-list";
// import { SubmitHandler, Controller } from "react-hook-form";
import { Form } from "@/components/ui/form-inbox";
import ActionDropdown from "@/app/shared/support/inbox/action-dropdown";
import MessageBody from "@/app/shared/support/inbox/message-body";
import SimpleBar from "@/components/ui/simplebar";
import { useElementSize } from "@/hooks/use-element-size";
import { useMedia } from "@/hooks/use-media";
import dynamic from "next/dynamic";
import { SupportType, supportTypes } from "@/data/support-inbox";
import { SubmitHandler, Controller, Control } from "react-hook-form";
const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), {
  ssr: false,
});

const FormSchema = z.object({
  message: z.string({ required_error: "Invalid email address" }),
});

type FormValues = {
  message: string;
};

const priorityOptions = [
  {
    value: "Low",
    label: "Low",
  },
  {
    value: "Medium",
    label: "Medium",
  },
  {
    value: "High",
    label: "High",
  },
];

const agentsOptions = [
  {
    value: 1,
    label: "Isabel Larson",
    avatar:
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-10.webp",
  },
  {
    value: 2,
    label: "Elias Pouros",
    avatar:
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp",
  },
  {
    value: 3,
    label: "Rose Powlowski-Paucek",
    avatar:
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-13.webp",
  },
  {
    value: 4,
    label: "Milton Leannon",
    avatar:
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-04.webp",
  },
];

const contactStatuses = [
  {
    value: "New",
    label: "New",
  },
  {
    value: "Waiting on contact",
    label: "Waiting on contact",
  },
  {
    value: "Waiting on us",
    label: "Waiting on us",
  },
  {
    value: "Closed",
    label: "Closed",
  },
];

const supportOptionTypes = [
  {
    value: supportTypes.Chat,
    label: supportTypes.Chat,
  },
  {
    value: supportTypes.Email,
    label: supportTypes.Email,
  },
];

export default function MessageDetails({ className }: { className?: string }) {
  const data = useAtomValue(dataAtom);
  const [agent, setAgent] = useState();
  const [priority, setPriority] = useState("");
  const messageId = useAtomValue(messageIdAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [supportType, setSupportType] = useState<SupportType>();
  const [contactStatus, setContactStatus] = useState(contactStatuses[0].value);
  const [ref, { width }] = useElementSize();
  const isWide = useMedia("(min-width: 1280px) and (max-width: 1440px)", false);

  function formWidth() {
    if (isWide) return width - 64;
    return width - 44;
  }

  // tim mesage dua tren mesageId
  const message = messageId ? data.find((m) => m.id === messageId) : undefined;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSupportType(message?.supportType);
  }, [message]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "!grid h-full min-h-[128px] flex-grow place-content-center items-center justify-center",
          className
        )}
      >
        <Loader variant="spinner" size="xl" />
      </div>
    );
  }

  if (!message) {
    return (
      <div
        className={cn(
          "!grid h-full min-h-[128px] flex-grow place-content-center items-center justify-center",
          className
        )}
      >
        <Empty
          text="Chưa chọn thông báo"
          textClassName="mt-4 text-base text-gray-500"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative pt-6 lg:rounded-lg lg:border lg:border-muted lg:px-4 lg:py-7 xl:px-5 xl:py-5 2xl:pb-7 2xl:pt-6",
        className
      )}
    >
      <div>
        <header className="flex flex-row justify-between items-center gap-4 border-b border-muted pb-5">
          <div className="flex flex-col items-start justify-between gap-3 xs:flex-row xs:items-center xs:gap-6 lg:justify-normal">
            <Title as="h4" className="font-semibold">
              {message?.title}
            </Title>
          </div>

          <div className="jus flex flex-wrap items-center gap-2.5 sm:justify-end">
            <ActionDropdown className="ml-auto sm:ml-[unset]" />
          </div>
        </header>

        <div className="[&_.simplebar-content]:grid [&_.simplebar-content]:gap-8 [&_.simplebar-content]:py-5 pt-3">
          <SimpleBar className="@3xl:max-h-[calc(100dvh-20rem)] @4xl:max-h-[calc(100dvh-16rem)] @7xl:max-h-[calc(100dvh-14rem)]">
            <MessageBody />
            <MessageBody />
            <MessageBody />
            <MessageBody />
          </SimpleBar>
        </div>
      </div>
    </div>
  );
}

export function DotSeparator({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4"
      height="4"
      viewBox="0 0 4 4"
      fill="none"
      {...props}
    >
      <circle cx="2" cy="2" r="2" fill="#D9D9D9" />
    </svg>
  );
}

type AvatarOptionTypes = {
  avatar: string;
  label: string;
  [key: string]: any;
};

function renderAvatarOptionDisplayValue(option: AvatarOptionTypes) {
  return (
    <div className="flex items-center gap-2">
      <Avatar
        src={option.avatar}
        name={option.label}
        className="!h-6 !w-6 rounded-full"
      />
      <span className="whitespace-nowrap text-xs sm:text-sm">
        {option.label}
      </span>
    </div>
  );
}

function renderPriorityOptionDisplayValue(value: string) {
  switch (value) {
    case "Medium":
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-orange-dark">
            {value}
          </Text>
        </div>
      );
    case "Low":
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {value}
          </Text>
        </div>
      );
    case "High":
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-red-dark">
            {value}
          </Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium capitalize text-gray-600">
            {value}
          </Text>
        </div>
      );
  }
}
