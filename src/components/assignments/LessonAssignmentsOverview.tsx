import React from 'react';
import {
    Panel,
    List,
    Badge,
    Button,
    FlexboxGrid,
    Progress,
    Tag,
    Placeholder,
    Message,
} from 'rsuite';
import {
    DocPass,
    Time,
    CheckRound,
    Edit,
    Visible,
} from '@rsuite/icons';
import Link from 'next/link';
import { AssignmentDetailType } from '@/schemaValidations/assignment.schema';

interface LessonAssignmentsOverviewProps {
    assignments: AssignmentDetailType[];
    loading?: boolean;
    error?: any;
    courseId: string | number;
    lessonId: string | number;
}

const LessonAssignmentsOverview: React.FC<LessonAssignmentsOverviewProps> = ({
    assignments = [],
    loading = false,
    error,
    courseId,
    lessonId,
}) => {
    const getStatusColor = (assignment: AssignmentDetailType): any => {
        // Since there's no submission tracking, check if it has createdDate (proxy for completion)
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);

        if (now > dueDate) return 'red';

        const timeDiff = dueDate.getTime() - now.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft <= 1) return 'orange';
        if (daysLeft <= 3) return 'yellow';
        return 'blue';
    };

    const getStatusText = (assignment: AssignmentDetailType) => {
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);

        if (now > dueDate) return 'Quá hạn';

        const timeDiff = dueDate.getTime() - now.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft === 0) return 'Hết hạn hôm nay';
        if (daysLeft === 1) return 'Hết hạn ngày mai';
        return `Còn ${daysLeft} ngày`;
    };

    const getDifficultyLevel = (assignment: AssignmentDetailType) => {
        const questionCount = assignment.questions?.length || 0;
        const essayCount = assignment.questions?.filter((q: any) => q.questionTypeId === 2).length || 0;

        if (questionCount <= 3) return { level: 'Dễ', color: 'green' };
        if (questionCount <= 7) return { level: 'Trung bình', color: 'yellow' };
        if (essayCount >= 2) return { level: 'Khó', color: 'red' };
        return { level: 'Trung bình', color: 'blue' };
    };

    if (loading) {
        return (
            <Panel bordered style={{ backgroundColor: 'white' }} header="Bài tập bài học">
                <Placeholder.Paragraph rows={5} />
            </Panel>
        );
    }

    if (error) {
        return (
            <Panel bordered style={{ backgroundColor: 'white' }} header="Bài tập bài học">
                <Message type="error" header="Lỗi tải dữ liệu">
                    Không thể tải danh sách bài tập. Vui lòng thử lại sau.
                </Message>
            </Panel>
        );
    }

    if (assignments.length === 0) {
        return (
            <Panel bordered style={{ backgroundColor: 'white' }} header="Bài tập bài học">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <DocPass style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                    <h5 style={{ color: '#666', marginBottom: '8px' }}>Chưa có bài tập</h5>
                    <p style={{ color: '#999', margin: 0 }}>
                        Bài học này chưa có bài tập nào.
                    </p>
                </div>
            </Panel>
        );
    }

    return (
        <Panel
            bordered
            style={{ backgroundColor: 'white' }}
            header={
                <FlexboxGrid justify="space-between" align="middle">
                    <FlexboxGrid.Item>
                        <h4 style={{ margin: 0 }}>Bài tập bài học</h4>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                        <Badge content={assignments.length} />
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            }
        >
            <div style={{ padding: 0 }}>
                <List bordered={false}>
                    {assignments.map((assignment) => {
                        const difficulty = getDifficultyLevel(assignment);
                        const questionCount = assignment.questions?.length || 0;
                        const essayCount = assignment.questions?.filter((q: any) => q.questionTypeId === 2).length || 0;
                        const mcCount = assignment.questions?.filter((q: any) => q.questionTypeId === 1).length || 0;

                        return (
                            <List.Item key={assignment.id} style={{ padding: '16px' }}>
                                <FlexboxGrid justify="space-between" align="top">
                                    <FlexboxGrid.Item style={{ flex: 1 }}>
                                        <div style={{ marginBottom: '8px' }}>
                                            <h5 style={{
                                                margin: '0 0 4px 0',
                                                fontSize: '16px',
                                                fontWeight: 600,
                                                lineHeight: '1.4'
                                            }}>
                                                {assignment.title}
                                            </h5>
                                            <p style={{
                                                margin: '0 0 8px 0',
                                                fontSize: '14px',
                                                color: '#666',
                                                lineHeight: '1.4'
                                            }}>
                                                {assignment.description}
                                            </p>
                                        </div>

                                        {/* Assignment Stats */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                            marginBottom: '8px',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Tag color="blue" size="sm">
                                                {questionCount} câu hỏi
                                            </Tag>
                                            {essayCount > 0 && (
                                                <Tag color="orange" size="sm">
                                                    {essayCount} tự luận
                                                </Tag>
                                            )}
                                            {mcCount > 0 && (
                                                <Tag color="cyan" size="sm">
                                                    {mcCount} trắc nghiệm
                                                </Tag>
                                            )}
                                            <Tag color={difficulty.color as any} size="sm">
                                                {difficulty.level}
                                            </Tag>
                                        </div>

                                        {/* Due Date */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '12px',
                                            color: '#666'
                                        }}>
                                            <Time style={{ fontSize: '12px' }} />
                                            <span>
                                                Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </FlexboxGrid.Item>

                                    <FlexboxGrid.Item style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: '8px',
                                        minWidth: '120px'
                                    }}>
                                        {/* Status Badge */}
                                        <Badge
                                            color={getStatusColor(assignment)}
                                            content={getStatusText(assignment)}
                                        />

                                        {/* Score if completed */}
                                        {false && (
                                            <div style={{ textAlign: 'center' }}>
                                                <CheckRound style={{ color: '#f59e0b', fontSize: '16px', marginBottom: '2px' }} />
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    Điểm: {assignment.maxScore}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Button */}
                                        <Button
                                            size="sm"
                                            appearance="primary"
                                            as={Link}
                                            href={`/courses/detail/${courseId}/lessons/${lessonId}/assignments/${assignment.id}`}
                                            startIcon={<Edit />}
                                        >
                                            {'Làm bài'}
                                        </Button>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                        );
                    })}
                </List>
            </div>
        </Panel>
    );
};

export default LessonAssignmentsOverview;