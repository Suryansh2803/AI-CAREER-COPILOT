const questions = {
  Technical: {
    Easy: [
      ['Data Structures', 'What is the difference between a stack and a queue?', 'Describe the ordering rule, operations, and a practical use for each.', ['LIFO', 'FIFO', 'push and pop', 'enqueue and dequeue', 'use case'], 'A stack is last in, first out: the last item added is the first removed, using push and pop. A queue is first in, first out, using enqueue and dequeue. A call stack is a common stack example, while a task scheduler often uses a queue.'],
      ['Algorithms', 'What is the time complexity of binary search, and what must be true before using it?', 'Explain why the search range shrinks and state the input requirement.', ['sorted input', 'halve the search space', 'logarithmic time', 'O(log n)'], 'Binary search requires sorted input. Each comparison removes half of the remaining range, so it runs in O(log n) time and uses O(1) extra space in an iterative implementation.'],
      ['Programming', 'Explain the difference between a value and a reference in a programming language you use.', 'Choose a language and describe what is copied or shared.', ['value', 'reference', 'object', 'mutation', 'copy'], 'A value assignment copies the value itself. A reference assignment copies a reference to an object, so both variables can observe mutations to that same object. Exact behavior depends on the language and type.'],
      ['Databases', 'What is a database index, and what trade-off does it introduce?', 'Mention lookup speed, storage, and writes.', ['lookup', 'query', 'storage', 'write', 'maintenance'], 'An index is an auxiliary data structure that helps the database find rows without scanning the whole table. It speeds up selected reads but uses storage and adds work to inserts, updates, and deletes.'],
      ['Networking', 'When would you choose TCP over UDP?', 'Compare delivery guarantees, ordering, and latency needs.', ['reliable', 'ordered', 'delivery', 'latency', 'connection'], 'TCP provides a connection with reliable, ordered delivery, which suits web requests and file transfers. UDP avoids those guarantees and can be useful when low latency matters more than retransmitting every packet, such as some live media.'],
    ],
    Medium: [
      ['Operating Systems', 'Explain the difference between a process and a thread.', 'Compare memory isolation, shared resources, and failure behavior.', ['separate address space', 'shared memory', 'stack', 'context switch', 'isolation'], 'A process has its own address space and operating-system resources. Threads within a process share its memory but keep their own stacks and execution state. Threads can communicate cheaply through shared memory, but need synchronization and a fault in one thread can affect the process.'],
      ['Databases', 'How does a B+ tree index help a database query range values?', 'Discuss fanout, tree height, and linked leaves.', ['balanced tree', 'fanout', 'sorted keys', 'leaf nodes', 'range query'], 'A B+ tree keeps keys balanced and uses high-fanout nodes to stay shallow. Values or row pointers are found at the leaves, which are linked in key order. After reaching the first matching leaf, a range query can scan neighboring leaves efficiently.'],
      ['Backend', 'How would you make a REST endpoint safe to retry after a network timeout?', 'Explain idempotency and how a request key is handled.', ['idempotent', 'idempotency key', 'duplicate', 'persist', 'response'], 'For a retryable operation, the client can send an idempotency key. The server stores the key with the operation result and returns the stored result for repeats instead of applying the mutation twice. The key and result need an appropriate scope and expiry.'],
      ['Databases', 'What is database normalization, and when might you denormalize?', 'Mention update anomalies and read patterns.', ['redundancy', 'update anomaly', 'relationships', 'read performance', 'trade-off'], 'Normalization separates related facts to reduce duplication and update anomalies. Denormalization can be useful when a measured read pattern needs fewer joins, but it adds duplicated data and requires a strategy to keep it consistent.'],
      ['Networking', 'Compare HTTP polling with a WebSocket for live updates.', 'Describe connection behavior and the use case trade-off.', ['request', 'persistent connection', 'bidirectional', 'overhead', 'real time'], 'Polling sends repeated requests and is simple but can add delay and request overhead. A WebSocket keeps a connection open for bidirectional messages, which suits frequent real-time updates but adds connection and scaling considerations.'],
    ],
    Hard: [
      ['System Design', 'Design a URL shortening service and explain how you would handle growing traffic.', 'Cover API behavior, identifier generation, storage, caching, and trade-offs.', ['identifier', 'collision', 'database', 'cache', 'redirect', 'scaling'], 'I would define create and redirect APIs, generate a collision-resistant short identifier, and store it with the destination and metadata. Redirects are read-heavy, so I would cache hot mappings and partition storage by identifier if needed. I would monitor cache hit rate and redirect latency, while handling abuse and link expiry.'],
      ['Distributed Systems', 'What does the CAP theorem say during a network partition?', 'Define the three properties and clarify the partition condition.', ['consistency', 'availability', 'partition', 'trade-off', 'network'], 'CAP describes a trade-off during a network partition: a distributed system cannot guarantee both a single consistent view and a successful response from every node. A system must tolerate the partition and choose how it handles requests, with practical designs making choices per operation.'],
      ['Architecture', 'How would you design a rate limiter for an API serving multiple application instances?', 'Discuss algorithm, shared state, atomicity, and failure policy.', ['token bucket', 'shared state', 'atomic', 'redis', 'limit', 'failure'], 'A token bucket supports bursts while enforcing an average rate. Multiple API instances need shared, atomic state, often in a low-latency store such as Redis. I would define keys and windows, return retry guidance, and decide whether store failure should fail open or closed based on endpoint risk.'],
      ['Concurrency', 'How can a deadlock occur, and what are practical ways to prevent it?', 'Explain the conditions and at least one prevention strategy.', ['mutual exclusion', 'hold and wait', 'circular wait', 'lock ordering', 'timeout'], 'A deadlock can occur when resources are exclusive, a thread holds one while waiting for another, and a circular wait forms. A consistent lock ordering prevents cycles; timeouts, narrower lock scopes, or avoiding nested locks can also reduce risk.'],
      ['Cloud & DevOps', 'How would you deploy a service with minimal downtime and a safe rollback path?', 'Cover health checks, rollout strategy, compatibility, and rollback.', ['health check', 'rolling deployment', 'backward compatible', 'rollback', 'monitoring'], 'I would use a rolling or canary deployment behind health checks, keep database changes backward-compatible across versions, and monitor error rate and latency. If the new version fails its checks, traffic returns to the prior version and any data migration has a safe recovery plan.'],
    ],
  },
  HR: {
    Easy: [
      ['Introduction', 'Tell me about yourself and what kind of role you are looking for.', 'Keep it relevant: current focus, one piece of evidence, and your goal.', ['current focus', 'relevant experience', 'example', 'role goal'], 'I am a computer science student focused on building software projects and strengthening my fundamentals. Recently I worked on a project using the tools relevant to this role. I am looking for an opportunity where I can contribute, learn from an engineering team, and grow as a developer.'],
      ['Motivation', 'Why are you interested in this role?', 'Connect the role to your interests and evidence from your work.', ['role responsibility', 'interest', 'experience', 'contribution'], 'This role interests me because it combines the kind of software work I enjoy with opportunities to learn from a team. My project experience has given me a starting point in the relevant tools, and I would like to build on that while contributing carefully to real product work.'],
      ['Self Reflection', 'What is one strength you bring to a team?', 'Name a strength, give a concrete example, and explain its value.', ['strength', 'specific example', 'action', 'result'], 'One strength I bring is persistence when debugging. In a recent project, I reproduced an issue, narrowed it down with small checks, and documented the fix so the same problem was easier to avoid.'],
      ['Growth', 'What is a skill you are currently improving?', 'Be candid and describe the actions you are taking.', ['skill gap', 'practice plan', 'feedback', 'progress'], 'I am working on explaining technical trade-offs more clearly. I practice by writing down the alternatives and the reason for my choice after each project task, then ask peers for feedback on whether the explanation is understandable.'],
      ['Communication', 'How do you make sure your work is understood by teammates?', 'Describe a practical communication habit.', ['context', 'clear update', 'document', 'confirm understanding'], 'I share the goal and current status in concise updates, call out blockers early, and document decisions that affect later work. I also check that the team agrees on the next step before implementation moves too far.'],
    ],
    Medium: [
      ['Behavioral', 'Describe a challenging project and how you handled it.', 'Use STAR: situation, task, action, and result. Be specific about your contribution.', ['situation', 'task', 'action', 'result', 'lesson'], 'On a team project, we had a feature that was difficult to finish because the requirements were unclear. I clarified the expected behavior, split the work into smaller tasks, and shared progress in short check-ins. We delivered the core flow first, then improved edge cases. I learned to resolve ambiguity early.'],
      ['Teamwork', 'Tell me about a disagreement with a teammate and how you resolved it.', 'Show listening, evidence, a decision, and a respectful outcome.', ['listen', 'trade-off', 'evidence', 'decision', 'outcome'], 'A teammate and I preferred different approaches to a feature. I asked what constraints mattered most, compared both options against those constraints, and suggested a small test to resolve the uncertainty. We agreed on the option that was simpler to maintain and documented why.'],
      ['Ownership', 'Tell me about a mistake you made and what you changed afterward.', 'Own the mistake, explain impact, recovery, and prevention.', ['mistake', 'impact', 'ownership', 'recovery', 'prevention'], 'I once underestimated how a change would affect an existing flow. After noticing it in review, I told the team, reverted the risky part, and added a regression check. Since then I review nearby use cases before submitting similar changes.'],
      ['Prioritization', 'How do you handle competing deadlines?', 'Explain how you clarify urgency and communicate trade-offs.', ['deadline', 'impact', 'prioritize', 'communicate', 'trade-off'], 'I clarify the impact and deadline for each task, break work into small deliverables, and align on what can be deferred. If a risk emerges, I communicate it early with options instead of waiting until the deadline.'],
      ['Feedback', 'Describe a time you received feedback that changed your approach.', 'Show openness and a concrete change in behavior.', ['feedback', 'listen', 'change', 'result'], 'A reviewer pointed out that my code solved the immediate case but was hard to test. I asked which parts were most brittle, separated the logic from its side effects, and added focused tests. It made later changes easier to verify.'],
    ],
    Hard: [
      ['Leadership', 'Tell me about a time you had to make progress with incomplete information.', 'Describe how you managed risk, assumptions, and communication.', ['assumptions', 'risk', 'small experiment', 'communicate', 'result'], 'When requirements were incomplete, I wrote down the assumptions that could change the design, asked stakeholders about the highest-risk ones, and built a small reversible prototype. I shared what it did and did not prove, then updated the plan when we had better information.'],
      ['Conflict', 'What would you do if you strongly disagreed with a technical decision made by your lead?', 'Balance respectful challenge with alignment after a decision.', ['understand context', 'evidence', 'trade-off', 'respectful', 'align'], 'I would first understand the constraints behind the decision, then share my concern with evidence and a concrete alternative. If the team chose another path after discussing the trade-offs, I would support it and help monitor the risks we identified.'],
      ['Failure', 'Describe a project outcome that did not meet expectations.', 'Be accountable and focus on what you learned and changed.', ['expectation', 'what happened', 'ownership', 'lesson', 'change'], 'A project I worked on took longer than planned because I did not surface an integration risk early. I owned my part, helped reduce scope to deliver the essential path, and added an integration checkpoint to future plans. I now test cross-component assumptions earlier.'],
      ['Ethics', 'What would you do if you discovered a serious issue shortly before release?', 'Prioritize user impact, communicate, and follow release controls.', ['user impact', 'raise concern', 'evidence', 'mitigation', 'decision'], 'I would assess and reproduce the issue, communicate the user impact and evidence to the release owner, and follow the team’s incident process. If the risk were serious, I would recommend pausing or limiting the release while we agree on a mitigation.'],
      ['Adaptability', 'Tell me about a time you had to learn a new tool or domain quickly.', 'Explain your learning plan, application, and result.', ['goal', 'learning plan', 'practice', 'feedback', 'result'], 'I started by identifying the task I needed the tool for, used a small tutorial project to learn its basics, and then applied it to a scoped part of the work. I asked for review early and adjusted based on feedback rather than trying to learn everything before starting.'],
    ],
  },
}

const roleQuestions = {
  Frontend: [
    ['Frontend', 'How would you improve the loading performance of a React page?', 'Consider measurement, bundle size, rendering, and user-perceived loading.', ['measure', 'bundle size', 'code splitting', 'rendering', 'performance'], 'I would first measure the slow path with browser performance tools. Depending on the evidence, I might reduce bundle size with code splitting, avoid unnecessary renders, optimize large assets, and prioritize content visible to the user. I would compare before and after metrics.'],
    ['Frontend', 'How do you make an interactive interface accessible?', 'Cover semantics, keyboard use, focus, and testing.', ['semantic html', 'keyboard', 'focus', 'labels', 'screen reader'], 'I start with semantic HTML and accessible names, ensure every control works from the keyboard, keep focus visible and predictable, and expose state to assistive technology. I test key flows with keyboard navigation and accessibility tools.'],
    ['Frontend', 'When would you keep state local versus move it to a shared store?', 'Discuss ownership, consumers, update frequency, and complexity.', ['ownership', 'consumers', 'local state', 'shared state', 'complexity'], 'I keep state local when one component or a small subtree owns it. I lift or share state when multiple distant consumers need the same source of truth. I consider update frequency and whether a shared store reduces complexity or creates unnecessary coupling.'],
  ],
  Backend: [
    ['Backend', 'How would you design pagination for an endpoint with a large changing dataset?', 'Compare offset and cursor pagination and mention stable ordering.', ['cursor', 'stable ordering', 'offset', 'large dataset', 'next page'], 'Offset pagination is simple but can become slow and shift as rows change. Cursor pagination uses a stable ordering key and a continuation cursor, which is more reliable for large changing datasets. I would define tie-breaking and validation for cursors.'],
    ['Backend', 'How would you protect an API from abusive or accidental request bursts?', 'Discuss identity, limit policy, distributed state, and response.', ['rate limit', 'identity', 'window', 'shared state', '429'], 'I would set limits by an appropriate identity such as account or API key, use a token bucket or sliding window, and coordinate state across instances. Exceeded requests receive a 429 response with retry guidance, while trusted internal paths can have separate policies.'],
    ['Backend', 'What should an API log include to help diagnose failures without leaking sensitive data?', 'Cover correlation, outcome, context, and data minimization.', ['request id', 'status', 'latency', 'redact', 'sensitive'], 'Useful logs include a request or trace ID, route, status, latency, and sanitized error context. I avoid logging secrets and personal payloads, redact sensitive values, and use access controls and retention limits.'],
  ],
  FullStack: [
    ['Full Stack', 'How would you handle form validation across a browser client and an API?', 'Explain user experience and server-side trust boundaries.', ['client validation', 'server validation', 'user feedback', 'schema', 'trust'], 'Client-side validation gives quick feedback, but the server must validate independently because clients are not trusted. I would share a clear schema where practical, return field-level errors, and preserve entered values so the user can fix the form easily.'],
    ['Full Stack', 'How do you keep frontend data consistent after a user updates a record?', 'Discuss API response, cache invalidation, optimistic updates, and errors.', ['api response', 'cache', 'optimistic', 'rollback', 'error'], 'I would use the server response as the source of truth and update or invalidate the relevant client cache. An optimistic update can make the interface faster, but it needs a rollback and clear error state if the request fails.'],
    ['Full Stack', 'How would you investigate a feature that works locally but fails after deployment?', 'Trace config, requests, logs, environment, and reproduction.', ['reproduce', 'environment', 'logs', 'network request', 'configuration'], 'I would capture the failing request and error, compare environment configuration without exposing secrets, and inspect server logs and browser network traces. Then I would reproduce with the same inputs in a staging-like environment and check recent changes.'],
  ],
}

const topicPoints = (question) => question.keyPoints || []

export function getInterviewQuestionSet(role = 'SDE', type = 'Technical', difficulty = 'Medium', count = 10) {
  const wanted = type === 'Mixed' ? ['Technical', 'HR'] : [type]
  const exact = wanted.flatMap((kind) => questions[kind]?.[difficulty] || [])
  const fallback = wanted.flatMap((kind) => Object.entries(questions[kind] || {}).filter(([level]) => level !== difficulty).flatMap(([, pool]) => pool))
  const relevantRoleQuestions = type === 'HR' ? [] : roleQuestions[role] || []
  const combined = [...exact, ...relevantRoleQuestions.map((item) => [item[0], ...item.slice(1)]), ...fallback]
  const unique = []
  const seen = new Set()
  for (const entry of combined) {
    const item = Array.isArray(entry) ? { topic: entry[0], question: entry[1], guidance: entry[2], keyPoints: entry[3], sampleAnswer: entry[4] } : entry
    if (!item?.question || seen.has(item.question)) continue
    seen.add(item.question)
    unique.push({ ...item, difficulty: Object.keys(questions[wanted[0]] || {}).find((level) => (questions[wanted[0]][level] || []).some((row) => row[1] === item.question)) || difficulty })
  }
  return unique.slice(0, Math.max(1, Math.min(15, count))).map((item, index) => ({ ...item, id: `${index + 1}` }))
}

export function evaluateInterviewAnswer(question, answer) {
  const text = String(answer || '').trim()
  const words = text.split(/\s+/).filter(Boolean)
  const lower = text.toLowerCase()
  const points = topicPoints(question)
  const matchedPoints = points.filter((point) => {
    const tokens = point.toLowerCase().split(/[^a-z0-9+#]+/).filter((token) => token.length > 2)
    return tokens.length > 0 && tokens.some((token) => lower.includes(token))
  })
  const coverage = points.length ? matchedPoints.length / points.length : 0
  const technicalAccuracy = Math.max(10, Math.min(100, Math.round(20 + coverage * 75 + (words.length >= 50 ? 5 : 0))))
  const structured = /\b(first|because|for example|for instance|therefore|however|finally|result|situation|task|action)\b/i.test(text)
  const communication = Math.max(10, Math.min(100, Math.round(25 + Math.min(words.length, 100) * 0.45 + (structured ? 20 : 0))))
  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim()).length
  const clarity = Math.max(10, Math.min(100, Math.round(30 + Math.min(sentences, 6) * 8 + (words.length > 20 ? 18 : 0) - (words.length > 170 ? 12 : 0))))
  const overall = Math.round((technicalAccuracy * 0.5 + communication * 0.25 + clarity * 0.25))
  const strengths = []
  const weaknesses = []
  if (matchedPoints.length) strengths.push(`Covered ${matchedPoints.length} of ${points.length} key concepts: ${matchedPoints.join(', ')}.`)
  else weaknesses.push('Add specific concepts from the question instead of giving only a general response.')
  if (words.length >= 35) strengths.push('Your response has enough detail to explain your reasoning.')
  else weaknesses.push('Expand the answer with your approach and a concrete example or trade-off.')
  if (structured) strengths.push('You used a transition or example to organize the explanation.')
  else weaknesses.push('Use a simple structure: define the idea, explain the trade-off, then give an example.')
  if (words.length > 180) weaknesses.push('Shorten the response and keep the most relevant details.')
  const improvements = []
  const missing = points.filter((point) => !matchedPoints.includes(point))
  if (missing.length) improvements.push(`Consider addressing: ${missing.slice(0, 4).join(', ')}.`)
  if (!structured) improvements.push('Make the reasoning easier to follow with a clear sequence and a specific example.')
  if (words.length < 35) improvements.push('Aim for a few complete sentences that explain both what you did and why.')

  return {
    score: overall,
    scores: { technicalAccuracy, communication, clarity, overall },
    matchedPoints,
    strengths,
    weaknesses,
    improvements,
    feedback: overall >= 75 ? 'Your response covers useful points. Review the remaining suggestions to make it more complete.' : overall >= 50 ? 'You have a starting point. Add more of the key concepts and explain your reasoning with an example.' : 'Try a more complete answer: address the core concepts, explain your reasoning, and add a relevant example.',
    modelAnswer: question?.sampleAnswer || '',
  }
}

export function summarizeInterview(questions = []) {
  const answered = questions.filter((item) => String(item.answer || '').trim() && item.evaluation?.scores)
  const dimensions = ['technicalAccuracy', 'communication', 'clarity', 'overall']
  const scores = Object.fromEntries(dimensions.map((key) => [key, answered.length ? Math.round(answered.reduce((sum, item) => sum + (item.evaluation.scores[key] || 0), 0) / answered.length) : 0]))
  const strengths = [...new Set(answered.flatMap((item) => item.evaluation.strengths || []))].slice(0, 5)
  const weaknesses = [...new Set(answered.flatMap((item) => item.evaluation.weaknesses || []))].slice(0, 5)
  const improvements = [...new Set(answered.flatMap((item) => item.evaluation.improvements || []))].slice(0, 5)
  if (!answered.length) improvements.unshift('Answer at least one question to get personalized feedback.')
  return { ...scores, answeredCount: answered.length, strengths, weaknesses, improvements }
}
