import React from 'react';
import {
    Panel,
    Progress,
    Rate,
    Badge,
    Tag,
    Message,
    Divider,
    Timeline,
    FlexboxGrid,
    Placeholder,
} from 'rsuite';
import { CheckRound } from '@rsuite/icons';
import { X as CloseRound, Trophy as Award } from 'lucide-react';
import { Assignment, UserSubmission, Question, SubmissionAnswer } from '@/apiRequests/assignment';

interface AssignmentResultsProps {
    assignment: Assignment;
    submission: UserSubmission;
}

const AssignmentResults: React.FC<AssignmentResultsProps> = ({ assignment, submission }) => {
    const totalScore = assignment.questions.reduce((sum, q) => sum + q.score, 0);
    const userScore = submission.score || 0;
    const completionPercentage = (userScore / totalScore) * 100;

    // Categorize questions by type and result
    const questionResults = assignment.questions.map(question => {
        const answer = submission.answers?.find(a => a.questionId === question.id);
        return {
            question,
            answer,
            isCorrect: answer?.isCorrect ?? false,
            score: answer?.score ?? 0,
        };
    });

    const correctAnswers = questionResults.filter(r => r.isCorrect).length;
    const totalQuestions = assignment.questions.length;

    const getPerformanceColor = (percentage: number) => {
        if (percentage >= 90) return 'green';
        if (percentage >= 80) return 'blue';
        if (percentage >= 70) return 'yellow';
        if (percentage >= 60) return 'orange';
        return 'red';
    };

    const getPerformanceMessage = (percentage: number) => {
        if (percentage >= 90) return 'Xuất sắc! Bạn đã làm rất tốt.';
        if (percentage >= 80) return 'Tốt! Bạn đã nắm vững kiến thức.';
        if (percentage >= 70) return 'Khá! Bạn cần ôn tập thêm một chút.';
        if (percentage >= 60) return 'Trung bình! Hãy cố gắng học tập thêm.';
        return 'Cần cải thiện! Hãy xem lại bài học và làm lại.';
    };

    const getGradeRating = (percentage: number) => {
        return Math.round((percentage / 100) * 5);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Overall Score Summary */}
            <Panel
                bordered
                header={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Award style={{ color: '#f59e0b', fontSize: '20px' }} />
                        <span style={{ fontSize: '18px', fontWeight: 600 }}>Kết quả tổng quan</span>
                    </div>
                }
                style={{ backgroundColor: 'white' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: getPerformanceColor(completionPercentage) === 'green' ? '#22c55e' :
                            getPerformanceColor(completionPercentage) === 'blue' ? '#3b82f6' :
                                getPerformanceColor(completionPercentage) === 'yellow' ? '#eab308' :
                                    getPerformanceColor(completionPercentage) === 'orange' ? '#f59e0b' : '#ef4444',
                        marginBottom: '8px'
                    }}>
                        {userScore}/{totalScore}
                    </div>
                    <div style={{ fontSize: '16px', color: '#666', marginBottom: '12px' }}>
                        Đạt {completionPercentage.toFixed(1)}% tổng điểm
                    </div>

                    {/* Circular Progress */}
                    <div style={{ marginBottom: '16px' }}>
                        <Progress.Circle
                            percent={completionPercentage}
                            strokeColor={
                                getPerformanceColor(completionPercentage) === 'green' ? '#22c55e' :
                                    getPerformanceColor(completionPercentage) === 'blue' ? '#3b82f6' :
                                        getPerformanceColor(completionPercentage) === 'yellow' ? '#eab308' :
                                            getPerformanceColor(completionPercentage) === 'orange' ? '#f59e0b' : '#ef4444'
                            }
                            strokeWidth={8}
                            showInfo
                            style={{ marginBottom: '16px' }}
                        />
                    </div>

                    {/* Performance Rating */}
                    <Rate
                        readOnly
                        value={getGradeRating(completionPercentage)}
                        size="lg"
                        color={getPerformanceColor(completionPercentage) === 'green' ? '#22c55e' : undefined}
                        style={{ marginBottom: '12px' }}
                    />

                    <Message
                        type={getPerformanceColor(completionPercentage) as any}
                        style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}
                    >
                        {getPerformanceMessage(completionPercentage)}
                    </Message>
                </div>

                {/* Quick Stats */}
                <FlexboxGrid justify="space-around" style={{ marginTop: '20px' }}>
                    <FlexboxGrid.Item style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>
                            {correctAnswers}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>Câu đúng</div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                            {totalQuestions - correctAnswers}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>Câu sai</div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                            {((correctAnswers / totalQuestions) * 100).toFixed(0)}%
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>Độ chính xác</div>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Panel>

            {/* Detailed Question Results */}
            <Panel
                bordered
                header="Chi tiết kết quả từng câu"
                style={{ backgroundColor: 'white' }}
            >
                <Timeline style={{ marginTop: '16px' }}>
                    {questionResults.map((result, index) => (
                        <Timeline.Item
                            key={result.question.id}
                            dot={
                                result.isCorrect ?
                                    <CheckRound style={{ color: '#22c55e', fontSize: '16px' }} /> :
                                    <CloseRound style={{ color: '#ef4444', fontSize: '16px' }} />
                            }
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <FlexboxGrid justify="space-between" align="middle" style={{ marginBottom: '8px' }}>
                                    <FlexboxGrid.Item>
                                        <span style={{ fontWeight: 600, fontSize: '16px' }}>
                                            Câu {index + 1}
                                        </span>
                                        <Tag
                                            color={result.question.questionTypeId === 'essay' ? 'orange' : 'cyan'}
                                            style={{ marginLeft: '8px' }}
                                        >
                                            {result.question.questionTypeId === 'essay' ? 'Tự luận' : 'Trắc nghiệm'}
                                        </Tag>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item>
                                        <Tag color={result.isCorrect ? 'green' : 'red'}>
                                            {result.score}/{result.question.score} điểm
                                        </Tag>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>

                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    marginBottom: '8px'
                                }}>
                                    <p style={{ margin: 0, fontWeight: 500, color: '#333' }}>
                                        {result.question.content}
                                    </p>
                                </div>

                                {/* Show user's answer */}
                                {result.answer && (
                                    <div style={{
                                        padding: '12px',
                                        backgroundColor: result.isCorrect ? '#f0fdf4' : '#fef2f2',
                                        borderRadius: '8px',
                                        border: `1px solid ${result.isCorrect ? '#bbf7d0' : '#fecaca'}`
                                    }}>
                                        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                                            Câu trả lời của bạn:
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#333' }}>
                                            {result.question.questionTypeId === 'essay' ?
                                                result.answer.answer :
                                                result.question.options?.find(opt => opt.id === result.answer?.selectedOptionId)?.content
                                            }
                                        </div>
                                    </div>
                                )}

                                {/* Show correct answer for multiple choice */}
                                {result.question.questionTypeId === 'multiple_choice' && !result.isCorrect && (
                                    <div style={{
                                        padding: '12px',
                                        backgroundColor: '#f0fdf4',
                                        borderRadius: '8px',
                                        border: '1px solid #bbf7d0',
                                        marginTop: '8px'
                                    }}>
                                        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px', color: '#166534' }}>
                                            Đáp án đúng:
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#166534' }}>
                                            {result.question.options?.find(opt => opt.isCorrect)?.content}
                                        </div>
                                    </div>
                                )}

                                {/* Teacher feedback */}
                                {result.answer?.feedback && (
                                    <div style={{
                                        padding: '12px',
                                        backgroundColor: '#eff6ff',
                                        borderRadius: '8px',
                                        border: '1px solid #bfdbfe',
                                        marginTop: '8px'
                                    }}>
                                        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px', color: '#1e40af' }}>
                                            Nhận xét từ giáo viên:
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#1e40af' }}>
                                            {result.answer.feedback}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Panel>

            {/* Submission Info */}
            <Panel bordered header="Thông tin nộp bài" style={{ backgroundColor: 'white' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {submission.submittedAt && (
                        <div>
                            <span style={{ fontWeight: 500, color: '#666' }}>Thời gian nộp: </span>
                            <span>{new Date(submission.submittedAt).toLocaleString('vi-VN')}</span>
                        </div>
                    )}
                    {submission.gradedAt && (
                        <div>
                            <span style={{ fontWeight: 500, color: '#666' }}>Thời gian chấm: </span>
                            <span>{new Date(submission.gradedAt).toLocaleString('vi-VN')}</span>
                        </div>
                    )}
                    <div>
                        <span style={{ fontWeight: 500, color: '#666' }}>Trạng thái: </span>
                        <Badge
                            color={
                                submission.status === 'graded' ? 'green' :
                                    submission.status === 'submitted' ? 'blue' :
                                        submission.status === 'overdue' ? 'red' : 'orange'
                            }
                            content={
                                submission.status === 'graded' ? 'Đã chấm điểm' :
                                    submission.status === 'submitted' ? 'Đã nộp' :
                                        submission.status === 'overdue' ? 'Quá hạn' : 'Bản nháp'
                            }
                        />
                    </div>
                    {submission.feedback && (
                        <div style={{ marginTop: '8px' }}>
                            <Message type="info" header="Nhận xét chung từ giáo viên:">
                                {submission.feedback}
                            </Message>
                        </div>
                    )}
                </div>
            </Panel>
        </div>
    );
};

export default AssignmentResults;