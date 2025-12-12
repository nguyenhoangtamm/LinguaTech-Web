"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BookOpen,
    ArrowLeft,
    ArrowRight,
    Star,
    Clock,
    Users,
    Play,
    CheckCircle,
    Award,
    MessageCircle,
    Share2,
    Heart,
    Download,
    FileText,
    HelpCircle,
    Menu,
    ChevronDown,
    ChevronUp,
    StickyNote,
    PenTool
} from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { useAssignmentsByLesson } from "@/queries/useAssignment";
import { useLessonQuery, useModulesByCourseQuery, useMaterialsByLessonQuery, useCompleteLessonMutation, useSectionsByLessonQuery } from "@/queries/useLesson";
import { SectionType } from "@/schemaValidations/lesson.schema";

// We'll use API hooks to fetch lesson, modules and materials

// Separate components for each section that can load independently
const ContentSection = ({ section, isLoading }: { section: SectionType, isLoading: boolean }) => {
    const [fontSize, setFontSize] = useState(16);
    const [isBookmarked, setIsBookmarked] = useState(false);

    if (isLoading) {
        return (
            <div className="bg-gray-50 rounded-lg p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-2">{section.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsBookmarked(!isBookmarked)}
                    >
                        <Heart className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current text-red-500' : ''}`} />
                        {isBookmarked ? 'Đã lưu' : 'Lưu'}
                    </Button>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                        >
                            A-
                        </Button>
                        <span className="text-sm px-2">{fontSize}px</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                        >
                            A+
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Card>
                <CardContent className="p-8 overflow-y-auto">
                    <div
                        className="prose prose-sm sm:prose-base max-w-none"
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        {section.content.split('\n').map((line: string, idx: number) => {
                            // Heading 1
                            if (line.startsWith('# ')) {
                                return <h1 key={idx} className="text-3xl font-bold mb-4 mt-6 text-gray-900">{line.replace(/^# /, '')}</h1>;
                            }
                            // Heading 2
                            if (line.startsWith('## ')) {
                                return <h2 key={idx} className="text-2xl font-semibold mb-3 mt-8 text-gray-800">{line.replace(/^## /, '')}</h2>;
                            }
                            // Heading 3
                            if (line.startsWith('### ')) {
                                return <h3 key={idx} className="text-xl font-medium mb-2 mt-6 text-gray-700">{line.replace(/^### /, '')}</h3>;
                            }
                            // Code block - handle triple backticks
                            if (line.startsWith('```')) {
                                const codeBlockMatch = section.content.substring(section.content.indexOf(line));
                                const match = codeBlockMatch.match(/```(\w+)?\n([\s\S]*?)\n```/);
                                if (match) {
                                    return (
                                        <pre key={idx} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                                            <code>{match[2]}</code>
                                        </pre>
                                    );
                                }
                            }
                            // List items
                            if (line.startsWith('- ')) {
                                return <li key={idx} className="ml-6 mb-2 text-gray-700">{line.replace(/^- /, '')}</li>;
                            }
                            if (line.match(/^\d+\./)) {
                                return <li key={idx} style={{ listStyleType: 'decimal' }} className="ml-6 mb-2 text-gray-700">{line.replace(/^\d+\.\s*/, '')}</li>;
                            }
                            // Empty line
                            if (line.trim() === '') {
                                return <div key={idx} className="mb-2"></div>;
                            }
                            // Regular paragraph
                            return <p key={idx} className="text-gray-700 mb-4 leading-relaxed">{line}</p>;
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Assignment section component  
const AssignmentsSection = ({ lessonId, courseId }: { lessonId: number, courseId: number }) => {
    const { data: assignmentsResponse, isLoading, error } = useAssignmentsByLesson(lessonId);

    if (isLoading) {
        return (
            <div className="p-4">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="border rounded-lg p-4">
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="text-center py-8 text-red-500">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Không thể tải danh sách bài tập</p>
                    <p className="text-sm mt-1">Vui lòng thử lại sau</p>
                </div>
            </div>
        );
    }

    // Extract assignments data from response
    const lessonAssignments = Array.isArray(assignmentsResponse) ?
        assignmentsResponse :
        (assignmentsResponse?.data || []);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-medium">Bài tập</h3>
                <Badge variant="secondary">{lessonAssignments.length} bài</Badge>
            </div>

            {lessonAssignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Chưa có bài tập nào</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {lessonAssignments.map((assignment: any) => {
                        const totalQuestions = assignment.questions?.length || 0;
                        const essayQuestions = assignment.questions?.filter((q: any) => q.questionTypeId === "essay").length || 0;
                        const multipleChoiceQuestions = assignment.questions?.filter((q: any) => q.questionTypeId === "multiple_choice").length || 0;
                        const isCompleted = assignment.completionDate !== null;
                        const isOverdue = new Date() > new Date(assignment.dueDate) && !isCompleted;

                        return (
                            <div key={assignment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm mb-1">{assignment.title}</h4>
                                        <p className="text-xs text-gray-600 mb-2">{assignment.description}</p>

                                        {/* Assignment Stats */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <HelpCircle className="w-3 h-3" />
                                                {totalQuestions} câu hỏi
                                            </span>
                                            {essayQuestions > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <FileText className="w-3 h-3" />
                                                    {essayQuestions} tự luận
                                                </span>
                                            )}
                                            {multipleChoiceQuestions > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    {multipleChoiceQuestions} trắc nghiệm
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="ml-2">
                                        {isCompleted ? (
                                            <Badge variant="default" className="bg-green-100 text-green-700">
                                                Hoàn thành
                                            </Badge>
                                        ) : isOverdue ? (
                                            <Badge variant="destructive">
                                                Quá hạn
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">
                                                Chưa làm
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Due Date */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        <span>Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}</span>
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        size="sm"
                                        variant={isCompleted ? "outline" : "default"}
                                        asChild
                                    >
                                        <Link href={`/courses/detail/${courseId}/lessons/${lessonId}/assignments/${assignment.id}`}>
                                            {isCompleted ? "Xem lại" : "Làm bài"}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const MaterialsSection = ({ materials, isLoading }: { materials: any[], isLoading: boolean }) => {
    if (isLoading) {
        return (
            <div className="p-4">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-medium">Tài liệu bài học</h3>
            <div className="space-y-3">
                {materials.map(material => (
                    <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-blue-500" />
                            <div>
                                <p className="font-medium">{material.fileName}</p>
                                <p className="text-sm text-gray-600">
                                    {material.fileType.toUpperCase()} • {Math.round(material.size / 1024)} KB
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Tải xuống
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReadingNotesSection = ({ lesson, isLoading }: { lesson: any, isLoading: boolean }) => {
    if (isLoading) {
        return (
            <div className="p-4">
                <div className="animate-pulse space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-medium">Tóm tắt bài học</h3>
            <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium text-blue-800 mb-2">Những điểm chính</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Higher-Order Components (HOC) là pattern tái sử dụng logic</li>
                    <li>• Render Props giúp chia sẻ state logic giữa components</li>
                    <li>• Compound Components tạo API linh hoạt</li>
                    <li>• Mỗi pattern có ưu nhược điểm riêng</li>
                </ul>
            </div>

            <div className="border rounded-lg p-4 bg-green-50">
                <h4 className="font-medium text-green-800 mb-2">Bước tiếp theo</h4>
                <p className="text-sm text-green-700">
                    Trong bài học tiếp theo, chúng ta sẽ thực hành xây dựng một ứng dụng sử dụng các patterns này.
                </p>
            </div>
        </div>
    );
};

const VideoSection = ({ videoUrl, isLoading }: { videoUrl?: string, isLoading: boolean }) => {
    if (isLoading) {
        return (
            <div className="p-4">
                <div className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-64 w-full"></div>
                </div>
            </div>
        );
    }

    if (!videoUrl) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Chưa có video cho bài học này</p>
            </div>
        );
    }

    // Detect video type from URL
    const getVideoType = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return 'youtube';
        }
        if (url.includes('mp4')) {
            return 'video/mp4';
        }
        if (url.includes('webm')) {
            return 'video/webm';
        }
        if (url.includes('ogg')) {
            return 'video/ogg';
        }
        return 'video/mp4'; // default
    };

    const videoType = getVideoType(videoUrl);
    const isYouTube = videoType === 'youtube';

    // Extract YouTube video ID
    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    const youtubeId = isYouTube ? getYouTubeId(videoUrl) : null;

    return (
        <div className="space-y-4">
            <h3 className="font-medium">Video bài học</h3>
            <div className="relative w-full bg-black rounded-lg overflow-hidden">
                <div className="aspect-video flex items-center justify-center bg-gray-900">
                    {isYouTube && youtubeId ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title="Lesson Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    ) : (
                        <video
                            width="100%"
                            height="100%"
                            controls
                            className="w-full h-full object-contain"
                            crossOrigin="anonymous"
                        >
                            <source src={videoUrl} type={videoType} />
                            <p>Trình duyệt của bạn không hỗ trợ video HTML5.</p>
                        </video>
                    )}
                </div>
            </div>
        </div>
    );
}; export default function LessonDetailPage() {
    const params = useParams();
    const courseIdParam = params.courseId;
    const lessonIdParam = params.lessonId;
    const courseId = courseIdParam ? Number(courseIdParam) : undefined;
    const lessonId = lessonIdParam ? Number(lessonIdParam) : undefined;
    const { data: lesson, isLoading: lessonLoading } = useLessonQuery(lessonId);
    const { data: modules, isLoading: modulesLoading } = useModulesByCourseQuery(courseId);
    const { data: materialsFromApi, isLoading: materialsLoading } = useMaterialsByLessonQuery(lessonId);
    const { data: sectionsApi, isLoading: sectionsLoading } = useSectionsByLessonQuery(lessonId);
    const completeLessonMutation = useCompleteLessonMutation();
    const sections = useMemo(() => sectionsApi?.data || [], [sectionsApi?.data]);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [rightPanelOpen, setRightPanelOpen] = useState(true);
    const [selectedSectionId, setSelectedSectionId] = useState<number>(1);

    // derive loading states from hooks
    const loadingStates = {
        content: lessonLoading || modulesLoading || sectionsLoading,
        materials: materialsLoading,
    };

    useEffect(() => {
        // When sections data loads, pick the first section as selected by default
        if (sections && sections.length > 0) {
            setSelectedSectionId(sections[0].id);
        }
    }, [sections]);

    if (!lesson) {
        return (
            <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang tải bài học...</h2>
            </div>
        );
    }

    const lessonData: any = (lesson as any)?.data ?? (lesson as any);
    const lessons = modules?.data?.flatMap((m: any) => (m.lessons || [])) || [];
    const currentLessonIndex = lessons.findIndex((l: any) => String(l.id) === String(lessonId));
    const previousLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
    const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;

    // Debug: Log lesson data
    if (lessonData) {
        console.log('Lesson Data:', lessonData);
        console.log('Video URL:', lessonData?.videoUrl);
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar - Lesson Sections */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r`}>
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Nội dung bài học</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                    {sections?.map((section: SectionType) => (
                        <button
                            key={section.id}
                            onClick={() => setSelectedSectionId(section.id)}
                            className={`w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors ${selectedSectionId === section.id ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                        >
                            <div className="font-medium text-sm">{section.title}</div>
                            <div className="text-xs text-gray-500 mt-1">Phần {section.order}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {!sidebarOpen && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <Menu className="w-4 h-4" />
                                </Button>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Link href={routes.user.courses} className="hover:text-gray-900">
                                    Khóa học
                                </Link>
                                <span>/</span>
                                <Link href={`/courses/detail/${courseId}`} className="hover:text-gray-900">
                                    React Advanced
                                </Link>
                                <span>/</span>
                                <Link href={`/courses/detail/${courseId}/learn`} className="hover:text-gray-900">
                                    Chi tiết
                                </Link>
                                <span>/</span>
                                <span className="text-gray-900">{lessonData?.title}</span>
                            </div>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={`/courses/detail/${courseId}/learn`}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại khóa học
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 grid gap-6 p-6 overflow-hidden" style={{
                    gridTemplateColumns: rightPanelOpen ? '1fr 1fr' : '1fr',
                    transition: 'grid-template-columns 0.3s ease-in-out'
                }}>
                    {/* Left Column - Content */}
                    <div className="space-y-6 overflow-y-auto">
                        {sections && (
                            <ContentSection
                                section={sections.find((s: SectionType) => s.id === selectedSectionId) || sections[0]}
                                isLoading={loadingStates.content}
                            />
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between">
                            {previousLesson ? (
                                <Button variant="outline" asChild>
                                    <Link href={`/courses/detail/${courseId}/lessons/${previousLesson.id}`}>
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Bài trước
                                    </Link>
                                </Button>
                            ) : (
                                <div></div>
                            )}

                            {/* <Button
                                onClick={() => {
                                    if (!lessonId) return;
                                    completeLessonMutation.mutate(lessonId);
                                }}
                            >
                                Hoàn thành bài học
                                <CheckCircle className="w-4 h-4 ml-2" />
                            </Button> */}

                            {nextLesson ? (
                                <Button asChild>
                                    <Link href={`/courses/detail/${courseId}/lessons/${nextLesson.id}`}>
                                        Bài tiếp theo
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Tabs with Toggle */}
                    {rightPanelOpen && (
                        <div className="space-y-6 overflow-y-auto border-l">
                            <div className="flex items-center justify-between pl-6 pt-6">
                                <h3 className="font-medium">Bảng điều khiển</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setRightPanelOpen(false)}
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="px-6">
                                <Tabs defaultValue="video" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="video">Video</TabsTrigger>
                                        <TabsTrigger value="assignments">Bài tập</TabsTrigger>
                                        <TabsTrigger value="materials">Tài liệu</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="assignments" className="mt-4">
                                        <Card>
                                            <CardContent className="p-4">
                                                <AssignmentsSection
                                                    lessonId={lessonId ?? 0}
                                                    courseId={courseId ?? 0}
                                                />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="video" className="mt-4">
                                        <Card>
                                            <CardContent className="p-4">
                                                <VideoSection
                                                    videoUrl={lessonData?.videoUrl || lesson?.videoUrl}
                                                    isLoading={loadingStates.content}
                                                />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="materials" className="mt-4">
                                        <Card>
                                            <CardContent className="p-4">
                                                <MaterialsSection
                                                    materials={materialsFromApi?.data || lessonData?.materials || []}
                                                    isLoading={loadingStates.materials}
                                                />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    )}

                    {/* Right Panel Toggle Button when hidden */}
                    {!rightPanelOpen && (
                        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => setRightPanelOpen(true)}
                                className="shadow-lg"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
