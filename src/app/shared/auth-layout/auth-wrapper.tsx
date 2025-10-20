'use client';

import Image from 'next/image';
import Link from 'next/link';
import cn from '@/utils/class-names';
import { FcGoogle } from 'react-icons/fc';
import OrSeparation from '@/app/shared/auth-layout/or-separation';
import { Button } from "@/components/ui/button";

export default function AuthWrapper({
    children,
    title,
    isSocialLoginActive = false,
    isSignIn = false,
    className = '',
}: {
    children: React.ReactNode;
    title: React.ReactNode;
    isSocialLoginActive?: boolean;
    isSignIn?: boolean;
    className?: string;
}) {
    return (
        <>
            <div className="relative flex min-h-screen w-full flex-col justify-center bg-gradient-to-tr from-[#136A8A] to-[#267871] ">
                <div
                    className={cn(
                        'mx-auto w-full max-w-md rounded-xl bg-white px-4 py-4 sm:px-6 md:max-w-xl md:px-10 md:py-12 lg:max-w-[500px] lg:px-16 xl:rounded-2xl 3xl:rounded-3xl dark:bg-gray-50',
                        className
                    )}
                >
                    <div className="flex flex-col items-center">
                        <Link href={'/'} className=" inline-block max-w-[180px] lg:mb-9">
                            <Image src='/ltlogo.png' width={280} height={280} alt="LinguaTech" className="dark:invert" />
                        </Link>
                        <h2 className="mb-7 text-center text-[26px] leading-snug md:text-2xl md:!leading-normal lg:mb-10 lg:text-xl lg:leading-normal font-semibold">
                            {title}
                        </h2>
                    </div>
                    {isSocialLoginActive && (
                        <>
                            <div className="flex flex-col gap-4 pb-6 md:flex-row md:gap-6 md:pb-7">
                                <Button variant="outline" className="h-11 w-full">
                                    <FcGoogle className="me-2 h-5 w-5 shrink-0" />
                                    <span className="truncate">Đăng nhập bằng Google</span>
                                </Button>
                            </div>
                            <OrSeparation
                                title={`hoặc, đăng nhập bằng tài khoản`}
                                isCenter
                                className="mb-4"
                            />
                        </>
                    )}
                    {children}
                </div>
            </div>
        </>
    );
}
