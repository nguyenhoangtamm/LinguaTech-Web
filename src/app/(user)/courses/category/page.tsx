import React from "react";
import { Suspense } from "react";
import CategoryClient from "./CategoryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    ArrowLeft,
    Star,
    Clock,
    Users,
    Filter,
    Grid,
    List
} from "lucide-react";
import { Course, CourseCategory } from "@/types/course";
import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/utils/class-names";
import { useCategoriesQuery, useCoursesQuery } from "@/queries/useCourse";
import { CourseFilterParamsType } from "@/schemaValidations/course.schema";

type ViewMode = "grid" | "list";

export default function CoursesByCategoryPage() {
    return (
        <Suspense fallback={<div />}>
            {/* Render client component that uses client hooks inside a Suspense boundary */}
            <CategoryClient />
        </Suspense>
    );
}