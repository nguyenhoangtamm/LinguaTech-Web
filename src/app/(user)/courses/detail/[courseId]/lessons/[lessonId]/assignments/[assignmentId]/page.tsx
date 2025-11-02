"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Panel,
    Button,
    Badge,
    Progress,
    RadioGroup,
    Radio,
    Input,
    Divider,
    Loader,
    Message,
    useToaster,
    Modal,
    Grid,
    Row,
    Col,
    FlexboxGrid,
    Tag,
    Notification,
} from "rsuite";
import {
    ArrowLeftLine,
    Time,
    CheckRound,
    Send,
    Close,
    Detail as InfoIcon,
} from "@rsuite/icons";
import { routes } from "@/config/routes";
import { useAssignment, useUserSubmission, useSubmitAssignment } from "@/queries/useAssignment";
import { Assignment, Question, SubmissionAnswer, AnswerRequest } from "@/apiRequests/assignment";
import AssignmentResults from "@/components/assignments/AssignmentResults";

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Note: debouncing and auto-save disabled — answers are only sent on submit.
 */

/**
 * Format date to locale string
 */
const formatDueDate = (date: string | Date): string => {
    try {
        return new Date(date).toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return "Không xác định";
    }
};

/**
 * Calculate days remaining until due date
 */
const calculateDaysRemaining = (dueDate: string | Date): number => {
    try {
        return Math.ceil(
            (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
    } catch {
        return -1;
    }
};

/**
 * Validate parameters
 */
const validateParams = (
    courseId?: string | number,
    lessonId?: string | number,
    assignmentId?: string
): { valid: boolean; message?: string } => {
    if (!assignmentId || assignmentId === "") {
        return { valid: false, message: "ID bài tập không hợp lệ" };
    }
    if (!courseId || !lessonId) {
        return { valid: false, message: "ID khóa học hoặc bài học không hợp lệ" };
    }
    return { valid: true };
};

export default function AssignmentPage() {
    const params = useParams();
    const router = useRouter();
    const toaster = useToaster();

    // Parse URL parameters
    const courseIdParam = params.courseId as string | undefined;
    const lessonIdParam = params.lessonId as string | undefined;
    const assignmentIdParam = params.assignmentId as string | undefined;

    const courseId = courseIdParam ? Number(courseIdParam) : undefined;
    const lessonId = lessonIdParam ? Number(lessonIdParam) : undefined;
    const assignmentId = assignmentIdParam ?? "";

    // Validate parameters
    const paramValidation = validateParams(courseId, lessonId, assignmentId);

    // State management
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    // lastSaved removed since auto-save is disabled
    const [submitError, setSubmitError] = useState<string | null>(null);

    // API hooks
    const {
        data: assignment,
        isLoading: loadingAssignment,
        error: assignmentError,
    } = useAssignment(assignmentId);
    const {
        data: submission,
        isLoading: loadingSubmission,
        refetch: refetchSubmission,
    } = useUserSubmission(assignmentId);
    const submitMutation = useSubmitAssignment();
    // Auto-save disabled: we only submit on explicit user action
    const isSaving = false;

    // Debounced answers for auto-save (auto-save disabled)
    // const debouncedAnswers = useDebounce(answers, 2000);

    // Computed values
    const isSubmitted = useMemo(
        () => submission?.status === "submitted" || submission?.status === "graded",
        [submission?.status]
    );
    const isGraded = useMemo(() => submission?.status === "graded", [submission?.status]);

    const totalScore = useMemo(
        () => assignment?.questions?.reduce((sum: number, q: Question) => sum + q.score, 0) || 0,
        [assignment?.questions]
    );

    const userScore = useMemo(() => submission?.score || 0, [submission?.score]);

    const daysRemaining = useMemo(
        () => (assignment?.dueDate ? calculateDaysRemaining(assignment.dueDate) : -1),
        [assignment]
    );

    const isOverdue = useMemo(() => daysRemaining < 0, [daysRemaining]);

    const completionPercentage = useMemo(
        () => (isGraded && totalScore > 0 ? (userScore / totalScore) * 100 : 0),
        [isGraded, userScore, totalScore]
    );

    const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

    const totalQuestions = useMemo(() => assignment?.questions?.length || 0, [assignment?.questions]);

    const progressPercentage = useMemo(
        () => (totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0),
        [answeredCount, totalQuestions]
    );

    // Initialize answers from existing submission or draft
    useEffect(() => {
        if (submission?.answers) {
            const initialAnswers: Record<string, string> = {};
            submission.answers.forEach((ans: SubmissionAnswer) => {
                if (ans.selectedOptionId) {
                    initialAnswers[ans.questionId] = ans.selectedOptionId;
                } else if (ans.answer) {
                    initialAnswers[ans.questionId] = ans.answer;
                }
            });
            setAnswers(initialAnswers);
        }
    }, [submission?.answers]);

    // Expand all questions by default when assignment data is loaded so options are visible
    useEffect(() => {
        if (assignment?.questions && assignment.questions.length > 0) {
            const ids = new Set<string>(assignment.questions.map((q: Question) => q.id));
            setExpandedQuestions(ids);
        }
    }, [assignment?.questions]);

    // Auto-save draft answers disabled. We only save/submit when the user clicks submit.

    const handleAnswerChange = useCallback(
        (questionId: string, value: string | number | any) => {
            if (!isSubmitted) {
                setAnswers((prev) => ({
                    ...prev,
                    [questionId]: String(value),
                }));
                setSubmitError(null);
            }
        },
        [isSubmitted]
    );

    const toggleQuestion = useCallback((questionId: string) => {
        setExpandedQuestions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    }, []);

    const handleSubmit = useCallback(() => {
        if (answeredCount === 0) {
            setSubmitError("Bạn phải trả lời ít nhất một câu hỏi");
            return;
        }

        try {
            const answersArray: AnswerRequest[] = Object.entries(answers).map(([questionId, answer]) => {
                const question = assignment?.questions?.find((q: Question) => q.id === questionId);
                const isMultipleChoice = question?.questionTypeId === "multiple_choice";

                return {
                    questionId,
                    answer: isMultipleChoice ? "" : answer,
                    selectedOptionId: isMultipleChoice ? answer : undefined,
                };
            });

            submitMutation.mutate(
                { assignmentId, data: { answers: answersArray } },
                {
                    onSuccess: () => {
                        setShowConfirmSubmit(false);
                        setSubmitError(null);
                        refetchSubmission();
                        toaster.push(
                            <Notification type="success" header="Thành công">
                                Bài tập đã được nộp thành công!
                            </Notification>,
                            { duration: 5000 }
                        );
                    },
                    onError: (error: any) => {
                        const errorMessage =
                            error?.message || "Có lỗi xảy ra khi nộp bài tập. Vui lòng thử lại.";
                        setSubmitError(errorMessage);
                        toaster.push(
                            <Notification type="error" header="Lỗi">
                                {errorMessage}
                            </Notification>,
                            { duration: 5000 }
                        );
                    },
                }
            );
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng thử lại.";
            setSubmitError(errorMessage);
        }
    }, [answers, assignment?.questions, assignmentId, submitMutation, refetchSubmission, toaster, answeredCount]);

    // =========================================================================
    // Render: Loading State
    // =========================================================================
    if (loadingAssignment || loadingSubmission) {
        return (
            <div style={{ padding: "50px", textAlign: "center", minHeight: "100vh" }}>
                <Loader size="lg" content="Đang tải bài tập..." />
            </div>
        );
    }

    // =========================================================================
    // Render: Parameter Validation Error
    // =========================================================================
    if (!paramValidation.valid) {
        return (
            <div style={{ padding: "50px", textAlign: "center", minHeight: "100vh" }}>
                <Message type="error" header="Lỗi">
                    {paramValidation.message}
                </Message>
            </div>
        );
    }

    // =========================================================================
    // Render: API Error State
    // =========================================================================
    if (assignmentError) {
        return (
            <div style={{ padding: "50px", textAlign: "center", minHeight: "100vh" }}>
                <Message type="error" header="Lỗi tải bài tập">
                    {assignmentError instanceof Error
                        ? assignmentError.message
                        : "Không thể tải bài tập. Vui lòng thử lại."}
                </Message>
                <Button
                    appearance="primary"
                    style={{ marginTop: "16px" }}
                    onClick={() => window.location.reload()}
                >
                    Thử lại
                </Button>
            </div>
        );
    }

    // =========================================================================
    // Render: Assignment Not Found
    // =========================================================================
    if (!assignment) {
        return (
            <div style={{ padding: "50px", textAlign: "center", minHeight: "100vh" }}>
                <Message type="warning" header="Không tìm thấy">
                    Bài tập không tồn tại hoặc đã bị xóa.
                </Message>
                <Button
                    appearance="primary"
                    style={{ marginTop: "16px" }}
                    as={Link}
                    href={`/courses/detail/${courseId}/lessons/${lessonId}`}
                >
                    Quay lại bài học
                </Button>
            </div>
        );
    }

    // =========================================================================
    // Render: No Questions in Assignment
    // =========================================================================
    if (!assignment.questions || assignment.questions.length === 0) {
        return (
            <div style={{ padding: "50px", textAlign: "center", minHeight: "100vh" }}>
                <Message type="warning" header="Chưa có câu hỏi">
                    Bài tập này chưa có câu hỏi nào.
                </Message>
                <Button
                    appearance="primary"
                    style={{ marginTop: "16px" }}
                    as={Link}
                    href={`/courses/detail/${courseId}/lessons/${lessonId}`}
                >
                    Quay lại bài học
                </Button>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header */}
            <Panel
                bordered
                style={{
                    backgroundColor: 'white',
                    borderRadius: 0,
                    marginBottom: 0,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
                    <FlexboxGrid justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                        <FlexboxGrid.Item style={{ fontSize: '14px', color: '#666' }}>
                            <Link href={routes.user.courses} style={{ color: '#666', textDecoration: 'none' }}>
                                Khóa học
                            </Link>
                            <span style={{ margin: '0 8px' }}>/</span>
                            <Link href={`/courses/detail/${courseId}`} style={{ color: '#666', textDecoration: 'none' }}>
                                Chi tiết khóa học
                            </Link>
                            <span style={{ margin: '0 8px' }}>/</span>
                            <Link href={`/courses/detail/${courseId}/lessons/${lessonId}`} style={{ color: '#666', textDecoration: 'none' }}>
                                Bài học
                            </Link>
                            <span style={{ margin: '0 8px' }}>/</span>
                            <span style={{ color: '#333', fontWeight: 500 }}>{assignment.title}</span>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item>
                            <Button
                                appearance="ghost"
                                size="sm"
                                as={Link}
                                href={`/courses/detail/${courseId}/lessons/${lessonId}`}
                                startIcon={<ArrowLeftLine />}
                            >
                                Quay lại
                            </Button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </div>
            </Panel>

            {/* Main Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                <Grid fluid>
                    <Row gutter={24}>
                        {/* Left Column - Assignment Content */}
                        <Col lg={16} md={24} sm={24}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                                {/* Assignment Header */}
                                <Panel bordered style={{ backgroundColor: 'white' }}>
                                    <FlexboxGrid justify="space-between" align="top">
                                        <FlexboxGrid.Item style={{ flex: 1 }}>
                                            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 600 }}>
                                                {assignment.title}
                                            </h2>
                                            <p style={{ margin: '0', color: '#666', fontSize: '16px' }}>
                                                {assignment.description}
                                            </p>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item>
                                            <Badge
                                                color={isOverdue ? 'red' : isSubmitted ? 'green' : 'blue'}
                                                content={isOverdue ? 'Quá hạn' : isSubmitted ? 'Đã nộp' : 'Chưa nộp'}
                                            />
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </Panel>

                                {/* Progress Panel */}
                                {!isSubmitted && (
                                    <Panel bordered style={{ backgroundColor: '#f0f9ff', borderColor: '#0ea5e9' }}>
                                        <h4 style={{ margin: '0 0 12px 0', color: '#0ea5e9' }}>Tiến độ làm bài</h4>
                                        <div style={{ marginBottom: '8px' }}>
                                            <span style={{ fontSize: '14px', color: '#666' }}>
                                                Đã trả lời {answeredCount}/{totalQuestions} câu hỏi
                                            </span>
                                        </div>
                                        <Progress.Line
                                            percent={progressPercentage}
                                            strokeColor="#0ea5e9"
                                            style={{ marginBottom: '12px' }}
                                        />
                                        {/* Auto-save disabled: no saving indicator shown */}
                                    </Panel>
                                )}

                                {/* Questions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 style={{ margin: '0', fontSize: '18px', fontWeight: 600 }}>Câu hỏi</h3>

                                    {assignment.questions?.map((question: Question, index: number) => {
                                        const isExpanded = expandedQuestions.has(question.id);
                                        const userAnswer = answers[question.id];
                                        const isEssay = question.questionTypeId === 'essay';
                                        const submissionAnswer = submission?.answers?.find((a: SubmissionAnswer) => a.questionId === question.id);

                                        return (
                                            <Panel
                                                key={question.id}
                                                bordered
                                                collapsible
                                                expanded={isExpanded}
                                                onToggle={() => toggleQuestion(question.id)}
                                                style={{
                                                    backgroundColor: isSubmitted ? '#f9f9f9' : 'white',
                                                    border: isSubmitted && submissionAnswer ?
                                                        (submissionAnswer.isCorrect ? '2px solid #10b981' : '2px solid #ef4444') :
                                                        undefined
                                                }}
                                                header={
                                                    <FlexboxGrid justify="space-between" align="middle">
                                                        <FlexboxGrid.Item style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                                                <span style={{ fontSize: '16px', fontWeight: 600 }}>
                                                                    Câu {index + 1}
                                                                </span>
                                                                <Tag color="blue">{question.score} điểm</Tag>
                                                                <Tag color={isEssay ? 'orange' : 'cyan'}>
                                                                    {isEssay ? 'Tự luận' : 'Trắc nghiệm'}
                                                                </Tag>
                                                                {userAnswer && !isSubmitted && (
                                                                    <Tag color="green">Đã trả lời</Tag>
                                                                )}
                                                                {isSubmitted && submissionAnswer && (
                                                                    <Tag color={submissionAnswer.isCorrect ? 'green' : 'red'}>
                                                                        {submissionAnswer.isCorrect ? 'Đúng' : 'Sai'}
                                                                        {submissionAnswer.score !== undefined && (
                                                                            ` (${submissionAnswer.score}/${question.score})`
                                                                        )}
                                                                    </Tag>
                                                                )}
                                                            </div>
                                                            <p style={{
                                                                margin: '8px 0 0 0',
                                                                color: '#333',
                                                                fontWeight: 500,
                                                                fontSize: '15px'
                                                            }}>
                                                                {question.content}
                                                            </p>
                                                        </FlexboxGrid.Item>
                                                    </FlexboxGrid>
                                                }
                                            >
                                                <div style={{ padding: '16px 0', borderTop: '1px solid #e5e7eb' }}>
                                                    {/* Essay Instructions */}
                                                    {isEssay && question.instructions && (
                                                        <Message
                                                            type="info"
                                                            style={{ marginBottom: '16px' }}
                                                            header="Hướng dẫn:"
                                                        >
                                                            <div style={{ whiteSpace: 'pre-line' }}>
                                                                {question.instructions}
                                                            </div>
                                                        </Message>
                                                    )}

                                                    {/* Essay Answer Input */}
                                                    {isEssay && !isSubmitted && (
                                                        <div style={{ marginBottom: '16px' }}>
                                                            <label style={{
                                                                display: 'block',
                                                                marginBottom: '8px',
                                                                fontSize: '14px',
                                                                fontWeight: 500
                                                            }}>
                                                                Câu trả lời của bạn:
                                                            </label>
                                                            <Input
                                                                as="textarea"
                                                                rows={6}
                                                                value={userAnswer || ''}
                                                                onChange={(value) => handleAnswerChange(question.id, value)}
                                                                placeholder="Nhập câu trả lời của bạn tại đây..."
                                                                style={{ fontFamily: 'monospace', fontSize: '14px' }}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Essay Answer Display - Submitted */}
                                                    {isEssay && isSubmitted && submissionAnswer && (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                            <Panel
                                                                bordered
                                                                style={{ backgroundColor: '#f3f4f6', padding: '16px' }}
                                                                header={<span style={{ fontSize: '14px', fontWeight: 500 }}>Câu trả lời của bạn:</span>}
                                                            >
                                                                <div style={{
                                                                    whiteSpace: 'pre-wrap',
                                                                    fontFamily: 'monospace',
                                                                    fontSize: '14px',
                                                                    color: '#374151'
                                                                }}>
                                                                    {submissionAnswer.answer}
                                                                </div>
                                                            </Panel>

                                                            {submissionAnswer.feedback && (
                                                                <Message
                                                                    type="success"
                                                                    header="Nhận xét từ giáo viên:"
                                                                    style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e' }}
                                                                >
                                                                    {submissionAnswer.feedback}
                                                                </Message>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Multiple Choice Options */}
                                                    {!isEssay && (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                            <RadioGroup
                                                                name={`question-${question.id}`}
                                                                value={userAnswer || ''}
                                                                onChange={(value) => handleAnswerChange(question.id, value)}
                                                                disabled={isSubmitted}
                                                            >
                                                                {question.options?.map((option, optIndex) => {
                                                                    const isSelected = userAnswer === option.id;
                                                                    const isCorrect = option.isCorrect;
                                                                    const showResult = isSubmitted && submissionAnswer;

                                                                    return (
                                                                        <div
                                                                            key={option.id}
                                                                            style={{
                                                                                padding: '12px',
                                                                                border: '2px solid',
                                                                                borderColor: showResult && isCorrect ? '#22c55e' :
                                                                                    showResult && isSelected && !isCorrect ? '#ef4444' :
                                                                                        isSelected ? '#3b82f6' : '#e5e7eb',
                                                                                borderRadius: '8px',
                                                                                backgroundColor: showResult && isCorrect ? '#f0fdf4' :
                                                                                    showResult && isSelected && !isCorrect ? '#fef2f2' :
                                                                                        isSelected ? '#eff6ff' : 'white',
                                                                                cursor: isSubmitted ? 'not-allowed' : 'pointer',
                                                                                opacity: isSubmitted ? 0.8 : 1,
                                                                                transition: 'all 0.2s ease'
                                                                            }}
                                                                        >
                                                                            <FlexboxGrid align="middle" style={{ gap: '12px' }}>
                                                                                <FlexboxGrid.Item>
                                                                                    <Radio value={option.id} disabled={isSubmitted}>
                                                                                        {option.content}
                                                                                    </Radio>
                                                                                </FlexboxGrid.Item>
                                                                                <FlexboxGrid.Item>
                                                                                    {showResult && isCorrect && (
                                                                                        <CheckRound style={{ color: '#22c55e', fontSize: '20px' }} />
                                                                                    )}
                                                                                    {showResult && isSelected && !isCorrect && (
                                                                                        <Close style={{ color: '#ef4444', fontSize: '20px' }} />
                                                                                    )}
                                                                                </FlexboxGrid.Item>
                                                                            </FlexboxGrid>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </RadioGroup>
                                                        </div>
                                                    )}
                                                </div>
                                            </Panel>
                                        );
                                    })}
                                </div>

                                {/* Submit Section */}
                                {!isSubmitted && (
                                    <>
                                        {submitError && (
                                            <Message
                                                type="error"
                                                header="Lỗi nộp bài"
                                                showIcon
                                                closable
                                                onClose={() => setSubmitError(null)}
                                            >
                                                {submitError}
                                            </Message>
                                        )}
                                        <Panel
                                            bordered
                                            style={{
                                                backgroundColor: '#dbeafe',
                                                borderColor: '#3b82f6',
                                                padding: '24px'
                                            }}
                                        >
                                            <FlexboxGrid justify="space-between" align="middle">
                                                <FlexboxGrid.Item>
                                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>
                                                        Sẵn sàng nộp bài tập?
                                                    </h3>
                                                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                                                        Đảm bảo bạn đã hoàn thành tất cả các câu hỏi.
                                                    </p>
                                                </FlexboxGrid.Item>
                                                <FlexboxGrid.Item>
                                                    <Button
                                                        appearance="primary"
                                                        size="lg"
                                                        startIcon={<Send />}
                                                        onClick={() => setShowConfirmSubmit(true)}
                                                        disabled={answeredCount === 0}
                                                        loading={submitMutation.isPending}
                                                    >
                                                        Nộp bài
                                                    </Button>
                                                </FlexboxGrid.Item>
                                            </FlexboxGrid>
                                        </Panel>
                                    </>
                                )}
                            </div>
                        </Col>

                        {/* Right Column - Summary */}
                        <Col lg={8} md={24} sm={24}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                                {/* Score Summary */}
                                {isSubmitted && submission && (
                                    <AssignmentResults
                                        assignment={assignment}
                                        submission={submission}
                                    />
                                )}

                                {/* Assignment Info */}
                                <Panel bordered header="Thông tin bài tập" style={{ backgroundColor: 'white' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                        <div>
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#666',
                                                margin: '0 0 4px 0'
                                            }}>
                                                Loại bài tập
                                            </p>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {assignment.questions?.some((q: Question) => q.questionTypeId === 'essay') && (
                                                    <Tag color="orange">
                                                        Tự luận ({assignment.questions?.filter((q: Question) => q.questionTypeId === 'essay').length})
                                                    </Tag>
                                                )}
                                                {assignment.questions?.some((q: Question) => q.questionTypeId === 'multiple_choice') && (
                                                    <Tag color="cyan">
                                                        Trắc nghiệm ({assignment.questions?.filter((q: Question) => q.questionTypeId === 'multiple_choice').length})
                                                    </Tag>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#666',
                                                margin: '0 0 4px 0'
                                            }}>
                                                Tổng điểm
                                            </p>
                                            <p style={{
                                                fontSize: '24px',
                                                fontWeight: 'bold',
                                                color: '#333',
                                                margin: 0
                                            }}>
                                                {totalScore} điểm
                                            </p>
                                        </div>

                                        <Divider />

                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '12px'
                                            }}>
                                                <Time style={{ color: '#f59e0b', fontSize: '16px' }} />
                                                <p style={{
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    margin: 0
                                                }}>
                                                    Hạn nộp
                                                </p>
                                            </div>
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#666',
                                                margin: '0 0 4px 0'
                                            }}>
                                                {new Date(assignment.dueDate).toLocaleDateString('vi-VN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                            <p style={{
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                margin: 0,
                                                color: isOverdue ? '#ef4444' :
                                                    daysRemaining <= 1 ? '#f59e0b' : '#22c55e'
                                            }}>
                                                {isOverdue ?
                                                    `Quá hạn ${Math.abs(daysRemaining)} ngày` :
                                                    `Còn ${daysRemaining} ngày`
                                                }
                                            </p>
                                        </div>

                                        {!isSubmitted && (
                                            <Message
                                                type="warning"
                                                style={{ margin: 0 }}
                                                header="⚠️ Chưa nộp bài"
                                            >
                                                <div style={{ fontSize: '12px' }}>
                                                    Bạn chưa nộp bài tập này. Hãy hoàn thành và nộp trước hạn chót.
                                                </div>
                                            </Message>
                                        )}
                                    </div>
                                </Panel>

                                {/* Instructions */}
                                <Panel
                                    bordered
                                    header={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <InfoIcon style={{ fontSize: '16px' }} />
                                            Hướng dẫn
                                        </div>
                                    }
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        fontSize: '14px',
                                        color: '#666'
                                    }}>
                                        <p style={{ margin: 0 }}>• Đọc kỹ từng câu hỏi trước khi trả lời</p>
                                        <p style={{ margin: 0 }}>• Câu trả lời sẽ được tự động lưu trong quá trình làm bài</p>
                                        <p style={{ margin: 0 }}>• Kiểm tra lại câu trả lời của bạn trước khi nộp</p>
                                        <p style={{ margin: 0 }}>• Sau khi nộp, bạn không thể chỉnh sửa câu trả lời</p>
                                        <p style={{ margin: 0 }}>• Giáo viên sẽ chấm bài trong vòng 3-5 ngày</p>
                                    </div>
                                </Panel>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>

            {/* Confirm Submit Modal */}
            <Modal
                open={showConfirmSubmit}
                onClose={() => setShowConfirmSubmit(false)}
                size="sm"
            >
                <Modal.Header>
                    <Modal.Title>Xác nhận nộp bài</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ margin: '0', color: '#666' }}>
                        Bạn có chắc chắn muốn nộp bài tập này? Sau khi nộp, bạn không thể chỉnh sửa câu trả lời.
                    </p>
                    <div style={{ marginTop: '16px' }}>
                        <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
                            Đã trả lời: <strong>{answeredCount}/{totalQuestions}</strong> câu hỏi
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        appearance="subtle"
                        onClick={() => setShowConfirmSubmit(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        appearance="primary"
                        onClick={handleSubmit}
                        loading={submitMutation.isPending}
                    >
                        Xác nhận nộp
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
