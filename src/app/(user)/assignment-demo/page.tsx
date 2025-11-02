"use client";

import React, { useState } from 'react';
import {
    Panel,
    Button,
    Grid,
    Row,
    Col,
    Nav,
    Divider,
    Container,
    Content,
    Header,
} from 'rsuite';
import AssignmentList from '@/components/assignments/AssignmentList';
import AssignmentResults from '@/components/assignments/AssignmentResults';
import { Assignment, UserSubmission } from '@/apiRequests/assignment';

// Mock data for demo
const mockAssignments: Assignment[] = [
    {
        id: '1',
        title: 'Bài tập React Hooks',
        description: 'Thực hành với useState, useEffect và custom hooks trong React',
        dueDate: '2024-11-15T23:59:59',
        completionDate: null,
        isDeleted: false,
        lessonId: 'lesson1',
        createdAt: '2024-10-01T10:00:00',
        updatedAt: '2024-10-01T10:00:00',
        totalScore: 100,
        questions: [
            {
                id: 'q1',
                content: 'Giải thích sự khác biệt giữa useState và useRef',
                score: 25,
                createdAt: '2024-10-01T10:00:00',
                updatedAt: '2024-10-01T10:00:00',
                isDeleted: false,
                assignmentId: '1',
                questionTypeId: 'essay',
                instructions: 'Viết ít nhất 200 từ và cung cấp ví dụ cụ thể',
            },
            {
                id: 'q2',
                content: 'useEffect được gọi khi nào?',
                score: 25,
                createdAt: '2024-10-01T10:00:00',
                updatedAt: '2024-10-01T10:00:00',
                isDeleted: false,
                assignmentId: '1',
                questionTypeId: 'multiple_choice',
                options: [
                    { id: 'opt1', content: 'Trước khi component render', isCorrect: false, questionId: 'q2' },
                    { id: 'opt2', content: 'Sau khi component render', isCorrect: true, questionId: 'q2' },
                    { id: 'opt3', content: 'Trong quá trình render', isCorrect: false, questionId: 'q2' },
                    { id: 'opt4', content: 'Khi component unmount', isCorrect: false, questionId: 'q2' },
                ],
            },
            {
                id: 'q3',
                content: 'Dependency array trong useEffect có tác dụng gì?',
                score: 25,
                createdAt: '2024-10-01T10:00:00',
                updatedAt: '2024-10-01T10:00:00',
                isDeleted: false,
                assignmentId: '1',
                questionTypeId: 'multiple_choice',
                options: [
                    { id: 'opt1', content: 'Kiểm soát khi nào effect được chạy', isCorrect: true, questionId: 'q3' },
                    { id: 'opt2', content: 'Lưu trữ dữ liệu', isCorrect: false, questionId: 'q3' },
                    { id: 'opt3', content: 'Tạo side effect', isCorrect: false, questionId: 'q3' },
                    { id: 'opt4', content: 'Không có tác dụng gì', isCorrect: false, questionId: 'q3' },
                ],
            },
            {
                id: 'q4',
                content: 'Tạo một custom hook để quản lý localStorage',
                score: 25,
                createdAt: '2024-10-01T10:00:00',
                updatedAt: '2024-10-01T10:00:00',
                isDeleted: false,
                assignmentId: '1',
                questionTypeId: 'essay',
                instructions: 'Hook phải hỗ trợ get, set và remove giá trị từ localStorage',
            },
        ],
    },
    {
        id: '2',
        title: 'Context API và State Management',
        description: 'Xây dựng ứng dụng sử dụng Context API để quản lý state global',
        dueDate: '2024-11-20T23:59:59',
        completionDate: null,
        isDeleted: false,
        lessonId: 'lesson1',
        createdAt: '2024-10-05T10:00:00',
        updatedAt: '2024-10-05T10:00:00',
        totalScore: 80,
        questions: [
            {
                id: 'q5',
                content: 'Context API được sử dụng khi nào?',
                score: 20,
                createdAt: '2024-10-05T10:00:00',
                updatedAt: '2024-10-05T10:00:00',
                isDeleted: false,
                assignmentId: '2',
                questionTypeId: 'multiple_choice',
                options: [
                    { id: 'opt1', content: 'Khi cần chia sẻ state giữa nhiều component', isCorrect: true, questionId: 'q5' },
                    { id: 'opt2', content: 'Khi cần lưu trữ dữ liệu local', isCorrect: false, questionId: 'q5' },
                    { id: 'opt3', content: 'Khi cần gọi API', isCorrect: false, questionId: 'q5' },
                    { id: 'opt4', content: 'Khi cần styling component', isCorrect: false, questionId: 'q5' },
                ],
            },
            {
                id: 'q6',
                content: 'Xây dựng một ứng dụng todo list sử dụng Context API',
                score: 60,
                createdAt: '2024-10-05T10:00:00',
                updatedAt: '2024-10-05T10:00:00',
                isDeleted: false,
                assignmentId: '2',
                questionTypeId: 'essay',
                instructions: 'Ứng dụng phải có chức năng thêm, sửa, xóa và đánh dấu hoàn thành todo',
            },
        ],
    },
];

const mockSubmissions: Record<string, UserSubmission> = {
    '1': {
        id: 'sub1',
        assignmentId: '1',
        userId: 'user1',
        score: 85,
        submittedAt: '2024-11-10T14:30:00',
        gradedAt: '2024-11-12T09:15:00',
        status: 'graded',
        answers: [
            {
                id: 'ans1',
                questionId: 'q1',
                answer: 'useState được sử dụng để quản lý state trong functional component, trong khi useRef được sử dụng để tham chiếu đến DOM element hoặc lưu trữ giá trị mutable không trigger re-render. useState trigger re-render khi state thay đổi, còn useRef thì không.',
                isCorrect: true,
                score: 23,
                feedback: 'Câu trả lời tốt, có thể thêm ví dụ cụ thể để minh họa rõ hơn.',
            },
            {
                id: 'ans2',
                questionId: 'q2',
                answer: '',
                selectedOptionId: 'opt2',
                isCorrect: true,
                score: 25,
            },
            {
                id: 'ans3',
                questionId: 'q3',
                answer: '',
                selectedOptionId: 'opt1',
                isCorrect: true,
                score: 25,
            },
            {
                id: 'ans4',
                questionId: 'q4',
                answer: `function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}`,
                isCorrect: true,
                score: 12,
                feedback: 'Code tốt, nhưng thiếu chức năng remove. Có thể thêm error handling tốt hơn.',
            },
        ],
        feedback: 'Bài làm tổng thể rất tốt! Bạn đã nắm vững các khái niệm cơ bản về React Hooks.',
    },
    '2': {
        id: 'sub2',
        assignmentId: '2',
        userId: 'user1',
        score: null,
        submittedAt: null,
        gradedAt: null,
        status: 'draft',
        answers: [
            {
                id: 'ans5',
                questionId: 'q5',
                answer: '',
                selectedOptionId: 'opt1',
                isCorrect: true,
                score: 20,
            },
        ],
    },
};

export default function AssignmentDemoPage() {
    const [activeTab, setActiveTab] = useState('list');

    return (
        <Container style={{ padding: '24px' }}>
            <Header style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 600 }}>
                    Demo Trang Bài Tập với RSuite
                </h1>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    Demo các component assignment được xây dựng với RSuite
                </p>
            </Header>

            <Content>
                <Panel bordered style={{ marginBottom: '24px' }}>
                    <Nav appearance="tabs" activeKey={activeTab} onSelect={setActiveTab}>
                        <Nav.Item eventKey="list">Danh sách bài tập</Nav.Item>
                        <Nav.Item eventKey="results">Kết quả chi tiết</Nav.Item>
                    </Nav>
                </Panel>

                {activeTab === 'list' && (
                    <AssignmentList
                        assignments={mockAssignments}
                        submissions={mockSubmissions}
                        courseId="1"
                        lessonId="1"
                    />
                )}

                {activeTab === 'results' && (
                    <Grid fluid>
                        <Row>
                            <Col xs={24} lg={16} lgOffset={4}>
                                <AssignmentResults
                                    assignment={mockAssignments[0]}
                                    submission={mockSubmissions['1']}
                                />
                            </Col>
                        </Row>
                    </Grid>
                )}
            </Content>
        </Container>
    );
}