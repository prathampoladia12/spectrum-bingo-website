import type { QuestionItem } from '../types/game';

export const INITIAL_QUESTIONS: QuestionItem[] = [
  // ==========================================
  // DSA (Data Structures & Algorithms)
  // ==========================================
  {
    id: 'dsa_20',
    category: 'DSA',
    points: 20,
    cost: 20,
    question_text: 'Which data structure enforces a Strict Last-In, First-Out (LIFO) operational order for push and pop?',
    answer: 'Stack',
    explanation: 'A Stack follows the Last-In, First-Out (LIFO) principle where the most recently pushed element is the first to be popped.',
  },
  {
    id: 'dsa_30',
    category: 'DSA',
    points: 30,
    cost: 30,
    question_text: 'What is the average and worst-case time complexity of standard QuickSort on an array of size N with naive pivot selection?',
    answer: 'Average: O(N log N), Worst-Case: O(N²)',
    explanation: 'QuickSort exhibits average time complexity O(N log N), but degrades to O(N²) worst-case when the partition is consistently unbalanced (e.g. sorted input with first element as pivot).',
  },
  {
    id: 'dsa_40',
    category: 'DSA',
    points: 40,
    cost: 40,
    question_text: 'In an open-addressing hash table with linear probing, what primary performance degradation issue arises as the load factor increases?',
    answer: 'Primary Clustering',
    explanation: 'Linear probing suffers from Primary Clustering, where occupied slots group together in long consecutive blocks, causing probe lengths to increase drastically.',
  },
  {
    id: 'dsa_50',
    category: 'DSA',
    points: 50,
    cost: 50,
    question_text: 'Which algorithm finds all-pairs shortest paths in a directed weighted graph with arbitrary (including negative) weights in O(V³) time?',
    answer: 'Floyd-Warshall Algorithm',
    explanation: 'The Floyd-Warshall algorithm computes shortest paths between all pairs of vertices in O(V³) time and supports negative edge weights (provided no negative cycles exist).',
    codeSnippet: 'for k from 1 to |V|:\n  for i from 1 to |V|:\n    for j from 1 to |V|:\n      dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])',
  },

  // ==========================================
  // AI/ML (Artificial Intelligence & Machine Learning)
  // ==========================================
  {
    id: 'aiml_20',
    category: 'AI/ML',
    points: 20,
    cost: 20,
    question_text: 'What is the term for a machine learning model performing exceptionally well on training data but poorly on unseen test data?',
    answer: 'Overfitting',
    explanation: 'Overfitting occurs when a model learns noise and idiosyncrasies in the training set rather than generalizing the underlying distribution.',
  },
  {
    id: 'aiml_30',
    category: 'AI/ML',
    points: 30,
    cost: 30,
    question_text: 'Which regularization technique randomly deactivates a fraction of neurons during training to prevent co-adaptation?',
    answer: 'Dropout',
    explanation: 'Dropout randomly zeroes out activation units with probability p during forward passes, preventing neurons from co-adapting and improving generalization.',
  },
  {
    id: 'aiml_40',
    category: 'AI/ML',
    points: 40,
    cost: 40,
    question_text: 'In the Scaled Dot-Product Attention mechanism of the Transformer architecture, what is the scaling factor applied to (Q · K^T)?',
    answer: '1 / √d_k (Square root of key dimension)',
    explanation: 'Attention(Q, K, V) = softmax((Q · K^T) / √d_k) · V. Scaling by 1/√d_k prevents dot products from growing excessively large, which pushes softmax into vanishing gradient regions.',
    codeSnippet: 'Attention(Q, K, V) = softmax( (Q * K.T) / sqrt(d_k) ) * V',
  },
  {
    id: 'aiml_50',
    category: 'AI/ML',
    points: 50,
    cost: 50,
    question_text: 'Why does the Adam optimizer combine first and second raw moment estimates with bias-correction factors (1 - β^t)?',
    answer: 'To counter initial moment estimate bias toward zero at early timesteps',
    explanation: 'Because the moving averages m_t and v_t are initialized as 0s, they are heavily biased towards zero at early steps. The (1 - β^t) denominator compensates for this initialization bias.',
  },

  // ==========================================
  // WSD (Web Systems & Development)
  // ==========================================
  {
    id: 'wsd_20',
    category: 'WSD',
    points: 20,
    cost: 20,
    question_text: 'Which HTTP response status code is returned when a client sends a request that lacks valid authentication credentials?',
    answer: 'HTTP 401 Unauthorized',
    explanation: 'HTTP 401 Unauthorized indicates that the request requires user authentication credentials (WWW-Authenticate header). 403 Forbidden is used when credentials are known but access is refused.',
  },
  {
    id: 'wsd_30',
    category: 'WSD',
    points: 30,
    cost: 30,
    question_text: 'Which transport protocol does HTTP/3 utilize under the hood instead of traditional TCP + TLS?',
    answer: 'QUIC (over UDP)',
    explanation: 'HTTP/3 replaces TCP with QUIC, an encrypted UDP-based transport protocol that eliminates head-of-line blocking and achieves 0-RTT connection establishment.',
  },
  {
    id: 'wsd_40',
    category: 'WSD',
    points: 40,
    cost: 40,
    question_text: 'Under CORS rules, when does a web browser trigger a preflight OPTIONS request before sending the actual HTTP request?',
    answer: 'When the request uses non-simple HTTP methods (e.g. PUT/DELETE) or custom headers',
    explanation: 'Browsers issue a preflight OPTIONS request if the cross-origin request is not a "simple request" (i.e. methods other than GET/POST/HEAD, or non-safelisted headers, or non-standard Content-Type).',
  },
  {
    id: 'wsd_50',
    category: 'WSD',
    points: 50,
    cost: 50,
    question_text: 'Why do relational databases predominantly use B+ Trees instead of pure B-Trees or binary trees for disk storage indexing?',
    answer: 'Leaf nodes contain all data pointers and are sequentially linked, optimizing range scans and maximizing tree fan-out',
    explanation: 'In a B+ Tree, internal nodes store only routing keys, allowing much higher fan-out (fewer disk I/O reads). All data pointers reside in leaf nodes connected as a doubly linked list for rapid sequential range queries.',
  },

  // ==========================================
  // PROGRAMMING (Languages & Paradigms)
  // ==========================================
  {
    id: 'prog_20',
    category: 'PROGRAMMING',
    points: 20,
    cost: 20,
    question_text: 'In JavaScript / TypeScript, which keyword creates a block-scoped variable that cannot be reassigned after declaration?',
    answer: 'const',
    explanation: 'const creates a block-scoped identifier that cannot be reassigned (though internal properties of objects assigned to const can still be modified).',
  },
  {
    id: 'prog_30',
    category: 'PROGRAMMING',
    points: 30,
    cost: 30,
    question_text: 'What will be logged to the console by the following JavaScript event loop snippet?',
    answer: '1, 4, 3, 2',
    explanation: 'Synchronous statements log 1 and 4. Microtasks (Promise.then) run immediately after synchronous execution, logging 3. Macrotasks (setTimeout) execute on the subsequent tick, logging 2.',
    codeSnippet: 'console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);',
  },
  {
    id: 'prog_40',
    category: 'PROGRAMMING',
    points: 40,
    cost: 40,
    question_text: 'In Rust, what core rule enforced by the borrow checker prevents data races at compile time without a runtime garbage collector?',
    answer: 'Aliasing XOR Mutability (Any number of immutable references &T, OR exactly one mutable reference &mut T, but not both)',
    explanation: 'Rust enforces the Aliasing XOR Mutability rule: at any given time, you can have any number of immutable references (&T), or exactly one mutable reference (&mut T), but never both simultaneously.',
  },
  {
    id: 'prog_50',
    category: 'PROGRAMMING',
    points: 50,
    cost: 50,
    question_text: 'What occurs when sending a value to an unbuffered channel in Go (ch <- val) when no goroutine is actively receiving from it?',
    answer: 'The sending goroutine blocks until a receiver is ready',
    explanation: 'Unbuffered channels in Go provide synchronous communication. A send operation blocks until another goroutine executes a corresponding receive on that channel.',
  },
];

// Tie-breaker questions for when multiple players reach 100+ points simultaneously
export const TIE_BREAKER_QUESTIONS: QuestionItem[] = [
  {
    id: 'tb_01',
    category: 'DSA',
    points: 50,
    cost: 0,
    question_text: 'Tie-Breaker: What is the amortized time complexity of inserting an item into a dynamic array (like std::vector or ArrayList) that doubles its capacity upon reaching limit?',
    answer: 'O(1) amortized',
    explanation: 'While resizing takes O(N) when copying elements to a doubled buffer, this happens exponentially infrequently. The cost spread over N operations yields O(1) amortized time per insertion.',
  },
  {
    id: 'tb_02',
    category: 'AI/ML',
    points: 50,
    cost: 0,
    question_text: 'Tie-Breaker: Which positional encoding strategy allows Transformers to generalize cleanly to sequence lengths unseen during training through rotational matrices?',
    answer: 'RoPE (Rotary Position Embedding)',
    explanation: 'RoPE encodes relative position by multiplying query and key representations by a rotation matrix, naturally enabling decaying self-attention with relative distance and superior length extrapolation.',
  },
  {
    id: 'tb_03',
    category: 'WSD',
    points: 50,
    cost: 0,
    question_text: 'Tie-Breaker: What distributed consensus algorithm uses leader election and replicated state machines, designed specifically to be more understandable than Paxos?',
    answer: 'Raft',
    explanation: 'Raft decomposes distributed consensus into leader election, log replication, and safety, designed by Ongaro & Ousterhout explicitly for comprehensibility compared to Paxos.',
  },
  {
    id: 'tb_04',
    category: 'PROGRAMMING',
    points: 50,
    cost: 0,
    question_text: 'Tie-Breaker: In functional programming, what is the term for transforming a function that takes multiple arguments into a chain of functions that each take a single argument?',
    answer: 'Currying',
    explanation: 'Currying transforms f(a, b, c) into f(a)(b)(c), named after logician Haskell Curry.',
  },
];

// Sudden Death / Fastest Finger First questions
export const FFF_QUESTIONS: QuestionItem[] = [
  {
    id: 'fff_01',
    category: 'PROGRAMMING',
    points: 100,
    cost: 0,
    question_text: 'SUDDEN DEATH: What is the output of typeof null in JavaScript?',
    answer: '"object"',
    explanation: 'typeof null returning "object" is a historic bug in the original 1995 JavaScript implementation caused by the type tag for objects being 000 in memory, which null shared.',
  },
  {
    id: 'fff_02',
    category: 'DSA',
    points: 100,
    cost: 0,
    question_text: 'SUDDEN DEATH: What is the minimum number of comparisons needed to find both the minimum and maximum of an array of N elements?',
    answer: '⌈3N/2⌉ - 2 comparisons',
    explanation: 'By comparing elements in pairs and then comparing the smaller with the min and the larger with the max, we need only 3 comparisons for every 2 elements: ⌈3N/2⌉ - 2 comparisons.',
  },
];
