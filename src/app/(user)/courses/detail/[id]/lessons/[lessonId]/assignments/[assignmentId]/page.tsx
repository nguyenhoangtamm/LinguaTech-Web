"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Clock,
    CheckCircle,
    AlertCircle,
    HelpCircle,
    Save,
    Send,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { routes } from "@/config/routes";
import { mockAssignments, mockUserSubmissions } from "@/data/assignments";

export default function AssignmentPage() {
    const params = useParams();
    const courseId = params.id as string;
    const lessonId = params.lessonId as string;
    const assignmentId = params.assignmentId as string;

    const [assignment, setAssignment] = useState<any>(null);
    const [submission, setSubmission] = useState<any>(null);
    const [answers, setAnswers] = useState<any>({});
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    useEffect(() => {
        // Mock API call
        const foundAssignment = mockAssignments.find(a => a.id === assignmentId);
        setAssignment(foundAssignment);

        const userSubmission = (mockUserSubmissions as any)[assignmentId];
        if (userSubmission) {
            setSubmission(userSubmission);
            setIsSubmitted(userSubmission.status === "submitted");

            // Initialize answers with existing submission
            const initialAnswers: any = {};
            userSubmission.answers.forEach((ans: any) => {
                initialAnswers[ans.questionId] = ans.answer || (ans.isCorrect ? ans.score : null);
            });
            setAnswers(initialAnswers);
        }
    }, [assignmentId]);

    if (!assignment) {
        return (
            <div className="text-center py-12">
                <div className="animate-pulse">Đang tải bài tập...</div>
            </div>
        );
    }

    const totalScore = assignment.questions.reduce((sum: number, q: any) => sum + q.score, 0);
    const userScore = submission?.score || 0;
    const essayQuestions = assignment.questions.filter((q: any) => q.questionTypeId === "essay");
    const multipleChoiceQuestions = assignment.questions.filter((q: any) => q.questionTypeId === "multiple_choice");

    const toggleQuestion = (questionId: string) => {
        setExpandedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers((prev: any) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleSaveAnswer = (questionId: string) => {
        // Mock save - in real app would call API
        console.log(`Answer saved for question ${questionId}`);
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setShowConfirmSubmit(false);
        // Mock submission - in real app would call API
        console.log("Assignment submitted", answers);
    };

    const daysRemaining = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
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
                            <Link href={`/courses/detail/${courseId}/lessons/${lessonId}`} className="hover:text-gray-900">
                                Bài học
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">{assignment.title}</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/courses/detail/${courseId}/lessons/${lessonId}`}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Assignment Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Assignment Header */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl mb-2">{assignment.title}</CardTitle>
                                        <CardDescription className="text-base">{assignment.description}</CardDescription>
                                    </div>
                                    <Badge variant={isOverdue ? "destructive" : "default"}>
                                        {isOverdue ? "Quá hạn" : "Chưa nộp"}
                                    </Badge>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Questions */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Câu hỏi</h3>
                            {assignment.questions.map((question: any, index: number) => {
                                const isExpanded = expandedQuestions.has(question.id);
                                const userAnswer = answers[question.id];
                                const isEssay = question.questionTypeId === "essay";

                                return (
                                    <Card key={question.id} className={`${isSubmitted ? "bg-gray-50" : ""}`}>
                                        <CardHeader className="cursor-pointer" onClick={() => toggleQuestion(question.id)}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-semibold text-lg">Câu {index + 1}</span>
                                                        <Badge variant="outline">{question.score} điểm</Badge>
                                                        {isEssay && <Badge variant="secondary">Tự luận</Badge>}
                                                        {!isEssay && <Badge variant="secondary">Trắc nghiệm</Badge>}
                                                    </div>
                                                    <p className="mt-2 text-gray-700 font-medium">{question.content}</p>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </CardHeader>

                                        {isExpanded && (
                                            <CardContent className="space-y-4 border-t pt-4">
                                                {/* Instructions for essay */}
                                                {isEssay && question.instructions && (
                                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                        <h4 className="font-medium text-blue-900 mb-2">Hướng dẫn:</h4>
                                                        <ul className="text-sm text-blue-800 space-y-1">
                                                            {question.instructions.split("\n").filter((line: string) => line.trim()).map((line: string, i: number) => (
                                                                <li key={i}>{line}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Essay Answer */}
                                                {isEssay && !isSubmitted && (
                                                    <div className="space-y-3">
                                                        <label className="block text-sm font-medium">Câu trả lời của bạn:</label>
                                                        <textarea
                                                            value={userAnswer || ""}
                                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                            placeholder="Nhập câu trả lời của bạn tại đây..."
                                                            className="w-full p-3 border rounded-lg resize-vertical min-h-32 font-mono text-sm"
                                                        />
                                                        <div className="flex justify-end">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleSaveAnswer(question.id)}
                                                            >
                                                                <Save className="w-4 h-4 mr-2" />
                                                                Lưu tạm
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Essay Answer Display - Submitted */}
                                                {isEssay && isSubmitted && submission?.answers?.find((a: any) => a.questionId === question.id) && (
                                                    <div className="space-y-3">
                                                        <div className="bg-gray-100 p-4 rounded-lg">
                                                            <p className="text-sm font-medium text-gray-600 mb-2">Câu trả lời của bạn:</p>
                                                            <p className="text-gray-800 whitespace-pre-wrap font-mono text-sm">
                                                                {submission.answers.find((a: any) => a.questionId === question.id)?.answer}
                                                            </p>
                                                        </div>
                                                        {submission.answers.find((a: any) => a.questionId === question.id)?.feedback && (
                                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                                <p className="text-sm font-medium text-green-900 mb-2">Nhận xét từ giáo viên:</p>
                                                                <p className="text-green-800">
                                                                    {submission.answers.find((a: any) => a.questionId === question.id)?.feedback}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Multiple Choice */}
                                                {!isEssay && (
                                                    <div className="space-y-3">
                                                        {question.options.map((option: any, optIndex: number) => {
                                                            const isSelected = userAnswer === option.id;
                                                            const isCorrect = option.isCorrect;
                                                            const showResult = isSubmitted && submission?.answers?.find((a: any) => a.questionId === question.id);

                                                            return (
                                                                <div
                                                                    key={option.id}
                                                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${isSelected
                                                                            ? "border-blue-500 bg-blue-50"
                                                                            : "border-gray-200 hover:border-gray-300"
                                                                        } ${showResult && isCorrect
                                                                            ? "border-green-500 bg-green-50"
                                                                            : showResult && isSelected && !isCorrect
                                                                                ? "border-red-500 bg-red-50"
                                                                                : ""
                                                                        } ${isSubmitted ? "cursor-not-allowed opacity-75" : ""}`}
                                                                    onClick={() => !isSubmitted && handleAnswerChange(question.id, option.id)}
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <div
                                                                            className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                                                                                }`}
                                                                        />
                                                                        <span className={`text-sm flex-1 ${isSelected ? "font-medium" : ""}`}>
                                                                            {option.content}
                                                                        </span>
                                                                        {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                                                                        {showResult && isSelected && !isCorrect && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </CardContent>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Submit Button */}
                        {!isSubmitted && (
                            <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium mb-1">Sẵn sàng nộp bài tập?</h3>
                                            <p className="text-sm text-gray-600">Đảm bảo bạn đã hoàn thành tất cả các câu hỏi.</p>
                                        </div>
                                        <Button size="lg" onClick={() => setShowConfirmSubmit(true)}>
                                            <Send className="w-4 h-4 mr-2" />
                                            Nộp bài
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Summary */}
                    <div className="space-y-6">
                        {/* Score Summary */}
                        {isSubmitted && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Kết quả</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-blue-600 mb-2">
                                            {userScore}/{totalScore}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Đạt {((userScore / totalScore) * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                    <Progress value={(userScore / totalScore) * 100} className="h-3" />
                                    <div className="pt-2 border-t">
                                        <p className="text-sm text-gray-600 mb-2">Nộp lúc: {submission?.submittedAt?.toLocaleString("vi-VN")}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Due Date */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Thông tin bài tập</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Loại bài tập</p>
                                    <div className="flex gap-2">
                                        {essayQuestions.length > 0 && <Badge>Tự luận ({essayQuestions.length})</Badge>}
                                        {multipleChoiceQuestions.length > 0 && <Badge>Trắc nghiệm ({multipleChoiceQuestions.length})</Badge>}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tổng điểm</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalScore} điểm</p>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        <p className="text-sm font-medium">Hạn nộp</p>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {new Date(assignment.dueDate).toLocaleDateString("vi-VN", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                    <p
                                        className={`text-sm font-medium ${isOverdue ? "text-red-600" : daysRemaining <= 1 ? "text-orange-600" : "text-green-600"
                                            }`}
                                    >
                                        {isOverdue ? `Quá hạn ${Math.abs(daysRemaining)} ngày` : `Còn ${daysRemaining} ngày`}
                                    </p>
                                </div>

                                {!isSubmitted && (
                                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                        <p className="text-xs text-yellow-800">
                                            ⚠️ Bạn chưa nộp bài tập này. Hãy hoàn thành và nộp trước hạn chót.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Instructions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4" />
                                    Hướng dẫn
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-gray-600">
                                <p>• Đọc kỹ từng câu hỏi trước khi trả lời</p>
                                <p>• Sử dụng nút &quot;Lưu tạm&quot; để lưu câu trả lời tự luận</p>
                                <p>• Kiểm tra lại câu trả lời của bạn trước khi nộp</p>
                                <p>• Sau khi nộp, bạn không thể chỉnh sửa câu trả lời</p>
                                <p>• Giáo viên sẽ chấm bài trong vòng 3-5 ngày</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Confirm Submit Dialog */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="max-w-md">
                        <CardHeader>
                            <CardTitle>Xác nhận nộp bài</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-600">
                                Bạn có chắc chắn muốn nộp bài tập này? Sau khi nộp, bạn không thể chỉnh sửa câu trả lời.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button variant="outline" onClick={() => setShowConfirmSubmit(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={handleSubmit}>
                                    Xác nhận nộp
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
