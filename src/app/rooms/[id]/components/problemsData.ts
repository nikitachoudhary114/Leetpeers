export interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    python: string;
    javascript: string;
    java: string;
    cpp: string;
  };
  solution: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
    code: {
      python: string;
      javascript: string;
      java: string;
      cpp: string;
    };
  };
  hints: string[];
  tags: string[];
}

export const problems: Problem[] = [
  // EASY PROBLEMS
  {
    id: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    pass`,
      javascript: `function twoSum(nums, target) {
    // Write your solution here

}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here

    }
};`,
    },
    solution: {
      approach: `Use a hash map to store each number and its index as you iterate. For each number, check if (target - current number) exists in the map. If it does, return the indices.`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: {
        python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
        java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[] {seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
        cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement)) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
      },
    },
    hints: [
      'A brute force approach would be O(n²). Can you do better?',
      'Think about using a hash map to store values you\'ve seen.',
      'For each number, what value would you need to find to reach the target?',
    ],
    tags: ['Array', 'Hash Table'],
  },
  {
    id: 121,
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.',
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'No transactions are done and the max profit = 0.',
      },
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
    starterCode: {
      python: `def maxProfit(prices: list[int]) -> int:
    # Write your solution here
    pass`,
      javascript: `function maxProfit(prices) {
    // Write your solution here

}`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your solution here

    }
};`,
    },
    solution: {
      approach: `Track the minimum price seen so far and the maximum profit. For each price, update the minimum if current price is lower, otherwise calculate potential profit and update maximum profit.`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: {
        python: `def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0

    for price in prices:
        if price < min_price:
            min_price = price
        else:
            max_profit = max(max_profit, price - min_price)

    return max_profit`,
        javascript: `function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;

    for (const price of prices) {
        if (price < minPrice) {
            minPrice = price;
        } else {
            maxProfit = Math.max(maxProfit, price - minPrice);
        }
    }

    return maxProfit;
}`,
        java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;

        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else {
                maxProfit = Math.max(maxProfit, price - minPrice);
            }
        }

        return maxProfit;
    }
}`,
        cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;

        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else {
                maxProfit = max(maxProfit, price - minPrice);
            }
        }

        return maxProfit;
    }
};`,
      },
    },
    hints: [
      'You need to find the maximum difference between a later price and an earlier price.',
      'Track the minimum price as you iterate.',
      'At each step, calculate what profit you could make if you sold today.',
    ],
    tags: ['Array', 'Dynamic Programming'],
  },
  {
    id: 217,
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    difficulty: 'Easy',
    description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: 'true',
      },
      {
        input: 'nums = [1,2,3,4]',
        output: 'false',
      },
      {
        input: 'nums = [1,1,1,3,3,4,3,2,4,2]',
        output: 'true',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
    ],
    starterCode: {
      python: `def containsDuplicate(nums: list[int]) -> bool:
    # Write your solution here
    pass`,
      javascript: `function containsDuplicate(nums) {
    // Write your solution here

}`,
      java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        // Write your solution here

    }
};`,
    },
    solution: {
      approach: `Use a Set to track seen numbers. If a number is already in the set, return true. Otherwise, add it to the set.`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: {
        python: `def containsDuplicate(nums: list[int]) -> bool:
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
        javascript: `function containsDuplicate(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    return false;
}`,
        java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if (seen.contains(num)) {
                return true;
            }
            seen.add(num);
        }
        return false;
    }
}`,
        cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int num : nums) {
            if (seen.count(num)) {
                return true;
            }
            seen.insert(num);
        }
        return false;
    }
};`,
      },
    },
    hints: [
      'How can you check if you\'ve seen a number before in O(1) time?',
      'Consider using a hash set.',
    ],
    tags: ['Array', 'Hash Table', 'Sorting'],
  },

  // MEDIUM PROBLEMS
  {
    id: 15,
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0. nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0. nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0. The distinct triplets are [-1,0,1] and [-1,-1,2].',
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]',
        explanation: 'The only possible triplet does not sum up to 0.',
      },
      {
        input: 'nums = [0,0,0]',
        output: '[[0,0,0]]',
        explanation: 'The only possible triplet sums up to 0.',
      },
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5',
    ],
    starterCode: {
      python: `def threeSum(nums: list[int]) -> list[list[int]]:
    # Write your solution here
    pass`,
      javascript: `function threeSum(nums) {
    // Write your solution here

}`,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // Write your solution here

    }
};`,
    },
    solution: {
      approach: `Sort the array first. For each element, use two pointers to find pairs that sum to the negative of the current element. Skip duplicates to avoid duplicate triplets.`,
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1) excluding output',
      code: {
        python: `def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left, right = i + 1, len(nums) - 1

        while left < right:
            total = nums[i] + nums[left] + nums[right]

            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1

    return result`,
        javascript: `function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];

    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        let left = i + 1;
        let right = nums.length - 1;

        while (left < right) {
            const total = nums[i] + nums[left] + nums[right];

            if (total === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (total < 0) {
                left++;
            } else {
                right--;
            }
        }
    }

    return result;
}`,
        java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            int left = i + 1, right = nums.length - 1;

            while (left < right) {
                int total = nums[i] + nums[left] + nums[right];

                if (total == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (total < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }

        return result;
    }
}`,
        cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;

        for (int i = 0; i < nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            int left = i + 1, right = nums.size() - 1;

            while (left < right) {
                int total = nums[i] + nums[left] + nums[right];

                if (total == 0) {
                    result.push_back({nums[i], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (total < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }

        return result;
    }
};`,
      },
    },
    hints: [
      'Sort the array first to make it easier to avoid duplicates.',
      'Fix one element and use two pointers for the remaining two.',
      'Be careful to skip duplicate values to avoid duplicate triplets.',
    ],
    tags: ['Array', 'Two Pointers', 'Sorting'],
  },
  {
    id: 53,
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.',
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
        explanation: 'The subarray [5,4,-1,7,8] has the largest sum 23.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    starterCode: {
      python: `def maxSubArray(nums: list[int]) -> int:
    # Write your solution here
    pass`,
      javascript: `function maxSubArray(nums) {
    // Write your solution here

}`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your solution here

    }
};`,
    },
    solution: {
      approach: `Use Kadane's algorithm. Track the current sum and reset it to the current element if the current sum becomes negative. Keep track of the maximum sum seen.`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: {
        python: `def maxSubArray(nums: list[int]) -> int:
    current_sum = max_sum = nums[0]

    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)

    return max_sum`,
        javascript: `function maxSubArray(nums) {
    let currentSum = nums[0];
    let maxSum = nums[0];

    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}`,
        java: `class Solution {
    public int maxSubArray(int[] nums) {
        int currentSum = nums[0];
        int maxSum = nums[0];

        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }

        return maxSum;
    }
}`,
        cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int currentSum = nums[0];
        int maxSum = nums[0];

        for (int i = 1; i < nums.size(); i++) {
            currentSum = max(nums[i], currentSum + nums[i]);
            maxSum = max(maxSum, currentSum);
        }

        return maxSum;
    }
};`,
      },
    },
    hints: [
      'Think about when it\'s better to start a new subarray vs extending the current one.',
      'If current sum becomes negative, starting fresh is always better.',
      'This is a classic dynamic programming problem known as Kadane\'s algorithm.',
    ],
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
  },
  {
    id: 33,
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    difficulty: 'Medium',
    description: `There is an integer array nums sorted in ascending order (with distinct values).

Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed).

Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.

You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
      },
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 3',
        output: '-1',
      },
      {
        input: 'nums = [1], target = 0',
        output: '-1',
      },
    ],
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.',
      'nums is an ascending array that is possibly rotated.',
      '-10^4 <= target <= 10^4',
    ],
    starterCode: {
      python: `def search(nums: list[int], target: int) -> int:
    # Write your solution here
    pass`,
      javascript: `function search(nums, target) {
    // Write your solution here

}`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your solution here

    }
};`,
    },
    solution: {
      approach: `Use modified binary search. At each step, determine which half is sorted. If target is in the sorted half, search there; otherwise, search the other half.`,
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: {
        python: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid

        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1`,
        javascript: `function search(nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) {
            return mid;
        }

        // Left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // Right half is sorted
        else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1;
}`,
        java: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                return mid;
            }

            // Left half is sorted
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            }
            // Right half is sorted
            else {
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }

        return -1;
    }
}`,
        cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                return mid;
            }

            // Left half is sorted
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            }
            // Right half is sorted
            else {
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }

        return -1;
    }
};`,
      },
    },
    hints: [
      'In a rotated sorted array, at least one half is always sorted.',
      'Use binary search but check which half is sorted first.',
      'If target is in the sorted half, search there. Otherwise, search the other half.',
    ],
    tags: ['Array', 'Binary Search'],
  },

  // HARD PROBLEMS
  {
    id: 42,
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.',
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
      },
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5',
    ],
    starterCode: {
      python: `def trap(height: list[int]) -> int:
    # Write your solution here
    pass`,
      javascript: `function trap(height) {
    // Write your solution here

}`,
      java: `class Solution {
    public int trap(int[] height) {
        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        // Write your solution here

    }
};`,
    },
    solution: {
      approach: `Use two pointers from both ends. Track the maximum height from left and right. Water at any position depends on the minimum of max heights from both sides minus current height.`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: {
        python: `def trap(height: list[int]) -> int:
    if not height:
        return 0

    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0

    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]

    return water`,
        javascript: `function trap(height) {
    if (!height.length) return 0;

    let left = 0, right = height.length - 1;
    let leftMax = height[left], rightMax = height[right];
    let water = 0;

    while (left < right) {
        if (leftMax < rightMax) {
            left++;
            leftMax = Math.max(leftMax, height[left]);
            water += leftMax - height[left];
        } else {
            right--;
            rightMax = Math.max(rightMax, height[right]);
            water += rightMax - height[right];
        }
    }

    return water;
}`,
        java: `class Solution {
    public int trap(int[] height) {
        if (height.length == 0) return 0;

        int left = 0, right = height.length - 1;
        int leftMax = height[left], rightMax = height[right];
        int water = 0;

        while (left < right) {
            if (leftMax < rightMax) {
                left++;
                leftMax = Math.max(leftMax, height[left]);
                water += leftMax - height[left];
            } else {
                right--;
                rightMax = Math.max(rightMax, height[right]);
                water += rightMax - height[right];
            }
        }

        return water;
    }
}`,
        cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        if (height.empty()) return 0;

        int left = 0, right = height.size() - 1;
        int leftMax = height[left], rightMax = height[right];
        int water = 0;

        while (left < right) {
            if (leftMax < rightMax) {
                left++;
                leftMax = max(leftMax, height[left]);
                water += leftMax - height[left];
            } else {
                right--;
                rightMax = max(rightMax, height[right]);
                water += rightMax - height[right];
            }
        }

        return water;
    }
};`,
      },
    },
    hints: [
      'Water at any position = min(maxLeft, maxRight) - height[i]',
      'You can precompute max heights from left and right.',
      'Can you do it with O(1) space using two pointers?',
    ],
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
  },
  {
    id: 23,
    title: 'Merge k Sorted Lists',
    slug: 'merge-k-sorted-lists',
    difficulty: 'Hard',
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'The linked-lists are: [1->4->5, 1->3->4, 2->6]. Merging them into one sorted list: 1->1->2->3->4->4->5->6',
      },
      {
        input: 'lists = []',
        output: '[]',
      },
      {
        input: 'lists = [[]]',
        output: '[]',
      },
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4',
      'lists[i] is sorted in ascending order.',
      'The sum of lists[i].length will not exceed 10^4.',
    ],
    starterCode: {
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def mergeKLists(lists: list[ListNode]) -> ListNode:
    # Write your solution here
    pass`,
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function mergeKLists(lists) {
    // Write your solution here

}`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Write your solution here

    }
}`,
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 * };
 */
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        // Write your solution here

    }
};`,
    },
    solution: {
      approach: `Use a min-heap (priority queue) to efficiently get the smallest element among all list heads. Add all list heads to the heap, pop the minimum, add it to result, and push its next node if exists.`,
      timeComplexity: 'O(N log k) where N is total nodes, k is number of lists',
      spaceComplexity: 'O(k) for the heap',
      code: {
        python: `import heapq

def mergeKLists(lists: list[ListNode]) -> ListNode:
    # Custom comparison for ListNode
    ListNode.__lt__ = lambda self, other: self.val < other.val

    heap = []
    for lst in lists:
        if lst:
            heapq.heappush(heap, lst)

    dummy = ListNode(0)
    current = dummy

    while heap:
        node = heapq.heappop(heap)
        current.next = node
        current = current.next

        if node.next:
            heapq.heappush(heap, node.next)

    return dummy.next`,
        javascript: `function mergeKLists(lists) {
    // Simple approach using merge sort style
    if (!lists || lists.length === 0) return null;

    while (lists.length > 1) {
        const mergedLists = [];
        for (let i = 0; i < lists.length; i += 2) {
            const l1 = lists[i];
            const l2 = i + 1 < lists.length ? lists[i + 1] : null;
            mergedLists.push(mergeTwoLists(l1, l2));
        }
        lists = mergedLists;
    }

    return lists[0];
}

function mergeTwoLists(l1, l2) {
    const dummy = new ListNode(0);
    let current = dummy;

    while (l1 && l2) {
        if (l1.val <= l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }

    current.next = l1 || l2;
    return dummy.next;
}`,
        java: `class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;

        PriorityQueue<ListNode> heap = new PriorityQueue<>(
            (a, b) -> a.val - b.val
        );

        for (ListNode list : lists) {
            if (list != null) {
                heap.offer(list);
            }
        }

        ListNode dummy = new ListNode(0);
        ListNode current = dummy;

        while (!heap.isEmpty()) {
            ListNode node = heap.poll();
            current.next = node;
            current = current.next;

            if (node.next != null) {
                heap.offer(node.next);
            }
        }

        return dummy.next;
    }
}`,
        cpp: `class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) {
            return a->val > b->val;
        };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> heap(cmp);

        for (auto list : lists) {
            if (list) {
                heap.push(list);
            }
        }

        ListNode dummy(0);
        ListNode* current = &dummy;

        while (!heap.empty()) {
            ListNode* node = heap.top();
            heap.pop();
            current->next = node;
            current = current->next;

            if (node->next) {
                heap.push(node->next);
            }
        }

        return dummy.next;
    }
};`,
      },
    },
    hints: [
      'Think about how you would merge 2 sorted lists.',
      'Can you extend that to k lists?',
      'A min-heap can efficiently give you the smallest among k elements.',
      'Another approach: divide and conquer by merging pairs.',
    ],
    tags: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)', 'Merge Sort'],
  },
  {
    id: 76,
    title: 'Minimum Window Substring',
    slug: 'minimum-window-substring',
    difficulty: 'Hard',
    description: `Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".

The testcases will be generated such that the answer is unique.`,
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: 'The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.',
      },
      {
        input: 's = "a", t = "a"',
        output: '"a"',
        explanation: 'The entire string s is the minimum window.',
      },
      {
        input: 's = "a", t = "aa"',
        output: '""',
        explanation: 'Both \'a\'s from t must be included in the window. Since s has only one \'a\', return empty string.',
      },
    ],
    constraints: [
      'm == s.length',
      'n == t.length',
      '1 <= m, n <= 10^5',
      's and t consist of uppercase and lowercase English letters.',
    ],
    starterCode: {
      python: `def minWindow(s: str, t: str) -> str:
    # Write your solution here
    pass`,
      javascript: `function minWindow(s, t) {
    // Write your solution here

}`,
      java: `class Solution {
    public String minWindow(String s, String t) {
        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    string minWindow(string s, string t) {
        // Write your solution here

    }
};`,
    },
    solution: {
      approach: `Use sliding window with two pointers. Expand the window by moving right pointer until all characters are included. Then shrink from left while maintaining validity. Track the minimum valid window.`,
      timeComplexity: 'O(m + n)',
      spaceComplexity: 'O(m + n)',
      code: {
        python: `from collections import Counter

def minWindow(s: str, t: str) -> str:
    if not s or not t:
        return ""

    target = Counter(t)
    required = len(target)

    left = 0
    formed = 0
    window = {}

    result = (float('inf'), None, None)  # (length, left, right)

    for right, char in enumerate(s):
        window[char] = window.get(char, 0) + 1

        if char in target and window[char] == target[char]:
            formed += 1

        while formed == required:
            if right - left + 1 < result[0]:
                result = (right - left + 1, left, right)

            left_char = s[left]
            window[left_char] -= 1

            if left_char in target and window[left_char] < target[left_char]:
                formed -= 1

            left += 1

    return "" if result[0] == float('inf') else s[result[1]:result[2] + 1]`,
        javascript: `function minWindow(s, t) {
    if (!s || !t) return "";

    const target = {};
    for (const char of t) {
        target[char] = (target[char] || 0) + 1;
    }

    const required = Object.keys(target).length;
    let formed = 0;
    const window = {};

    let left = 0;
    let result = { length: Infinity, left: 0, right: 0 };

    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        window[char] = (window[char] || 0) + 1;

        if (target[char] && window[char] === target[char]) {
            formed++;
        }

        while (formed === required) {
            if (right - left + 1 < result.length) {
                result = { length: right - left + 1, left, right };
            }

            const leftChar = s[left];
            window[leftChar]--;

            if (target[leftChar] && window[leftChar] < target[leftChar]) {
                formed--;
            }

            left++;
        }
    }

    return result.length === Infinity ? "" : s.slice(result.left, result.right + 1);
}`,
        java: `class Solution {
    public String minWindow(String s, String t) {
        if (s.isEmpty() || t.isEmpty()) return "";

        Map<Character, Integer> target = new HashMap<>();
        for (char c : t.toCharArray()) {
            target.put(c, target.getOrDefault(c, 0) + 1);
        }

        int required = target.size();
        int formed = 0;
        Map<Character, Integer> window = new HashMap<>();

        int left = 0;
        int[] result = {Integer.MAX_VALUE, 0, 0};

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window.put(c, window.getOrDefault(c, 0) + 1);

            if (target.containsKey(c) &&
                window.get(c).intValue() == target.get(c).intValue()) {
                formed++;
            }

            while (formed == required) {
                if (right - left + 1 < result[0]) {
                    result[0] = right - left + 1;
                    result[1] = left;
                    result[2] = right;
                }

                char leftChar = s.charAt(left);
                window.put(leftChar, window.get(leftChar) - 1);

                if (target.containsKey(leftChar) &&
                    window.get(leftChar) < target.get(leftChar)) {
                    formed--;
                }

                left++;
            }
        }

        return result[0] == Integer.MAX_VALUE ? "" :
               s.substring(result[1], result[2] + 1);
    }
}`,
        cpp: `class Solution {
public:
    string minWindow(string s, string t) {
        if (s.empty() || t.empty()) return "";

        unordered_map<char, int> target;
        for (char c : t) target[c]++;

        int required = target.size();
        int formed = 0;
        unordered_map<char, int> window;

        int left = 0;
        int minLen = INT_MAX, minLeft = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s[right];
            window[c]++;

            if (target.count(c) && window[c] == target[c]) {
                formed++;
            }

            while (formed == required) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minLeft = left;
                }

                char leftChar = s[left];
                window[leftChar]--;

                if (target.count(leftChar) &&
                    window[leftChar] < target[leftChar]) {
                    formed--;
                }

                left++;
            }
        }

        return minLen == INT_MAX ? "" : s.substr(minLeft, minLen);
    }
};`,
      },
    },
    hints: [
      'Use a sliding window approach.',
      'Expand the window until it contains all characters of t.',
      'Then shrink from the left while the window is still valid.',
      'Use a hash map to count characters in the window and target.',
    ],
    tags: ['Hash Table', 'String', 'Sliding Window'],
  },
];

export const getProblemsByDifficulty = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
  return problems.filter((p) => p.difficulty === difficulty);
};

export const getProblemById = (id: number) => {
  return problems.find((p) => p.id === id);
};

export const getProblemBySlug = (slug: string) => {
  return problems.find((p) => p.slug === slug);
};
