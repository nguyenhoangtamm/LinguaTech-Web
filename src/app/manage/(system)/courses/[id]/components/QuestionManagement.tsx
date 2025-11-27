"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    HelpCircle,
    Eye,
    CheckSquare,
    Circle,
    X
} from "lucide-react";
import { Modal, Button as RSButton, SelectPicker } from "rsuite";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import DeletePopover from "@/app/shared/delete-popover";
import { DetailModal, DetailField, DetailSection } from "@/components/ui/detail-modal";

interface QuestionManagementProps {
    courseId: number;
}

// Mock question schema
const OptionSchema = z.object({
    text: z.string().min(1, "Nội dung đáp án không được để trống"),
    isCorrect: z.boolean().default(false),
});

const CreateQuestionSchema = z.object({
    content: z.string().min(1, "Nội dung câu hỏi là bắt buộc"),
    type: z.enum(["multiple_choice", "single_choice", "true_false", "fill_blank"]),
    options: z.array(OptionSchema).min(2, "Phải có ít nhất 2 đáp án"),
    explanation: z.string().optional(),
    points: z.number().min(1, "Điểm phải lớn hơn 0"),
    assignmentId: z.number(),
});

type CreateQuestionType = z.infer<typeof CreateQuestionSchema>;

// Mock data
const mockAssignments = [
    { id: 1, title: "Bài tập 1: Kiểm tra kiến thức cơ bản", lessonTitle: "Bài 1: Giới thiệu" },
    { id: 2, title: "Bài tập 2: Thực hành", lessonTitle: "Bài 2: Thực hành" },
];

const mockQuestions = [
    {
        id: 1,
        content: "React là gì?",
        type: "multiple_choice",
        options: [
            { text: "Một thư viện JavaScript", isCorrect: true },
            { text: "Một framework CSS", isCorrect: false },
            { text: "Một ngôn ngữ lập trình", isCorrect: false },
            { text: "Một cơ sở dữ liệu", isCorrect: false },
        ],
        explanation: "React là một thư viện JavaScript để xây dựng giao diện người dùng",
        points: 10,
        assignmentId: 1,
        assignmentTitle: "Bài tập 1: Kiểm tra kiến thức cơ bản",
        lessonTitle: "Bài 1: Giới thiệu",
        createdAt: "2024-01-01T00:00:00Z",
    },
    {
        id: 2,
        content: "JSX có thể chứa HTML tags.",
        type: "true_false",
        options: [
            { text: "Đúng", isCorrect: true },
            { text: "Sai", isCorrect: false },
        ],
        explanation: "JSX cho phép viết HTML-like syntax trong JavaScript",
        points: 5,
        assignmentId: 1,
        assignmentTitle: "Bài tập 1: Kiểm tra kiến thức cơ bản",
        lessonTitle: "Bài 1: Giới thiệu",
        createdAt: "2024-01-01T00:00:00Z",
    },
];

const questionTypes = [
    { value: "multiple_choice", label: "Trắc nghiệm nhiều lựa chọn" },
    { value: "single_choice", label: "Trắc nghiệm một lựa chọn" },
    { value: "true_false", label: "Đúng/Sai" },
    { value: "fill_blank", label: "Điền vào chỗ trống" },
];

export default function QuestionManagement({ courseId }: QuestionManagementProps) {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any>(null);
    const [detailQuestion, setDetailQuestion] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<CreateQuestionType>({
        resolver: zodResolver(CreateQuestionSchema),
        defaultValues: {
            content: "",
            type: "multiple_choice",
            options: [
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
            ],
            explanation: "",
            points: 10,
            assignmentId: 0,
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "options",
    });

    const handleSearch = () => {
        if (searchInputRef.current) {
            setSearchKeyword(searchInputRef.current.value.trim());
        }
    };

    const handleCreateQuestion = () => {
        form.reset({
            content: "",
            type: "multiple_choice",
            options: [
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
            ],
            explanation: "",
            points: 10,
            assignmentId: mockAssignments[0]?.id || 0,
        });
        setEditingQuestion(null);
        setIsCreateDialogOpen(true);
    };

    const handleEditQuestion = (question: any) => {
        form.reset({
            content: question.content,
            type: question.type,
            options: question.options,
            explanation: question.explanation || "",
            points: question.points,
            assignmentId: question.assignmentId,
        });
        setEditingQuestion(question);
        setIsCreateDialogOpen(true);
    };

    const handleDeleteQuestion = async (question: any) => {
        toast({
            title: "Thành công",
            description: "Câu hỏi đã được xóa",
            variant: "success",
        });
    };

    const handleViewDetail = (question: any) => {
        setDetailQuestion(question);
        setIsDetailModalOpen(true);
    };

    const addOption = () => {
        append({ text: "", isCorrect: false });
    };

    const handleQuestionTypeChange = (type: string) => {
        form.setValue("type", type as any);

        if (type === "true_false") {
            replace([
                { text: "Đúng", isCorrect: false },
                { text: "Sai", isCorrect: false },
            ]);
        } else if (fields.length < 2) {
            replace([
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
            ]);
        }
    };

    const onSubmit = async (values: CreateQuestionType) => {
        // Validate at least one correct answer
        const hasCorrectAnswer = values.options.some(option => option.isCorrect);
        if (!hasCorrectAnswer) {
            toast({
                title: "Lỗi",
                description: "Phải có ít nhất một đáp án đúng",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Thành công",
            description: editingQuestion ? "Câu hỏi đã được cập nhật" : "Câu hỏi đã được tạo",
            variant: "success",
        });
        setIsCreateDialogOpen(false);
    };

    const filteredQuestions = mockQuestions.filter(question =>
        question.content.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Quản lý Câu hỏi</h3>
                    <p className="text-sm text-gray-600">
                        Tổng cộng: {filteredQuestions.length} câu hỏi
                    </p>
                </div>
                <Button onClick={handleCreateQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Câu hỏi
                </Button>
            </div>

            {/* Search */}
            <div className="flex gap-2">
                <Input
                    ref={searchInputRef}
                    placeholder="Tìm kiếm câu hỏi..."
                    className="flex-1"
                />
                <Button variant="outline" onClick={handleSearch}>
                    <Search className="w-4 h-4" />
                </Button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {filteredQuestions.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Chưa có câu hỏi nào
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Thêm câu hỏi đầu tiên để tạo bài kiểm tra
                            </p>
                            <Button onClick={handleCreateQuestion}>
                                <Plus className="w-4 h-4 mr-2" />
                                Tạo Câu hỏi đầu tiên
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    filteredQuestions.map((question) => (
                        <Card key={question.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-medium text-gray-900">{question.content}</h4>
                                            <Badge variant="outline" className="text-xs">
                                                {questionTypes.find(t => t.value === question.type)?.label}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                {question.points} điểm
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-blue-600 mb-2">
                                            {question.lessonTitle} → {question.assignmentTitle}
                                        </p>

                                        {/* Options */}
                                        <div className="space-y-1 mb-2">
                                            {question.options.map((option: any, index: number) => (
                                                <div key={index} className="flex items-center gap-2 text-sm">
                                                    {option.isCorrect ? (
                                                        <CheckSquare className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-gray-400" />
                                                    )}
                                                    <span className={option.isCorrect ? "text-green-600 font-medium" : "text-gray-600"}>
                                                        {option.text}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {question.explanation && (
                                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                <strong>Giải thích:</strong> {question.explanation}
                                            </p>
                                        )}

                                        <div className="text-xs text-gray-500 mt-2">
                                            Tạo: {new Date(question.createdAt).toLocaleDateString("vi-VN")}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Button variant="ghost" size="sm" onClick={() => handleViewDetail(question)}>
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(question)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <DeletePopover
                                            title="Xóa Câu hỏi"
                                            description={`Bạn có chắc chắn muốn xóa câu hỏi "${question.content}"? Hành động này không thể hoàn tác.`}
                                            onDelete={() => handleDeleteQuestion(question)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal 
                open={isCreateDialogOpen} 
                onClose={() => setIsCreateDialogOpen(false)}
                size="lg"
            >
                <Modal.Header>
                    <Modal.Title>
                        {editingQuestion ? "Chỉnh sửa Câu hỏi" : "Tạo Câu hỏi mới"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="max-h-[70vh] overflow-y-auto">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="assignmentId">Bài tập *</Label>
                                <Select
                                    value={form.watch("assignmentId")?.toString()}
                                    onValueChange={(value) => form.setValue("assignmentId", parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn bài tập" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockAssignments.map((assignment) => (
                                            <SelectItem key={assignment.id} value={assignment.id.toString()}>
                                                {assignment.lessonTitle} → {assignment.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="content">Nội dung câu hỏi *</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Nhập nội dung câu hỏi..."
                                    {...form.register("content")}
                                    rows={3}
                                />
                                {form.formState.errors.content && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {form.formState.errors.content.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="type">Loại câu hỏi *</Label>
                                    <Select
                                        value={form.watch("type")}
                                        onValueChange={handleQuestionTypeChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {questionTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="points">Điểm *</Label>
                                    <Input
                                        id="points"
                                        type="number"
                                        min="1"
                                        {...form.register("points", { valueAsNumber: true })}
                                    />
                                </div>
                            </div>

                            {/* Options */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label>Đáp án *</Label>
                                    {form.watch("type") !== "true_false" && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addOption}
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Thêm đáp án
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={form.watch(`options.${index}.isCorrect`)}
                                                onChange={(e) => form.setValue(`options.${index}.isCorrect`, e.target.checked)}
                                                className="rounded"
                                            />
                                            <Input
                                                placeholder={`Đáp án ${index + 1}`}
                                                {...form.register(`options.${index}.text`)}
                                                className="flex-1"
                                            />
                                            {form.watch("type") !== "true_false" && fields.length > 2 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {form.formState.errors.options && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {form.formState.errors.options.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="explanation">Giải thích (tùy chọn)</Label>
                                <Textarea
                                    id="explanation"
                                    placeholder="Giải thích đáp án đúng..."
                                    {...form.register("explanation")}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <RSButton 
                        onClick={() => setIsCreateDialogOpen(false)} 
                        appearance="subtle"
                    >
                        Hủy
                    </RSButton>
                    <RSButton 
                        onClick={form.handleSubmit(onSubmit)}
                        appearance="primary"
                    >
                        {editingQuestion ? "Cập nhật" : "Tạo Câu hỏi"}
                    </RSButton>
                </Modal.Footer>
            </Modal>

            {/* Detail Modal */}
            <DetailModal
                open={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title={`Chi tiết Câu hỏi`}
                size="lg"
            >
                {detailQuestion && (
                    <div className="space-y-6">
                        <DetailSection title="Thông tin cơ bản">
                            <DetailField 
                                label="Nội dung câu hỏi" 
                                value={detailQuestion.content} 
                                fullWidth
                            />
                            <DetailField 
                                label="Loại câu hỏi" 
                                value={questionTypes.find(t => t.value === detailQuestion.type)?.label || detailQuestion.type} 
                            />
                            <DetailField label="Điểm" value={`${detailQuestion.points} điểm`} />
                        </DetailSection>
                        
                        <DetailSection title="Bài tập">
                            <DetailField label="Bài tập" value={detailQuestion.assignmentTitle} />
                            <DetailField label="Bài học" value={detailQuestion.lessonTitle} />
                        </DetailSection>
                        
                        <DetailSection title="Đáp án">
                            <div className="col-span-2">
                                <dt className="text-sm font-medium text-gray-500 mb-2">Các lựa chọn:</dt>
                                <dd className="space-y-2">
                                    {detailQuestion.options?.map((option: any, index: number) => (
                                        <div 
                                            key={index} 
                                            className={`p-3 rounded-lg border ${
                                                option.isCorrect 
                                                    ? 'bg-green-50 border-green-200' 
                                                    : 'bg-gray-50 border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {option.isCorrect ? (
                                                    <CheckSquare className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Circle className="w-4 h-4 text-gray-400" />
                                                )}
                                                <span className={option.isCorrect ? 'text-green-700 font-medium' : 'text-gray-700'}>
                                                    {option.text}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </dd>
                            </div>
                        </DetailSection>
                        
                        {detailQuestion.explanation && (
                            <DetailSection title="Giải thích">
                                <DetailField 
                                    label="Giải thích" 
                                    value={detailQuestion.explanation} 
                                    fullWidth
                                />
                            </DetailSection>
                        )}
                        
                        <DetailSection title="Thông tin thời gian">
                            <DetailField 
                                label="Ngày tạo" 
                                value={new Date(detailQuestion.createdAt).toLocaleString("vi-VN")} 
                            />
                        </DetailSection>
                    </div>
                )}
            </DetailModal>
        </div>
    );
}