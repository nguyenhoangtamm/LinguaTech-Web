"use client";

import { useState, useEffect } from "react";
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

// Mock lesson data
const mockLessons = [
    { id: "l1", title: "Giới thiệu về Advanced Patterns", duration: 45, completed: true, moduleId: "mod1" },
    { id: "l2", title: "Custom Hooks và Logic Reuse", duration: 52, completed: true, moduleId: "mod1" },
    { id: "l3", title: "Context API và Provider Pattern", duration: 38, completed: false, moduleId: "mod1" },
    { id: "l4", title: "Performance Optimization với React.memo", duration: 41, completed: false, moduleId: "mod2" },
    { id: "l5", title: "Code Splitting và Lazy Loading", duration: 35, completed: false, moduleId: "mod2" },
    { id: "l6", title: "Testing Advanced Components", duration: 47, completed: false, moduleId: "mod2" },
    { id: "l7", title: "Production Deployment Best Practices", duration: 33, completed: false, moduleId: "mod2" }
];

const mockCurrentLesson = {
    id: "l1",
    title: "Giới thiệu về Advanced Patterns",
    description: "Trong bài học này, chúng ta sẽ tìm hiểu về các pattern nâng cao trong React như Higher-Order Components, Render Props, và Compound Components.",
    duration: 45,
    completed: false,
    moduleId: "mod1",
    content: `
# Giới thiệu về Advanced Patterns trong React

## Tổng quan
Advanced Patterns trong React là những kỹ thuật và mẫu thiết kế giúp chúng ta viết code React hiệu quả hơn, dễ maintain và có thể tái sử dụng.

## Các Pattern chính

### 1. Higher-Order Components (HOC)
Higher-Order Component là một function nhận vào một component và trả về một component mới với các tính năng bổ sung.

\`\`\`jsx
function withLoading(WrappedComponent) {
  return function WithLoadingComponent(props) {
    if (props.isLoading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}
\`\`\`

### 2. Render Props
Render Props là một kỹ thuật chia sẻ code giữa các React components bằng cách sử dụng một prop có giá trị là function.

\`\`\`jsx
function Mouse({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Logic xử lý mouse movement
  
  return render(position);
}
\`\`\`

### 3. Compound Components
Compound Components cho phép tạo ra các components có thể kết hợp với nhau một cách linh hoạt.

## Bài tập thực hành
1. Tạo một HOC để thêm authentication cho components
2. Xây dựng một component sử dụng render props pattern
3. Thiết kế một compound component cho dropdown menu
    `,
    materials: [
        { id: "m1", fileName: "slides-intro.pdf", fileUrl: "/files/slides-intro.pdf", fileType: "pdf", size: 1200 },
        { id: "m2", fileName: "code-samples.zip", fileUrl: "/files/code-samples.zip", fileType: "zip", size: 20480 }
    ],
    exercises: [
        {
            id: "ex1",
            title: "Xây dựng HOC đầu tiên",
            description: "Tạo một Higher-Order Component để thêm loading state cho các component",
            difficulty: "medium"
        }
    ],
    notes: []
};

const mockUserNotes = [
    {
        id: "note1",
        timestamp: 120,
        content: "HOC là một pattern rất hữu ích để tái sử dụng logic",
        createdAt: new Date()
    },
    {
        id: "note2",
        timestamp: 300,
        content: "Cần nhớ về việc forward refs khi sử dụng HOC",
        createdAt: new Date()
    }
];

// Separate components for each section that can load independently
const ContentSection = ({ lesson, isLoading }: { lesson: any, isLoading: boolean }) => {
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
            {/* Content Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
                    <p className="text-gray-600">{lesson.description}</p>
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

            {/* Reading Progress */}
            <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Tiến độ đọc</span>
                    <span className="text-sm text-blue-600">Thời gian đọc ước tính: {lesson.duration} phút</span>
                </div>
                <Progress value={30} className="h-2" />
            </div>

            {/* Main Content */}
            <Card>
                <CardContent className="p-8">
                    <div
                        className="prose prose-lg max-w-none"
                        style={{ fontSize: `${fontSize}px` }}
                        dangerouslySetInnerHTML={{
                            __html: lesson.content
                                .replace(/^# /gm, '<h1 class="text-3xl font-bold mb-4 text-gray-900">')
                                .replace(/^## /gm, '<h2 class="text-2xl font-semibold mb-3 text-gray-800 mt-8">')
                                .replace(/^### /gm, '<h3 class="text-xl font-medium mb-2 text-gray-700 mt-6">')
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                                .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
                                .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>')
                                .replace(/\n\n/g, '</p><p class="mb-4">')
                                .replace(/^\d+\./gm, '</p><li class="mb-2">')
                                .replace(/^- /gm, '</p><li class="mb-1 ml-4">')
                        }}
                    />
                </CardContent>
            </Card>

            {/* Interactive Elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">💡 Điểm quan trọng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-700">
                            Higher-Order Components là một pattern mạnh mẽ để tái sử dụng logic component.
                            Hãy nhớ luôn forward refs khi cần thiết.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">🎯 Bài tập</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-700 mb-3">
                            Hãy thử tạo một HOC để thêm loading state cho bất kỳ component nào.
                        </p>
                        <Button size="sm" variant="outline">
                            Xem đáp án
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}; const NotesSection = ({ notes, isLoading }: { notes: any[], isLoading: boolean }) => {
    const [newNote, setNewNote] = useState("");
    const [currentTimestamp, setCurrentTimestamp] = useState(120);

    if (isLoading) {
        return (
            <div className="p-4">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-medium">Ghi chú của tôi</h3>
                <Button size="sm">
                    <PenTool className="w-4 h-4 mr-2" />
                    Thêm ghi chú
                </Button>
            </div>

            {/* Add Note Form */}
            <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Thời điểm: {Math.floor(currentTimestamp / 60)}:{(currentTimestamp % 60).toString().padStart(2, '0')}</span>
                </div>
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Nhập ghi chú tại thời điểm này..."
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={3}
                />
                <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm">Hủy</Button>
                    <Button size="sm">Lưu ghi chú</Button>
                </div>
            </div>

            {/* Existing Notes */}
            <div className="space-y-3">
                {notes.map(note => (
                    <div key={note.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <StickyNote className="w-4 h-4" />
                                <span>{Math.floor(note.timestamp / 60)}:{(note.timestamp % 60).toString().padStart(2, '0')}</span>
                            </div>
                            <Button variant="ghost" size="sm">Xóa</Button>
                        </div>
                        <p className="text-gray-700">{note.content}</p>
                    </div>
                ))}
            </div>
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

export default function LessonDetailPage() {
    const params = useParams();
    const courseId = params.id as string;
    const lessonId = params.lessonId as string;

    const [lesson, setLesson] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loadingStates, setLoadingStates] = useState({
        content: true,
        notes: true,
        materials: true,
        summary: true
    });

    useEffect(() => {
        // Mock API calls with different loading times for each section
        setLesson(mockCurrentLesson);

        // Simulate loading for each section
        setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, content: false }));
        }, 1000);

        setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, materials: false }));
        }, 1500);

        setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, notes: false }));
        }, 2000);

        setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, summary: false }));
        }, 2500);
    }, [courseId, lessonId]);

    if (!lesson) {
        return (
            <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang tải bài học...</h2>
            </div>
        );
    }

    const currentLessonIndex = mockLessons.findIndex(l => l.id === lessonId);
    const previousLesson = currentLessonIndex > 0 ? mockLessons[currentLessonIndex - 1] : null;
    const nextLesson = currentLessonIndex < mockLessons.length - 1 ? mockLessons[currentLessonIndex + 1] : null;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar - Lesson List */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r`}>
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Danh sách bài học</h3>
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
                    {mockLessons.map((l, index) => (
                        <Link
                            key={l.id}
                            href={`/courses/detail/${courseId}/lessons/${l.id}`}
                            className={`block p-3 rounded-lg border hover:bg-gray-50 ${l.id === lessonId ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{l.title}</p>
                                    <p className="text-xs text-gray-600">{l.duration} phút</p>
                                </div>
                                {l.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </div>
                        </Link>
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
                                <span className="text-gray-900">{lesson.title}</span>
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
                <div className="flex-1 grid grid-cols-3 gap-6 p-6 overflow-hidden">
                    {/* Left Column - Content */}
                    <div className="col-span-2 space-y-6">
                        <ContentSection lesson={lesson} isLoading={loadingStates.content} />

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

                            <Button>
                                Hoàn thành bài học
                                <CheckCircle className="w-4 h-4 ml-2" />
                            </Button>

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

                    {/* Right Column - Tabs */}
                    <div className="space-y-6">
                        <Tabs defaultValue="notes" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="notes">Ghi chú</TabsTrigger>
                                <TabsTrigger value="materials">Tài liệu</TabsTrigger>
                                <TabsTrigger value="summary">Tóm tắt</TabsTrigger>
                            </TabsList>

                            <TabsContent value="notes" className="mt-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <NotesSection notes={mockUserNotes} isLoading={loadingStates.notes} />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="materials" className="mt-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <MaterialsSection materials={lesson.materials} isLoading={loadingStates.materials} />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="summary" className="mt-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <ReadingNotesSection lesson={lesson} isLoading={loadingStates.summary} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}