import React, { useState, useEffect } from 'react';
import {
    Panel,
    Button,
    Form,
    Input,
    DatePicker,
    SelectPicker,
    IconButton,
    Message,
    Divider,
    FlexboxGrid,
    ButtonToolbar,
    Radio,
    RadioGroup,
    Toggle,
    InputNumber,
    Modal,
} from 'rsuite';
import { Plus, Trash, Edit, Save, Close } from '@rsuite/icons';
import { Assignment, Question, QuestionOption } from '@/apiRequests/assignment';

interface AssignmentFormProps {
    assignment?: Assignment;
    onSave: (assignment: Partial<Assignment>) => void;
    onCancel: () => void;
    loading?: boolean;
}

interface QuestionFormData extends Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'assignmentId'> {
    tempId: string;
    options?: (Omit<QuestionOption, 'id' | 'questionId'> & { tempId: string })[];
}

interface AssignmentFormData {
    title: string;
    description: string;
    dueDate: Date | null;
    questions: QuestionFormData[];
}

const questionTypes = [
    { label: 'Tự luận', value: 'essay' },
    { label: 'Trắc nghiệm', value: 'multiple_choice' },
    { label: 'Đúng/Sai', value: 'true_false' },
    { label: 'Điền từ', value: 'fill_blank' },
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

        if (editingQuestion) {
            // Update existing question
            setFormData(prev => ({
                ...prev,
                questions: prev.questions.map(q =>
                    q.tempId === editingQuestion ? currentQuestion : q
                ),
            }));
        } else {
            // Add new question
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
    };

    const updateQuestionOption = (optionIndex: number, field: string, value: any) => {
        if (!currentQuestion) return;

        setCurrentQuestion(prev => {
            if (!prev || !prev.options) return prev;

            const newOptions = [...prev.options];
            newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };

            // If this option is set as correct and it's multiple choice, uncheck others
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

    const handleSubmit = () => {
        const totalScore = formData.questions.reduce((sum, q) => sum + q.score, 0);

        const assignmentData: Partial<Assignment> = {
            ...assignment,
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate?.toISOString() || '',
            totalScore,
            questions: formData.questions.map(q => ({
                ...q,
                id: q.tempId.startsWith('temp_') ? '' : q.tempId,
                assignmentId: assignment?.id || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Assignment Basic Info */}
            <Panel bordered header="Thông tin cơ bản" style={{ backgroundColor: 'white' }}>
                <Form fluid>
                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={24} style={{ marginBottom: '16px' }}>
                            <Form.Group>
                                <Form.ControlLabel>Tiêu đề bài tập *</Form.ControlLabel>
                                <Input
                                    value={formData.title}
                                    onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                                    placeholder="Nhập tiêu đề bài tập..."
                                />
                            </Form.Group>
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item colspan={24} style={{ marginBottom: '16px' }}>
                            <Form.Group>
                                <Form.ControlLabel>Mô tả</Form.ControlLabel>
                                <Input
                                    as="textarea"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                    placeholder="Nhập mô tả bài tập..."
                                />
                            </Form.Group>
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item colspan={12} style={{ marginBottom: '16px' }}>
                            <Form.Group>
                                <Form.ControlLabel>Hạn nộp *</Form.ControlLabel>
                                <DatePicker
                                    format="dd/MM/yyyy HH:mm"
                                    value={formData.dueDate}
                                    onChange={(value) => setFormData(prev => ({ ...prev, dueDate: value }))}
                                    placeholder="Chọn hạn nộp..."
                                    style={{ width: '100%' }}
                                />
                            </Form.Group>
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item colspan={12} style={{ marginBottom: '16px' }}>
                            <Form.Group>
                                <Form.ControlLabel>Tổng điểm</Form.ControlLabel>
                                <Input
                                    value={totalScore.toString()}
                                    readOnly
                                    style={{ backgroundColor: '#f8f9fa' }}
                                />
                            </Form.Group>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Form>
            </Panel>

            {/* Questions */}
            <Panel
                bordered
                header={
                    <FlexboxGrid justify="space-between" align="middle">
                        <FlexboxGrid.Item>
                            <span>Câu hỏi ({formData.questions.length})</span>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item>
                            <Button
                                appearance="primary"
                                startIcon={<Plus />}
                                onClick={addQuestion}
                            >
                                Thêm câu hỏi
                            </Button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                }
                style={{ backgroundColor: 'white' }}
            >
                {formData.questions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        <p>Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {formData.questions.map((question, index) => (
                            <Panel
                                key={question.tempId}
                                bordered
                                style={{ backgroundColor: '#f8f9fa' }}
                                header={
                                    <FlexboxGrid justify="space-between" align="middle">
                                        <FlexboxGrid.Item>
                                            <span style={{ fontWeight: 600 }}>
                                                Câu {index + 1} - {question.score} điểm
                                            </span>
                                            <span style={{
                                                marginLeft: '8px',
                                                padding: '2px 8px',
                                                backgroundColor: question.questionTypeId === 'essay' ? '#f59e0b' : '#06b6d4',
                                                color: 'white',
                                                borderRadius: '4px',
                                                fontSize: '12px'
                                            }}>
                                                {questionTypes.find(t => t.value === question.questionTypeId)?.label}
                                            </span>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item>
                                            <ButtonToolbar>
                                                <IconButton
                                                    icon={<Edit />}
                                                    size="sm"
                                                    onClick={() => editQuestion(question)}
                                                />
                                                <IconButton
                                                    icon={<Trash />}
                                                    size="sm"
                                                    color="red"
                                                    appearance="ghost"
                                                    onClick={() => deleteQuestion(question.tempId)}
                                                />
                                            </ButtonToolbar>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                }
                            >
                                <p style={{ margin: '8px 0', fontWeight: 500 }}>
                                    {question.content}
                                </p>
                                {question.instructions && (
                                    <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
                                        Hướng dẫn: {question.instructions}
                                    </p>
                                )}
                                {question.options && question.options.length > 0 && (
                                    <div style={{ marginTop: '8px' }}>
                                        <strong style={{ fontSize: '14px' }}>Lựa chọn:</strong>
                                        <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                                            {question.options.map((option, optIdx) => (
                                                <li
                                                    key={option.tempId}
                                                    style={{
                                                        color: option.isCorrect ? '#22c55e' : '#666',
                                                        fontWeight: option.isCorrect ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {option.content}
                                                    {option.isCorrect && ' ✓'}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </Panel>
                        ))}
                    </div>
                )}
            </Panel>

            {/* Actions */}
            <Panel bordered style={{ backgroundColor: 'white' }}>
                <FlexboxGrid justify="end">
                    <FlexboxGrid.Item>
                        <ButtonToolbar>
                            <Button
                                appearance="subtle"
                                onClick={onCancel}
                            >
                                Hủy
                            </Button>
                            <Button
                                appearance="primary"
                                loading={loading}
                                onClick={handleSubmit}
                                disabled={!formData.title || !formData.dueDate || formData.questions.length === 0}
                            >
                                {assignment ? 'Cập nhật' : 'Tạo bài tập'}
                            </Button>
                        </ButtonToolbar>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Panel>

            {/* Question Modal */}
            <Modal
                open={showQuestionModal}
                onClose={() => setShowQuestionModal(false)}
                size="lg"
            >
                <Modal.Header>
                    <Modal.Title>
                        {editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentQuestion && (
                        <Form fluid>
                            <Form.Group>
                                <Form.ControlLabel>Loại câu hỏi *</Form.ControlLabel>
                                <SelectPicker
                                    data={questionTypes}
                                    value={currentQuestion.questionTypeId}
                                    onChange={(value) => setCurrentQuestion(prev =>
                                        prev ? { ...prev, questionTypeId: value as any } : null
                                    )}
                                    style={{ width: '100%' }}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.ControlLabel>Câu hỏi *</Form.ControlLabel>
                                <Input
                                    as="textarea"
                                    rows={3}
                                    value={currentQuestion.content}
                                    onChange={(value) => setCurrentQuestion(prev =>
                                        prev ? { ...prev, content: value } : null
                                    )}
                                    placeholder="Nhập nội dung câu hỏi..."
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.ControlLabel>Hướng dẫn (tùy chọn)</Form.ControlLabel>
                                <Input
                                    as="textarea"
                                    rows={2}
                                    value={currentQuestion.instructions || ''}
                                    onChange={(value) => setCurrentQuestion(prev =>
                                        prev ? { ...prev, instructions: value } : null
                                    )}
                                    placeholder="Nhập hướng dẫn làm bài..."
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.ControlLabel>Điểm số *</Form.ControlLabel>
                                <InputNumber
                                    value={currentQuestion.score}
                                    onChange={(value) => setCurrentQuestion(prev =>
                                        prev ? { ...prev, score: value || 0 } : null
                                    )}
                                    min={1}
                                    max={100}
                                    style={{ width: '120px' }}
                                />
                            </Form.Group>

                            {/* Options for multiple choice */}
                            {currentQuestion.questionTypeId === 'multiple_choice' && (
                                <Form.Group>
                                    <Form.ControlLabel>
                                        Lựa chọn *
                                        <Button
                                            size="xs"
                                            appearance="link"
                                            startIcon={<Plus />}
                                            onClick={addOption}
                                            style={{ marginLeft: '8px' }}
                                        >
                                            Thêm lựa chọn
                                        </Button>
                                    </Form.ControlLabel>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {currentQuestion.options?.map((option, optIndex) => (
                                            <FlexboxGrid key={option.tempId} align="middle">
                                                <FlexboxGrid.Item colspan={2}>
                                                    <Radio
                                                        checked={option.isCorrect}
                                                        onChange={() => updateQuestionOption(optIndex, 'isCorrect', true)}
                                                    />
                                                </FlexboxGrid.Item>
                                                <FlexboxGrid.Item colspan={20}>
                                                    <Input
                                                        value={option.content}
                                                        onChange={(value) => updateQuestionOption(optIndex, 'content', value)}
                                                        placeholder={`Lựa chọn ${optIndex + 1}...`}
                                                    />
                                                </FlexboxGrid.Item>
                                                <FlexboxGrid.Item colspan={2}>
                                                    <IconButton
                                                        icon={<Trash />}
                                                        size="sm"
                                                        color="red"
                                                        appearance="ghost"
                                                        onClick={() => removeOption(optIndex)}
                                                        disabled={(currentQuestion.options?.length || 0) <= 2}
                                                    />
                                                </FlexboxGrid.Item>
                                            </FlexboxGrid>
                                        ))}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                        * Chọn vào radio button để đánh dấu đáp án đúng
                                    </div>
                                </Form.Group>
                            )}
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        appearance="subtle"
                        onClick={() => setShowQuestionModal(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        appearance="primary"
                        onClick={saveQuestion}
                        disabled={!currentQuestion?.content || !currentQuestion?.score}
                    >
                        {editingQuestion ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AssignmentForm;