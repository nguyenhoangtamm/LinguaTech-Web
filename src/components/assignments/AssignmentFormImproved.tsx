import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Edit2, Copy, CheckCircle2, AlertCircle } from "lucide-react";

interface Assignment {
    id?: string;
    title: string;
    description: string;
    dueDate: Date | null;
    totalScore?: number;
    questions?: Question[];
    createdAt?: string;
    updatedAt?: string;
}

interface Question {
    id: string;
    content: string;
    score: number;
    isDeleted?: boolean;
    questionTypeId: string;
    instructions?: string;
    options?: QuestionOption[];
    createdAt?: string;
    updatedAt?: string;
    assignmentId?: string;
}

interface QuestionOption {
    id: string;
    content: string;
    isCorrect: boolean;
    questionId?: string;
}

interface QuestionFormData extends Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'assignmentId' | 'options'> {
    tempId: string;
    options?: (Omit<QuestionOption, 'id' | 'questionId'> & { tempId: string })[];
}

interface AssignmentFormProps {
    assignment?: Assignment;
    onSave: (assignment: Partial<Assignment>) => void;
    onCancel: () => void;
    loading?: boolean;
}

interface AssignmentFormData {
    title: string;
    description: string;
    dueDate: Date | null;
    questions: QuestionFormData[];
}

const questionTypes = [
    { label: 'Tự luận', value: 'essay', icon: '✍️' },
    { label: 'Trắc nghiệm', value: 'multiple_choice', icon: '☑️' },
    { label: 'Đúng/Sai', value: 'true_false', icon: '✓' },
    { label: 'Điền từ', value: 'fill_blank', icon: '___' },
];

const AssignmentForm: React.FC<AssignmentFormProps> = ({
    assignment,
    onSave,
    onCancel,
    loading = false,
}) => {
    const [formData, setFormData] = useState<AssignmentFormData>({
        title: assignment?.title || '',
        description: assignment?.description || '',
        dueDate: assignment?.dueDate ? new Date(assignment.dueDate) : null,
        questions: assignment?.questions?.map(q => ({
            ...q,
            tempId: q.id,
            options: q.options?.map(opt => ({ ...opt, tempId: opt.id })),
        })) || [],
    });

    const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<QuestionFormData | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; questionId?: string }>({
        show: false,
    });

    const addQuestion = () => {
        setCurrentQuestion({
            tempId: `temp_${Date.now()}`,
            content: '',
            score: 10,
            isDeleted: false,
            questionTypeId: 'multiple_choice',
            instructions: '',
            options: [
                { tempId: `opt_${Date.now()}_1`, content: '', isCorrect: false },
                { tempId: `opt_${Date.now()}_2`, content: '', isCorrect: false },
                { tempId: `opt_${Date.now()}_3`, content: '', isCorrect: false },
                { tempId: `opt_${Date.now()}_4`, content: '', isCorrect: false },
            ],
        });
        setEditingQuestion(null);
        setShowQuestionModal(true);
    };

    const editQuestion = (question: QuestionFormData) => {
        setCurrentQuestion({ ...question });
        setEditingQuestion(question.tempId);
        setShowQuestionModal(true);
    };

    const saveQuestion = () => {
        if (!currentQuestion) return;

        // Validate question
        if (!currentQuestion.content.trim()) {
            alert('Vui lòng nhập nội dung câu hỏi');
            return;
        }

        if (currentQuestion.questionTypeId !== 'essay' && currentQuestion.questionTypeId !== 'fill_blank') {
            const hasCorrectOption = currentQuestion.options?.some(opt => opt.isCorrect);
            if (!hasCorrectOption) {
                alert('Vui lòng chọn ít nhất một đáp án đúng');
                return;
            }
        }

        if (editingQuestion) {
            setFormData(prev => ({
                ...prev,
                questions: prev.questions.map(q =>
                    q.tempId === editingQuestion ? currentQuestion : q
                ),
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                questions: [...prev.questions, currentQuestion],
            }));
        }

        setShowQuestionModal(false);
        setCurrentQuestion(null);
        setEditingQuestion(null);
    };

    const deleteQuestion = (tempId: string) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q.tempId !== tempId),
        }));
        setDeleteConfirm({ show: false });
    };

    const updateQuestionOption = (optionIndex: number, field: string, value: any) => {
        if (!currentQuestion) return;

        setCurrentQuestion(prev => {
            if (!prev || !prev.options) return prev;

            const newOptions = [...prev.options];
            newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };

            if (field === 'isCorrect' && value && prev.questionTypeId === 'multiple_choice') {
                newOptions.forEach((opt, idx) => {
                    if (idx !== optionIndex) {
                        opt.isCorrect = false;
                    }
                });
            }

            return { ...prev, options: newOptions };
        });
    };

    const addOption = () => {
        if (!currentQuestion) return;

        setCurrentQuestion(prev => {
            if (!prev) return prev;

            const newOption = {
                tempId: `opt_${Date.now()}`,
                content: '',
                isCorrect: false,
            };

            return {
                ...prev,
                options: [...(prev.options || []), newOption],
            };
        });
    };

    const removeOption = (optionIndex: number) => {
        if (!currentQuestion) return;

        setCurrentQuestion(prev => {
            if (!prev || !prev.options) return prev;

            return {
                ...prev,
                options: prev.options.filter((_, idx) => idx !== optionIndex),
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Vui lòng nhập tiêu đề bài tập');
            return;
        }

        if (formData.questions.length === 0) {
            alert('Vui lòng thêm ít nhất một câu hỏi');
            return;
        }

        const totalScore = formData.questions.reduce((sum, q) => sum + q.score, 0);

        const assignmentData: Partial<Assignment> = {
            ...assignment,
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate,
            totalScore,
            questions: formData.questions.map(q => ({
                ...q,
                id: q.tempId.startsWith('temp_') ? '' : q.tempId,
                assignmentId: assignment?.id || '',
                options: q.options?.map(opt => ({
                    ...opt,
                    id: opt.tempId.startsWith('opt_') ? '' : opt.tempId,
                    questionId: q.tempId.startsWith('temp_') ? '' : q.tempId,
                })),
            })),
        };

        onSave(assignmentData);
    };

    const totalScore = formData.questions.reduce((sum, q) => sum + q.score, 0);
    const currentQuestionType = questionTypes.find(t => t.value === currentQuestion?.questionTypeId);

    return (
        <div className="w-full space-y-6">
            {/* Form Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {editingQuestion && currentQuestion ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                    Điền thông tin chi tiết về bài tập và các câu hỏi
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
                        <CardDescription>Cung cấp thông tin chung về bài tập</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="assignment-title" className="font-medium">
                                Tiêu đề bài tập <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="assignment-title"
                                placeholder="Nhập tiêu đề bài tập..."
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                maxLength={200}
                                className="h-10"
                            />
                            <div className="text-xs text-gray-500">
                                {formData.title.length}/200 ký tự
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="assignment-description" className="font-medium">
                                Mô tả bài tập
                            </Label>
                            <Textarea
                                id="assignment-description"
                                placeholder="Nhập mô tả chi tiết về bài tập..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                maxLength={1000}
                                className="resize-none"
                            />
                            <div className="text-xs text-gray-500">
                                {formData.description.length}/1000 ký tự
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="assignment-duedate" className="font-medium">
                                    Hạn nộp
                                </Label>
                                <Input
                                    id="assignment-duedate"
                                    type="datetime-local"
                                    value={formData.dueDate ? formData.dueDate.toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        dueDate: e.target.value ? new Date(e.target.value) : null
                                    }))}
                                    className="h-10"
                                />
                            </div>

                            {/* Total Score Display */}
                            <div className="space-y-2">
                                <Label className="font-medium">
                                    Tổng điểm
                                </Label>
                                <div className="h-10 border border-gray-300 rounded-md flex items-center px-3 bg-gray-50">
                                    <span className="text-lg font-semibold text-gray-900">
                                        {totalScore} điểm
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Questions Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-lg">Câu hỏi ({formData.questions.length})</CardTitle>
                            <CardDescription>Thêm và quản lý các câu hỏi cho bài tập</CardDescription>
                        </div>
                        <Button type="button" onClick={addQuestion} size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Thêm câu hỏi
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {formData.questions.length === 0 ? (
                            <div className="text-center py-8">
                                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600">Chưa có câu hỏi nào</p>
                                <p className="text-sm text-gray-500">Hãy thêm câu hỏi đầu tiên cho bài tập này</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.questions.map((question, index) => (
                                    <div key={question.tempId} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        Câu {index + 1}
                                                    </Badge>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {questionTypes.find(t => t.value === question.questionTypeId)?.label}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs ml-auto text-green-600 border-green-200"
                                                    >
                                                        {question.score} điểm
                                                    </Badge>
                                                </div>
                                                <p className="font-medium text-gray-900 line-clamp-2">
                                                    {question.content || '(Chưa có nội dung)'}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => editQuestion(question)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeleteConfirm({ show: true, questionId: question.tempId })}
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                        Hủy
                    </Button>
                    <Button type="submit" disabled={loading} className="gap-2">
                        {loading && <span className="animate-spin">⏳</span>}
                        {loading ? 'Đang lưu...' : 'Lưu bài tập'}
                    </Button>
                </div>
            </form>

            {/* Question Modal */}
            {showQuestionModal && currentQuestion && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{editingQuestion ? 'Chỉnh sửa' : 'Thêm'} câu hỏi</CardTitle>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowQuestionModal(false)}
                                    className="h-8 w-8 p-0"
                                >
                                    ✕
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Question Type */}
                            <div className="space-y-2">
                                <Label htmlFor="question-type" className="font-medium">
                                    Loại câu hỏi <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={currentQuestion.questionTypeId}
                                    onValueChange={(value) => setCurrentQuestion(prev => prev ? { ...prev, questionTypeId: value, options: value !== 'essay' && value !== 'fill_blank' ? prev.options : [] } : null)}
                                >
                                    <SelectTrigger id="question-type" className="h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {questionTypes.map(type => (
                                            <SelectItem key={type.value} value={type.value}>
                                                <span className="mr-2">{type.icon}</span>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <Label htmlFor="question-content" className="font-medium">
                                    Nội dung câu hỏi <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="question-content"
                                    placeholder="Nhập nội dung câu hỏi..."
                                    value={currentQuestion.content}
                                    onChange={(e) => setCurrentQuestion(prev => prev ? { ...prev, content: e.target.value } : null)}
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>

                            {/* Instructions */}
                            <div className="space-y-2">
                                <Label htmlFor="question-instructions" className="font-medium">
                                    Hướng dẫn
                                </Label>
                                <Textarea
                                    id="question-instructions"
                                    placeholder="Nhập hướng dẫn chi tiết cho câu hỏi này (tùy chọn)..."
                                    value={currentQuestion.instructions || ''}
                                    onChange={(e) => setCurrentQuestion(prev => prev ? { ...prev, instructions: e.target.value } : null)}
                                    rows={2}
                                    className="resize-none"
                                />
                            </div>

                            {/* Score */}
                            <div className="space-y-2">
                                <Label htmlFor="question-score" className="font-medium">
                                    Điểm cho câu hỏi <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="question-score"
                                    type="number"
                                    min="1"
                                    value={currentQuestion.score}
                                    onChange={(e) => setCurrentQuestion(prev => prev ? { ...prev, score: Number(e.target.value) || 0 } : null)}
                                    className="h-10"
                                />
                            </div>

                            {/* Options for multiple choice and true/false */}
                            {(currentQuestion.questionTypeId === 'multiple_choice' || currentQuestion.questionTypeId === 'true_false') && (
                                <div className="space-y-4 border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="font-medium">Các đáp án</Label>
                                        {currentQuestion.questionTypeId !== 'true_false' && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addOption}
                                                className="gap-1"
                                            >
                                                <Plus className="w-3 h-3" />
                                                Thêm đáp án
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {currentQuestion.options?.map((option, optIndex) => (
                                            <div key={option.tempId} className="flex items-start gap-3">
                                                <input
                                                    type="radio"
                                                    checked={option.isCorrect}
                                                    onChange={() => updateQuestionOption(optIndex, 'isCorrect', true)}
                                                    className="mt-3"
                                                    title="Chọn đáp án đúng"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <Input
                                                        placeholder={`Đáp án ${optIndex + 1}`}
                                                        value={option.content}
                                                        onChange={(e) => updateQuestionOption(optIndex, 'content', e.target.value)}
                                                        className="h-10"
                                                    />
                                                </div>
                                                {currentQuestion.questionTypeId === 'multiple_choice' && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeOption(optIndex)}
                                                        className="h-10 w-10 p-0 mt-0 text-red-600"
                                                    >
                                                        ✕
                                                    </Button>
                                                )}
                                                {option.isCorrect && (
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-2.5" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Modal Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowQuestionModal(false)}
                                >
                                    Hủy
                                </Button>
                                <Button type="button" onClick={saveQuestion}>
                                    {editingQuestion ? 'Cập nhật' : 'Thêm'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteConfirm.show} onOpenChange={() => setDeleteConfirm({ show: false })}>
                <AlertDialogContent>
                    <AlertDialogTitle>Xóa câu hỏi</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                    <div className="flex justify-end gap-4">
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteConfirm.questionId && deleteQuestion(deleteConfirm.questionId)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Xóa
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AssignmentForm;
