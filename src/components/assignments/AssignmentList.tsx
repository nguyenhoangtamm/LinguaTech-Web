import React from 'react';
import {
    Panel,
    Button,
    Badge,
    Progress,
    FlexboxGrid,
    Table,
    Tag,
    IconButton,
    Placeholder,
    Loader,
    Message,
} from 'rsuite';
import {
    Eye,
    Edit,
    Time,
    CheckRound,
    CloseRound,
    FileText,
    Award,
    Calendar
} from '@rsuite/icons';
import Link from 'next/link';
import { Assignment, UserSubmission } from '@/apiRequests/assignment';

const { Column, HeaderCell, Cell } = Table;

interface AssignmentListProps {
    assignments: Assignment[];
    submissions: Record<string, UserSubmission>;
    loading?: boolean;
    courseId: string;
    lessonId: string;
    onViewAssignment?: (assignmentId: string) => void;
}

const AssignmentList: React.FC<AssignmentListProps> = ({
    assignments,
    submissions,
    loading = false,
    courseId,
    lessonId,
    onViewAssignment,
}) => {
    const getAssignmentStatus = (assignment: Assignment, submission?: UserSubmission) => {
        if (!submission) {
            const dueDate = new Date(assignment.dueDate);
            const now = new Date();
            return now > dueDate ? 'overdue' : 'not_started';
        }
        return submission.status;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'graded': return 'green';
            case 'submitted': return 'blue';
            case 'draft': return 'yellow';
            case 'overdue': return 'red';
            case 'not_started': return 'gray';
            default: return 'gray';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'graded': return 'Đã chấm';
            case 'submitted': return 'Đã nộp';
            case 'draft': return 'Bản nháp';
            case 'overdue': return 'Quá hạn';
            case 'not_started': return 'Chưa bắt đầu';
            default: return 'Không xác định';
        }
    };

    const formatDueDate = (dueDate: string) => {
        const date = new Date(dueDate);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `Quá hạn ${Math.abs(diffDays)} ngày`;
        } else if (diffDays === 0) {
            return 'Hết hạn hôm nay';
        } else if (diffDays === 1) {
            return 'Hết hạn ngày mai';
        } else {
            return `Còn ${diffDays} ngày`;
        }
    };

    const getQuestionTypeStats = (assignment: Assignment) => {
        const essayCount = assignment.questions.filter(q => q.questionTypeId === 'essay').length;
        const mcCount = assignment.questions.filter(q => q.questionTypeId === 'multiple_choice').length;
        return { essayCount, mcCount, total: assignment.questions.length };
    };

    if (loading) {
        return (
            <Panel bordered style={{ backgroundColor: 'white' }}>
                <Placeholder.Paragraph rows={8} />
            </Panel>
        );
    }

    if (!assignments.length) {
        return (
            <Panel bordered style={{ backgroundColor: 'white', textAlign: 'center', padding: '40px' }}>
                <FileText style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                <h3 style={{ color: '#666', marginBottom: '8px' }}>Chưa có bài tập nào</h3>
                <p style={{ color: '#999', margin: 0 }}>
                    Bài học này chưa có bài tập. Hãy quay lại sau hoặc liên hệ giáo viên.
                </p>
            </Panel>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Summary Stats */}
            <Panel bordered style={{ backgroundColor: 'white' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>
                    Tổng quan bài tập
                </h3>
                <FlexboxGrid justify="space-around">
                    <FlexboxGrid.Item style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                            {assignments.length}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>Tổng bài tập</div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>
                            {Object.values(submissions).filter(s => s.status === 'graded' || s.status === 'submitted').length}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>Đã hoàn thành</div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                            {Object.values(submissions).filter(s => s.status === 'draft').length}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>Đang làm</div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                            {assignments.filter(a => {
                                const submission = submissions[a.id];
                                return getAssignmentStatus(a, submission) === 'overdue';
                            }).length}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>Quá hạn</div>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Panel>

            {/* Assignments Table */}
            <Panel bordered style={{ backgroundColor: 'white' }}>
                <Table
                    height={600}
                    data={assignments}
                    rowHeight={120}
                    hover
                    wordWrap
                >
                    <Column width={60} align="center" fixed>
                        <HeaderCell>#</HeaderCell>
                        <Cell>
                            {(rowData, rowIndex) => rowIndex! + 1}
                        </Cell>
                    </Column>

                    <Column width={300} resizable>
                        <HeaderCell>Bài tập</HeaderCell>
                        <Cell>
                            {(rowData: Assignment) => (
                                <div style={{ padding: '8px 0' }}>
                                    <h4 style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        lineHeight: '1.4'
                                    }}>
                                        {rowData.title}
                                    </h4>
                                    <p style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '14px',
                                        color: '#666',
                                        lineHeight: '1.4',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {rowData.description}
                                    </p>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                        {(() => {
                                            const stats = getQuestionTypeStats(rowData);
                                            return (
                                                <>
                                                    <Tag size="sm" color="blue">{stats.total} câu</Tag>
                                                    {stats.essayCount > 0 && (
                                                        <Tag size="sm" color="orange">Tự luận: {stats.essayCount}</Tag>
                                                    )}
                                                    {stats.mcCount > 0 && (
                                                        <Tag size="sm" color="cyan">Trắc nghiệm: {stats.mcCount}</Tag>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}
                        </Cell>
                    </Column>

                    <Column width={120} align="center">
                        <HeaderCell>Điểm số</HeaderCell>
                        <Cell>
                            {(rowData: Assignment) => (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                                        {rowData.totalScore}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>điểm</div>
                                </div>
                            )}
                        </Cell>
                    </Column>

                    <Column width={150} align="center">
                        <HeaderCell>Hạn nộp</HeaderCell>
                        <Cell>
                            {(rowData: Assignment) => {
                                const dueDate = new Date(rowData.dueDate);
                                const isOverdue = dueDate < new Date();
                                return (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                                            {dueDate.toLocaleDateString('vi-VN')}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: isOverdue ? '#ef4444' : '#666',
                                            fontWeight: isOverdue ? 'bold' : 'normal'
                                        }}>
                                            {formatDueDate(rowData.dueDate)}
                                        </div>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>

                    <Column width={120} align="center">
                        <HeaderCell>Trạng thái</HeaderCell>
                        <Cell>
                            {(rowData: Assignment) => {
                                const submission = submissions[rowData.id];
                                const status = getAssignmentStatus(rowData, submission);
                                return (
                                    <Badge
                                        color={getStatusColor(status)}
                                        content={getStatusText(status)}
                                    />
                                );
                            }}
                        </Cell>
                    </Column>

                    <Column width={150} align="center">
                        <HeaderCell>Kết quả</HeaderCell>
                        <Cell>
                            {(rowData: Assignment) => {
                                const submission = submissions[rowData.id];
                                if (!submission || !submission.score) {
                                    return <span style={{ color: '#999', fontSize: '14px' }}>Chưa có</span>;
                                }

                                const percentage = (submission.score / rowData.totalScore) * 100;
                                return (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                                            {submission.score}/{rowData.totalScore}
                                        </div>
                                        <Progress.Line
                                            percent={percentage}
                                            strokeColor={percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#f59e0b' : '#ef4444'}
                                            showInfo={false}
                                            strokeWidth={6}
                                        />
                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                            {percentage.toFixed(0)}%
                                        </div>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>

                    <Column width={100} align="center" fixed="right">
                        <HeaderCell>Thao tác</HeaderCell>
                        <Cell>
                            {(rowData: Assignment) => (
                                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                    <IconButton
                                        icon={<Eye />}
                                        size="sm"
                                        appearance="primary"
                                        as={Link}
                                        href={`/courses/detail/${courseId}/lessons/${lessonId}/assignments/${rowData.id}`}
                                        title="Xem chi tiết"
                                    />
                                </div>
                            )}
                        </Cell>
                    </Column>
                </Table>
            </Panel>
        </div>
    );
};

export default AssignmentList;