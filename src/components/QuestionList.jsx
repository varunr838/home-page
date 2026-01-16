import React from 'react';

const questions = [
  { id: 1, title: "Two Sum", topic: "Arrays", difficulty: "easy", solved: true },
  { id: 2, title: "Reverse Linked List", topic: "Linked List", difficulty: "easy", solved: true },
  { id: 3, title: "Longest Substring Without Repeating Characters", topic: "Strings", difficulty: "medium", solved: false },
  { id: 4, title: "Valid Parentheses", topic: "Stack", difficulty: "easy", solved: true },
  { id: 5, title: "Merge K Sorted Lists", topic: "Heap", difficulty: "hard", solved: false },
  { id: 6, title: "Binary Tree Inorder Traversal", topic: "Trees", difficulty: "easy", solved: false },
  { id: 7, title: "Longest Palindromic Substring", topic: "Dynamic Programming", difficulty: "medium", solved: false },
  { id: 8, title: "3Sum", topic: "Arrays", difficulty: "medium", solved: false },
  { id: 9, title: "Trapping Rain Water", topic: "Arrays", difficulty: "hard", solved: false },
  { id: 10, title: "Maximum Depth of Binary Tree", topic: "Trees", difficulty: "easy", solved: false },
];

const QuestionList = () => {
  return (
    <div className="card-base">
      <h3 className="section-title">DSA Problems</h3>
      <div className="question-list">
        {questions.map((q) => (
          <div key={q.id} className={`question-item ${q.solved ? 'solved' : ''}`}>
            <span className="question-number">#{q.id}</span>
            <div className="checkbox"></div>
            <div className="question-content">
              <span className="question-title">{q.title}</span>
              <span className="topic-tag">{q.topic}</span>
              <span className={`difficulty ${q.difficulty}`}>
                {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;