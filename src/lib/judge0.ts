// Piston API Client for Code Execution (Free, no API key needed)
// Documentation: https://github.com/engineer-man/piston
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

// Language mappings for Piston
export const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  python: { language: 'python', version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' },
};

// Keep old LANGUAGE_IDS for backwards compatibility
export const LANGUAGE_IDS: Record<string, number> = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
  c: 50,
  typescript: 74,
  go: 60,
  rust: 73,
};

// Status codes (for backwards compatibility)
export const STATUS_CODES = {
  IN_QUEUE: 1,
  PROCESSING: 2,
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  TIME_LIMIT_EXCEEDED: 5,
  COMPILATION_ERROR: 6,
  RUNTIME_ERROR_SIGSEGV: 7,
  RUNTIME_ERROR_SIGXFSZ: 8,
  RUNTIME_ERROR_SIGFPE: 9,
  RUNTIME_ERROR_SIGABRT: 10,
  RUNTIME_ERROR_NZEC: 11,
  RUNTIME_ERROR_OTHER: 12,
  INTERNAL_ERROR: 13,
  EXEC_FORMAT_ERROR: 14,
};

interface PistonRequest {
  language: string;
  version: string;
  files: { content: string }[];
  stdin?: string;
}

interface PistonResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

// Extract function name from code
function extractFunctionName(code: string, language: string): string | null {
  const patterns: Record<string, RegExp> = {
    python: /def\s+(\w+)\s*\(/,
    javascript: /function\s+(\w+)\s*\(|const\s+(\w+)\s*=\s*(?:function|\()/,
    typescript: /function\s+(\w+)\s*\(|const\s+(\w+)\s*=\s*(?:function|\()/,
    java: /public\s+\w+(?:\[\])?\s+(\w+)\s*\(/,
    cpp: /\w+(?:\s*<[^>]+>)?\s+(\w+)\s*\([^)]*\)\s*\{/,
  };

  const pattern = patterns[language.toLowerCase()];
  if (!pattern) return null;

  const match = code.match(pattern);
  return match ? (match[1] || match[2]) : null;
}

// Parse test input string into variable assignments
function parseTestInput(input: string): { assignments: string; args: string[] } {
  // Input format: "nums = [2,7,11,15], target = 9"
  const parts = input.split(/,\s*(?=[a-zA-Z_]\w*\s*=)/);
  const assignments: string[] = [];
  const args: string[] = [];

  for (const part of parts) {
    const match = part.trim().match(/^(\w+)\s*=\s*(.+)$/);
    if (match) {
      const [, varName, value] = match;
      assignments.push(`${varName} = ${value}`);
      args.push(varName);
    }
  }

  return { assignments: assignments.join('\n'), args };
}

// Wrap user code with test harness for execution
function wrapCodeWithTestHarness(
  code: string,
  language: string,
  testInput: string
): string {
  const funcName = extractFunctionName(code, language);
  if (!funcName) {
    // If we can't find function name, return code as-is
    return code;
  }

  const { assignments, args } = parseTestInput(testInput);
  const argsStr = args.join(', ');

  switch (language.toLowerCase()) {
    case 'python':
      return `${code}

# Test harness
${assignments}
result = ${funcName}(${argsStr})
print(result)`;

    case 'javascript':
    case 'typescript':
      return `${code}

// Test harness
${assignments};
const result = ${funcName}(${argsStr});
console.log(JSON.stringify(result));`;

    case 'java':
      // For Java, we need to wrap in a main class
      return `import java.util.*;

${code}

class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        ${assignments.replace(/=/g, ' =').replace(/\[/g, 'new int[]{').replace(/\]/g, '}')};
        int[] result = sol.${funcName}(${argsStr});
        System.out.println(Arrays.toString(result));
    }
}`;

    case 'cpp':
      return `#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

${code}

int main() {
    Solution sol;
    vector<int> nums = ${args[0] ? testInput.match(/nums\s*=\s*(\[[^\]]+\])/)?.[1] || '{}' : '{}'};
    int target = ${args[1] ? testInput.match(/target\s*=\s*(\d+)/)?.[1] || '0' : '0'};
    vector<int> result = sol.${funcName}(nums, target);
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`;

    default:
      return code;
  }
}

// Normalize output for comparison (handle different array formats)
function normalizeOutput(output: string): string {
  return output
    .trim()
    .replace(/\s+/g, '')  // Remove all whitespace
    .replace(/'/g, '"')    // Normalize quotes
    .toLowerCase();
}

// Execute code using Piston API
// Local execution helper when Piston API is blocked or offline
async function executeCodeLocally(
  code: string,
  language: string,
  stdin: string = ''
): Promise<{
  stdout: string;
  stderr: string;
  exitCode: number;
  compileOutput: string | null;
}> {
  const tempDir = path.join(process.cwd(), '.tmp_compile');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const runId = Math.random().toString(36).substring(7);
  let fileName = '';
  let command = '';
  let compileCommand = '';

  const lang = language.toLowerCase();
  if (lang === 'python') {
    fileName = `temp_${runId}.py`;
    command = `python3 ${fileName}`;
  } else if (lang === 'javascript') {
    fileName = `temp_${runId}.js`;
    command = `node ${fileName}`;
  } else if (lang === 'cpp' || lang === 'c') {
    fileName = `temp_${runId}.cpp`;
    const binName = `bin_${runId}`;
    compileCommand = `g++ -O3 ${fileName} -o ${binName}`;
    command = `./${binName}`;
  } else if (lang === 'java') {
    // Java class name must match file name (Main class from test harness wrapper)
    fileName = 'Main.java';
    const runDir = path.join(tempDir, `run_${runId}`);
    fs.mkdirSync(runDir, { recursive: true });

    const filePath = path.join(runDir, fileName);
    fs.writeFileSync(filePath, code);

    return new Promise((resolve) => {
      exec('javac Main.java', { cwd: runDir, timeout: 5000 }, (compileError, cStdout, cStderr) => {
        if (compileError) {
          fs.rmSync(runDir, { recursive: true, force: true });
          resolve({
            stdout: '',
            stderr: '',
            exitCode: 1,
            compileOutput: cStderr || cStdout || 'Compilation failed',
          });
          return;
        }

        exec('java Main', { cwd: runDir, timeout: 5000 }, (runError, stdout, stderr) => {
          fs.rmSync(runDir, { recursive: true, force: true });
          resolve({
            stdout: stdout || '',
            stderr: stderr || '',
            exitCode: runError ? (runError.code || 1) : 0,
            compileOutput: null,
          });
        });
      });
    });
  } else {
    throw new Error(`Local execution not supported for language: ${language}`);
  }

  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, code);

  return new Promise((resolve) => {
    const runExec = () => {
      exec(command, { cwd: tempDir, timeout: 5000 }, (runError, stdout, stderr) => {
        // Clean up temp files
        try {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          if (lang === 'cpp' || lang === 'c') {
            const binPath = path.join(tempDir, `bin_${runId}`);
            if (fs.existsSync(binPath)) fs.unlinkSync(binPath);
          }
        } catch (e) {
          console.error('Failed to cleanup temp files:', e);
        }

        resolve({
          stdout: stdout || '',
          stderr: stderr || '',
          exitCode: runError ? (runError.code || 1) : 0,
          compileOutput: null,
        });
      });
    };

    if (compileCommand) {
      exec(compileCommand, { cwd: tempDir, timeout: 5000 }, (compileError, cStdout, cStderr) => {
        if (compileError) {
          try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          } catch (e) {}
          resolve({
            stdout: '',
            stderr: '',
            exitCode: 1,
            compileOutput: cStderr || cStdout || 'Compilation failed',
          });
          return;
        }
        runExec();
      });
    } else {
      runExec();
    }
  });
}

// Execute code using Piston API, falling back to local compilation if blocked/whitelisted
export async function executeCode(
  code: string,
  language: string,
  stdin: string = ''
): Promise<{
  stdout: string;
  stderr: string;
  exitCode: number;
  compileOutput: string | null;
}> {
  const langConfig = LANGUAGE_MAP[language.toLowerCase()];
  if (!langConfig) {
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    const request: PistonRequest = {
      language: langConfig.language,
      version: langConfig.version,
      files: [{ content: code }],
      stdin,
    };

    const response = await fetch(PISTON_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    const result = await response.json();

    // Check if the response contains whitelist instructions or error messages
    if (result.message && result.message.includes('whitelist')) {
      throw new Error('Piston API requires whitelist activation');
    }

    return {
      stdout: result.run.stdout || '',
      stderr: result.run.stderr || '',
      exitCode: result.run.code,
      compileOutput: result.compile?.stderr || result.compile?.stdout || null,
    };
  } catch (error) {
    console.log('Piston execution failed (whitelisted or offline). Falling back to local execution:', error);
    return executeCodeLocally(code, language, stdin);
  }
}

// Run code against a single test case
export async function runTestCase(
  code: string,
  language: string,
  input: string,
  expectedOutput: string
): Promise<{
  passed: boolean;
  actualOutput: string | null;
  expectedOutput: string;
  time: number | null;
  memory: number | null;
  error: string | null;
  status: string;
}> {
  const startTime = Date.now();

  try {
    // Wrap the code with test harness to call the function with test inputs
    const wrappedCode = wrapCodeWithTestHarness(code, language, input);

    // Execute wrapped code (no stdin needed - input is embedded in code)
    const result = await executeCode(wrappedCode, language, '');
    const executionTime = Date.now() - startTime;

    const actualOutput = result.stdout.trim();
    const expected = expectedOutput.trim();

    // Check for compilation/runtime errors
    if (result.compileOutput) {
      return {
        passed: false,
        actualOutput: null,
        expectedOutput,
        time: executionTime,
        memory: null,
        error: result.compileOutput,
        status: 'Compilation Error',
      };
    }

    if (result.stderr && result.exitCode !== 0) {
      return {
        passed: false,
        actualOutput: result.stdout || null,
        expectedOutput,
        time: executionTime,
        memory: null,
        error: result.stderr,
        status: 'Runtime Error',
      };
    }

    // Compare output using normalized comparison (handles formatting differences)
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expected);
    const passed = normalizedActual === normalizedExpected;

    return {
      passed,
      actualOutput,
      expectedOutput,
      time: executionTime,
      memory: null, // Piston doesn't provide memory info
      error: passed ? null : 'Output does not match expected',
      status: passed ? 'Accepted' : 'Wrong Answer',
    };
  } catch (error) {
    return {
      passed: false,
      actualOutput: null,
      expectedOutput,
      time: Date.now() - startTime,
      memory: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'Error',
    };
  }
}

// Piston is always configured (no API key needed)
export function isJudge0Configured(): boolean {
  return true; // Piston doesn't need configuration
}

// Also export as isPistonConfigured for clarity
export function isPistonConfigured(): boolean {
  return true;
}
