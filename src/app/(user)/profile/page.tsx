import React from "react";
import { Suspense } from "react";
import ProfileClient from "./ProfileClient";

export default function ProfilePage() {
    return (
        <Suspense fallback={<div />}>
            {/* Render client component that uses page header context inside a Suspense boundary */}
            <ProfileClient />
        </Suspense>
    );
}

