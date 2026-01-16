'use client';

import { useState } from 'react';

type Language = 'python' | 'javascript' | 'java' | 'cpp';

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: Record<Language, string>;
  codeExample: Record<Language, string>;
  practiceProblems: string[];
}

const languages: { id: Language; label: string }[] = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
];

const topics: Topic[] = [
  {
    id: 'arrays',
    title: 'Arrays & Strings',
    description: 'Master the fundamentals of arrays, strings, and basic operations',
    difficulty: 'Beginner',
    estimatedTime: '2-3 hours',
    lessons: [
      {
        id: 'arrays-intro',
        title: 'Introduction to Arrays',
        content: {
          python: `# Arrays in Python (Lists)

Arrays in Python are implemented using lists. They are dynamic, ordered collections that can store elements of any type.

## Key Concepts:
- **Indexing**: Access elements using index (0-based)
- **Slicing**: Extract portions of array using [start:end]
- **Dynamic sizing**: Lists grow and shrink automatically
- **Heterogeneous**: Can store different types (but not recommended)

## Common Operations:
- Access: O(1)
- Insert at end: O(1) amortized
- Insert at position: O(n)
- Delete: O(n)
- Search: O(n)

## Tips:
- Use list comprehensions for cleaner code
- Be careful with shallow vs deep copies
- Consider using collections.deque for queue operations`,
          javascript: `// Arrays in JavaScript

Arrays in JavaScript are dynamic, ordered collections that can store elements of any type.

## Key Concepts:
- **Indexing**: Access elements using index (0-based)
- **Dynamic sizing**: Arrays grow and shrink automatically
- **Heterogeneous**: Can store different types
- **Built-in methods**: map, filter, reduce, etc.

## Common Operations:
- Access: O(1)
- Push (end): O(1) amortized
- Unshift (start): O(n)
- Splice: O(n)
- Search: O(n)

## Tips:
- Use spread operator for copying: [...arr]
- Array methods are powerful - learn them!
- Consider TypedArrays for numeric operations`,
          java: `// Arrays in Java

Arrays in Java are fixed-size, ordered collections of the same type.

## Key Concepts:
- **Fixed size**: Must specify size at creation
- **Homogeneous**: All elements must be same type
- **Indexing**: Access elements using index (0-based)
- **Memory efficient**: Stored contiguously

## Common Operations:
- Access: O(1)
- Insert: Not supported (use ArrayList)
- Search: O(n)
- Copy: O(n)

## ArrayList for Dynamic Arrays:
- Grows automatically
- More operations available
- Slightly slower than arrays

## Tips:
- Use Arrays utility class for sorting, searching
- Consider ArrayList for flexibility
- Initialize with proper size when possible`,
          cpp: `// Arrays in C++

C++ offers both static arrays and dynamic containers like std::vector.

## Key Concepts:
- **Static arrays**: Fixed size, stack allocated
- **std::vector**: Dynamic, heap allocated
- **Indexing**: Access using [] or at()
- **Memory management**: Important for raw arrays

## Common Operations (vector):
- Access: O(1)
- Push_back: O(1) amortized
- Insert: O(n)
- Search: O(n)

## Tips:
- Prefer std::vector over raw arrays
- Use reserve() to avoid reallocations
- Use iterators for STL algorithm compatibility
- Consider std::array for fixed-size needs`,
        },
        codeExample: {
          python: `# Creating and manipulating arrays in Python
nums = [1, 2, 3, 4, 5]

# Access element
print(nums[0])  # Output: 1

# Slice array
print(nums[1:4])  # Output: [2, 3, 4]

# Add element
nums.append(6)  # [1, 2, 3, 4, 5, 6]

# Insert at position
nums.insert(0, 0)  # [0, 1, 2, 3, 4, 5, 6]

# Remove element
nums.remove(3)  # [0, 1, 2, 4, 5, 6]

# List comprehension
squares = [x**2 for x in range(5)]
# [0, 1, 4, 9, 16]`,
          javascript: `// Creating and manipulating arrays in JavaScript
const nums = [1, 2, 3, 4, 5];

// Access element
console.log(nums[0]);  // Output: 1

// Slice array
console.log(nums.slice(1, 4));  // [2, 3, 4]

// Add element
nums.push(6);  // [1, 2, 3, 4, 5, 6]

// Insert at position
nums.splice(0, 0, 0);  // [0, 1, 2, 3, 4, 5, 6]

// Remove element
const idx = nums.indexOf(3);
nums.splice(idx, 1);  // [0, 1, 2, 4, 5, 6]

// Array methods
const squares = Array.from({length: 5}, (_, i) => i ** 2);
// [0, 1, 4, 9, 16]`,
          java: `// Creating and manipulating arrays in Java
import java.util.*;

// Static array
int[] nums = {1, 2, 3, 4, 5};

// Access element
System.out.println(nums[0]);  // Output: 1

// Using ArrayList for dynamic operations
ArrayList<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
list.add(3);

// Add at position
list.add(0, 0);  // [0, 1, 2, 3]

// Remove element
list.remove(Integer.valueOf(2));  // [0, 1, 3]

// Convert to array
Integer[] arr = list.toArray(new Integer[0]);`,
          cpp: `// Creating and manipulating arrays in C++
#include <vector>
#include <iostream>

// Using std::vector
std::vector<int> nums = {1, 2, 3, 4, 5};

// Access element
std::cout << nums[0] << std::endl;  // Output: 1

// Add element
nums.push_back(6);  // [1, 2, 3, 4, 5, 6]

// Insert at position
nums.insert(nums.begin(), 0);  // [0, 1, 2, 3, 4, 5, 6]

// Remove element
auto it = std::find(nums.begin(), nums.end(), 3);
if (it != nums.end()) {
    nums.erase(it);  // [0, 1, 2, 4, 5, 6]
}

// Using iterators
for (const auto& num : nums) {
    std::cout << num << " ";
}`,
        },
        practiceProblems: ['Two Sum', 'Best Time to Buy and Sell Stock', 'Contains Duplicate'],
      },
    ],
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    description: 'Learn about singly and doubly linked lists',
    difficulty: 'Beginner',
    estimatedTime: '2-3 hours',
    lessons: [
      {
        id: 'linked-lists-intro',
        title: 'Introduction to Linked Lists',
        content: {
          python: `# Linked Lists in Python

A linked list is a linear data structure where elements are stored in nodes, and each node points to the next.

## Types:
- **Singly Linked List**: Each node points to next
- **Doubly Linked List**: Nodes point to both next and previous
- **Circular Linked List**: Last node points to first

## Advantages over Arrays:
- Dynamic size
- Efficient insertion/deletion at any position (if you have the reference)
- No memory waste from pre-allocation

## Disadvantages:
- No random access (must traverse)
- Extra memory for pointers
- Not cache-friendly

## Time Complexity:
- Access: O(n)
- Search: O(n)
- Insert at head: O(1)
- Insert at tail: O(1) with tail pointer, O(n) without
- Delete: O(1) if node reference, O(n) to find`,
          javascript: `// Linked Lists in JavaScript

A linked list is a linear data structure where elements are stored in nodes, and each node points to the next.

## Implementation:
JavaScript doesn't have built-in linked lists, so we implement them using objects/classes.

## Types:
- **Singly Linked List**: Each node has value and next pointer
- **Doubly Linked List**: Nodes have value, next, and prev pointers

## When to Use:
- Frequent insertions/deletions
- Unknown size requirements
- Implementing queues/stacks

## Common Operations:
- Traversal
- Insertion (head, tail, middle)
- Deletion
- Reversal
- Cycle detection`,
          java: `// Linked Lists in Java

Java provides LinkedList class in Collections framework, and we can also implement custom linked lists.

## Built-in LinkedList:
- Implements List and Deque interfaces
- Doubly-linked list implementation
- Better for add/remove operations

## Custom Implementation:
- Create Node class with data and next pointer
- LinkedList class manages head and operations

## When to Use LinkedList vs ArrayList:
- LinkedList: Frequent add/remove at beginning/middle
- ArrayList: Frequent access by index

## Time Complexity (Java LinkedList):
- add(e): O(1)
- add(index, e): O(n)
- remove(): O(1)
- get(index): O(n)`,
          cpp: `// Linked Lists in C++

C++ offers std::list (doubly linked) and std::forward_list (singly linked).

## std::list:
- Doubly linked list
- Bidirectional iterators
- Efficient insert/erase anywhere

## std::forward_list:
- Singly linked list
- Forward iterators only
- More memory efficient

## Custom Implementation:
- Create Node struct with data and next pointer
- Manage head pointer and operations

## When to Use:
- std::list: Need bidirectional traversal
- std::forward_list: Only need forward traversal
- Custom: Learning or specific requirements

## Tips:
- Use smart pointers for memory safety
- Consider std::list for interview implementations`,
        },
        codeExample: {
          python: `# Linked List implementation in Python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, val):
        if not self.head:
            self.head = ListNode(val)
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = ListNode(val)

    def prepend(self, val):
        new_node = ListNode(val, self.head)
        self.head = new_node

    def delete(self, val):
        if not self.head:
            return
        if self.head.val == val:
            self.head = self.head.next
            return
        curr = self.head
        while curr.next and curr.next.val != val:
            curr = curr.next
        if curr.next:
            curr.next = curr.next.next

    def reverse(self):
        prev, curr = None, self.head
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        self.head = prev`,
          javascript: `// Linked List implementation in JavaScript
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    append(val) {
        if (!this.head) {
            this.head = new ListNode(val);
            return;
        }
        let curr = this.head;
        while (curr.next) {
            curr = curr.next;
        }
        curr.next = new ListNode(val);
    }

    prepend(val) {
        this.head = new ListNode(val, this.head);
    }

    delete(val) {
        if (!this.head) return;
        if (this.head.val === val) {
            this.head = this.head.next;
            return;
        }
        let curr = this.head;
        while (curr.next && curr.next.val !== val) {
            curr = curr.next;
        }
        if (curr.next) {
            curr.next = curr.next.next;
        }
    }

    reverse() {
        let prev = null, curr = this.head;
        while (curr) {
            const next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        this.head = prev;
    }
}`,
          java: `// Linked List implementation in Java
class ListNode {
    int val;
    ListNode next;

    ListNode(int val) {
        this.val = val;
        this.next = null;
    }
}

class LinkedList {
    private ListNode head;

    public void append(int val) {
        if (head == null) {
            head = new ListNode(val);
            return;
        }
        ListNode curr = head;
        while (curr.next != null) {
            curr = curr.next;
        }
        curr.next = new ListNode(val);
    }

    public void prepend(int val) {
        ListNode newNode = new ListNode(val);
        newNode.next = head;
        head = newNode;
    }

    public void delete(int val) {
        if (head == null) return;
        if (head.val == val) {
            head = head.next;
            return;
        }
        ListNode curr = head;
        while (curr.next != null && curr.next.val != val) {
            curr = curr.next;
        }
        if (curr.next != null) {
            curr.next = curr.next.next;
        }
    }

    public void reverse() {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        head = prev;
    }
}`,
          cpp: `// Linked List implementation in C++
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class LinkedList {
private:
    ListNode* head;

public:
    LinkedList() : head(nullptr) {}

    void append(int val) {
        if (!head) {
            head = new ListNode(val);
            return;
        }
        ListNode* curr = head;
        while (curr->next) {
            curr = curr->next;
        }
        curr->next = new ListNode(val);
    }

    void prepend(int val) {
        ListNode* newNode = new ListNode(val);
        newNode->next = head;
        head = newNode;
    }

    void deleteVal(int val) {
        if (!head) return;
        if (head->val == val) {
            ListNode* temp = head;
            head = head->next;
            delete temp;
            return;
        }
        ListNode* curr = head;
        while (curr->next && curr->next->val != val) {
            curr = curr->next;
        }
        if (curr->next) {
            ListNode* temp = curr->next;
            curr->next = curr->next->next;
            delete temp;
        }
    }

    void reverse() {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        head = prev;
    }
};`,
        },
        practiceProblems: ['Reverse Linked List', 'Merge Two Sorted Lists', 'Linked List Cycle'],
      },
    ],
  },
  {
    id: 'stacks-queues',
    title: 'Stacks & Queues',
    description: 'Understand LIFO and FIFO data structures',
    difficulty: 'Beginner',
    estimatedTime: '2 hours',
    lessons: [],
  },
  {
    id: 'hash-tables',
    title: 'Hash Tables',
    description: 'Learn about hash maps and hash sets',
    difficulty: 'Intermediate',
    estimatedTime: '3 hours',
    lessons: [],
  },
  {
    id: 'trees',
    title: 'Trees & Binary Trees',
    description: 'Master tree structures and traversals',
    difficulty: 'Intermediate',
    estimatedTime: '4 hours',
    lessons: [],
  },
  {
    id: 'graphs',
    title: 'Graphs',
    description: 'Learn graph representations and algorithms',
    difficulty: 'Advanced',
    estimatedTime: '5 hours',
    lessons: [],
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    description: 'Master DP patterns and techniques',
    difficulty: 'Advanced',
    estimatedTime: '6 hours',
    lessons: [],
  },
];

export function LearningWidget() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [language, setLanguage] = useState<Language>('python');

  const difficultyColors = {
    Beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Advanced: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  // Show lesson content
  if (selectedLesson && selectedTopic) {
    return (
      <LessonView
        topic={selectedTopic}
        lesson={selectedLesson}
        language={language}
        onLanguageChange={setLanguage}
        onBack={() => setSelectedLesson(null)}
        onBackToTopics={() => {
          setSelectedLesson(null);
          setSelectedTopic(null);
        }}
      />
    );
  }

  // Show topic lessons
  if (selectedTopic) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedTopic(null)}
            className="p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
          >
            <BackIcon className="w-5 h-5 text-[var(--color-text-muted)]" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{selectedTopic.title}</h2>
            <p className="text-sm text-[var(--color-text-muted)]">{selectedTopic.description}</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                language === lang.id
                  ? 'bg-indigo-500 text-[var(--color-text-primary)]'
                  : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Lessons List */}
        {selectedTopic.lessons.length > 0 ? (
          <div className="space-y-3">
            {selectedTopic.lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className="w-full bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] p-4 text-left hover:border-indigo-500/50 hover:bg-[var(--color-bg-tertiary)]/70 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <span className="text-indigo-400 font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--color-text-primary)] group-hover:text-indigo-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      {lesson.practiceProblems.length} practice problems
                    </p>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-indigo-400" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] p-8 text-center">
            <BookIcon className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Coming Soon</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Lessons for this topic are being prepared. Check back soon!
            </p>
          </div>
        )}
      </div>
    );
  }

  // Show topics list
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Learn DSA</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Master Data Structures & Algorithms with interactive lessons
        </p>
      </div>

      {/* Language Selector */}
      <div className="bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] p-4">
        <p className="text-sm text-[var(--color-text-muted)] mb-3">Select your preferred language:</p>
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                language === lang.id
                  ? 'bg-indigo-500 text-[var(--color-text-primary)]'
                  : 'bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]/80'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className="bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] p-5 text-left hover:border-indigo-500/50 hover:bg-[var(--color-bg-tertiary)]/70 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <BookIcon className="w-5 h-5 text-indigo-400" />
              </div>
              <span
                className={`px-2 py-1 rounded-lg text-xs font-medium border ${
                  difficultyColors[topic.difficulty]
                }`}
              >
                {topic.difficulty}
              </span>
            </div>
            <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-indigo-400 transition-colors">
              {topic.title}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
              {topic.description}
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {topic.estimatedTime}
              </span>
              <span className="flex items-center gap-1">
                <BookOpenIcon className="w-4 h-4" />
                {topic.lessons.length} lessons
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* AI Assistant Promo */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text-primary)]">AI-Powered Learning</h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Stuck on a concept? Ask our AI Assistant for personalized explanations and examples!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lesson View Component
interface LessonViewProps {
  topic: Topic;
  lesson: Lesson;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
  onBackToTopics: () => void;
}

function LessonView({
  topic,
  lesson,
  language,
  onLanguageChange,
  onBack,
  onBackToTopics,
}: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'code' | 'practice'>('content');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
        >
          <BackIcon className="w-5 h-5 text-[var(--color-text-muted)]" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-1">
            <button onClick={onBackToTopics} className="hover:text-[var(--color-text-primary)]">
              {topic.title}
            </button>
            <span>/</span>
            <span className="text-[var(--color-text-primary)]">{lesson.title}</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{lesson.title}</h2>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex gap-2">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onLanguageChange(lang.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              language === lang.id
                ? 'bg-indigo-500 text-[var(--color-text-primary)]'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--color-bg-tertiary)] rounded-lg">
        {(['content', 'code', 'practice'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {tab === 'content' ? 'Learn' : tab === 'code' ? 'Code Example' : 'Practice'}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'content' && (
        <div className="bg-[var(--color-bg-tertiary)] rounded-2xl border border-[var(--color-border)] p-6">
          <pre className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap font-sans leading-relaxed">
            {lesson.content[language]}
          </pre>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="bg-[var(--color-bg-tertiary)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <div className="bg-[var(--color-bg-primary)]/50 px-4 py-2 border-b border-[var(--color-border)] flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-muted)]">
              {languages.find((l) => l.id === language)?.label} Example
            </span>
            <button className="text-xs text-indigo-400 hover:text-indigo-300">
              Copy Code
            </button>
          </div>
          <pre className="p-4 text-sm text-[var(--color-text-secondary)] overflow-x-auto">
            <code>{lesson.codeExample[language]}</code>
          </pre>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            Practice these problems to reinforce your learning:
          </p>
          <div className="space-y-3">
            {lesson.practiceProblems.map((problem, index) => (
              <div
                key={index}
                className="bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-hover)] flex items-center justify-center">
                    <span className="text-sm text-[var(--color-text-muted)]">{index + 1}</span>
                  </div>
                  <span className="text-[var(--color-text-primary)] font-medium">{problem}</span>
                </div>
                <button className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-500/30 transition-colors">
                  Solve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
