// Mock assignments data based on database structure
export const mockAssignments = [
    {
        id: "assign1",
        title: "Bài tập HOC và Render Props",
        description:
            "Tạo Higher-Order Component và sử dụng Render Props pattern",
        dueDate: new Date("2025-10-30"),
        completionDate: null,
        isDeleted: false,
        lessonId: "l1",
        questions: [
            {
                id: "q1",
                content:
                    "Tạo một Higher-Order Component (HOC) để thêm loading state cho một component. HOC này phải:",
                score: 15,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
                assignmentId: "assign1",
                questionTypeId: "essay",
                instructions: `
1. Nhận vào một component bất kỳ
2. Thêm một prop 'isLoading' để hiển thị loading state
3. Hiển thị một spinner hoặc message khi loading
4. Cung cấp một ví dụ sử dụng HOC này`,
            },
            {
                id: "q2",
                content: "Render Props là gì?",
                score: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
                assignmentId: "assign1",
                questionTypeId: "multiple_choice",
                options: [
                    {
                        id: "opt1",
                        content:
                            "Một pattern sử dụng function props để chia sẻ state logic",
                        isCorrect: true,
                    },
                    {
                        id: "opt2",
                        content: "Một cách để render props object",
                        isCorrect: false,
                    },
                    {
                        id: "opt3",
                        content: "Một thư viện React nổi tiếng",
                        isCorrect: false,
                    },
                    {
                        id: "opt4",
                        content: "Một hook mới trong React 18",
                        isCorrect: false,
                    },
                ],
            },
            {
                id: "q3",
                content: "Lợi ích chính của Higher-Order Components là gì?",
                score: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
                assignmentId: "assign1",
                questionTypeId: "multiple_choice",
                options: [
                    {
                        id: "opt1",
                        content: "Tái sử dụng logic giữa các components",
                        isCorrect: true,
                    },
                    {
                        id: "opt2",
                        content: "Giảm kích thước file",
                        isCorrect: false,
                    },
                    {
                        id: "opt3",
                        content: "Tăng tốc độ render",
                        isCorrect: false,
                    },
                    {
                        id: "opt4",
                        content: "Thay thế props",
                        isCorrect: false,
                    },
                ],
            },
        ],
    },
    {
        id: "assign2",
        title: "Thực hành Context API",
        description: "Xây dựng ứng dụng sử dụng Context API để chia sẻ state",
        dueDate: new Date("2025-11-05"),
        completionDate: null,
        isDeleted: false,
        lessonId: "l1",
        questions: [
            {
                id: "q4",
                content:
                    "Viết một ứng dụng sử dụng Context API để quản lý theme (light/dark mode). Yêu cầu:",
                score: 20,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
                assignmentId: "assign2",
                questionTypeId: "essay",
                instructions: `
1. Tạo ThemeContext với các giá trị: 'light' và 'dark'
2. Tạo ThemeProvider component
3. Tạo component Button thay đổi theme
4. Tạo component hiển thị theme hiện tại
5. Ứng dụng phải lưu theme vào localStorage
6. Theme phải persist khi reload trang`,
            },
            {
                id: "q5",
                content: "Context API được sử dụng để làm gì?",
                score: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
                assignmentId: "assign2",
                questionTypeId: "multiple_choice",
                options: [
                    {
                        id: "opt1",
                        content:
                            "Chia sẻ data giữa các components mà không cần prop drilling",
                        isCorrect: true,
                    },
                    {
                        id: "opt2",
                        content: "Thay thế Redux hoàn toàn",
                        isCorrect: false,
                    },
                    {
                        id: "opt3",
                        content: "Tạo global variables",
                        isCorrect: false,
                    },
                    {
                        id: "opt4",
                        content: "Lưu trữ dữ liệu vĩnh viễn",
                        isCorrect: false,
                    },
                ],
            },
        ],
    },
    {
        id: "assign3",
        title: "Quiz nhanh về Patterns",
        description: "Trắc nghiệm các pattern nâng cao trong React",
        dueDate: new Date("2025-10-28"),
        completionDate: null,
        isDeleted: false,
        lessonId: "l1",
        questions: [
            {
                id: "q6",
                content: "Compound Components là gì?",
                score: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
                assignmentId: "assign3",
                questionTypeId: "multiple_choice",
                options: [
                    {
                        id: "opt1",
                        content:
                            "Một nhóm các components có liên quan kết hợp với nhau để tạo một API linh hoạt",
                        isCorrect: true,
                    },
                    {
                        id: "opt2",
                        content: "Một component lớn được chia nhỏ",
                        isCorrect: false,
                    },
                    {
                        id: "opt3",
                        content: "Nested components",
                        isCorrect: false,
                    },
                    {
                        id: "opt4",
                        content: "Một component với nhiều props",
                        isCorrect: false,
                    },
                ],
            },
            {
                id: "q7",
                content: "useCallback hook được sử dụng để làm gì?",
                score: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
                assignmentId: "assign3",
                questionTypeId: "multiple_choice",
                options: [
                    {
                        id: "opt1",
                        content:
                            "Memoize một function để tránh tạo lại nó trong mỗi render",
                        isCorrect: true,
                    },
                    {
                        id: "opt2",
                        content: "Gọi một callback sau mỗi render",
                        isCorrect: false,
                    },
                    {
                        id: "opt3",
                        content: "Xóa một callback",
                        isCorrect: false,
                    },
                    {
                        id: "opt4",
                        content: "Tạo một async function",
                        isCorrect: false,
                    },
                ],
            },
            {
                id: "q8",
                content: "React.memo được sử dụng để làm gì?",
                score: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false,
                assignmentId: "assign3",
                questionTypeId: "multiple_choice",
                options: [
                    {
                        id: "opt1",
                        content:
                            "Memoize một component để tránh re-render nếu props không thay đổi",
                        isCorrect: true,
                    },
                    {
                        id: "opt2",
                        content: "Lưu trữ dữ liệu component",
                        isCorrect: false,
                    },
                    {
                        id: "opt3",
                        content: "Tạo context",
                        isCorrect: false,
                    },
                    {
                        id: "opt4",
                        content: "Debug component",
                        isCorrect: false,
                    },
                ],
            },
        ],
    },
];

// Mock user submission data
export const mockUserSubmissions = {
    assign1: {
        id: "sub1",
        assignmentId: "assign1",
        userId: "user1",
        status: "submitted",
        submittedAt: new Date("2025-10-27"),
        score: 20,
        totalScore: 25,
        answers: [
            {
                questionId: "q1",
                answer: `
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div className="flex items-center justify-center p-4">
        <div className="animate-spin">Loading...</div>
      </div>;
    }
    return <WrappedComponent {...props} />;
  };
}
                `,
                score: 10,
                feedback: "Tốt, nhưng cần thêm error boundary",
            },
            {
                questionId: "q2",
                isCorrect: true,
                score: 5,
            },
            {
                questionId: "q3",
                isCorrect: true,
                score: 5,
            },
        ],
    },
    assign2: {
        id: "sub2",
        assignmentId: "assign2",
        userId: "user1",
        status: "in_progress",
        submittedAt: null,
        score: 0,
        totalScore: 25,
        answers: [],
    },
    assign3: {
        id: "sub3",
        assignmentId: "assign3",
        userId: "user1",
        status: "submitted",
        submittedAt: new Date("2025-10-25"),
        score: 15,
        totalScore: 15,
        answers: [
            {
                questionId: "q6",
                isCorrect: true,
                score: 5,
            },
            {
                questionId: "q7",
                isCorrect: true,
                score: 5,
            },
            {
                questionId: "q8",
                isCorrect: true,
                score: 5,
            },
        ],
    },
};
