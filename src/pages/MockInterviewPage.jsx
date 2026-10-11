import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlarmClock, ArrowRight, ArrowLeft, Bot, Camera, CameraOff,
  Check, CheckCircle2, ChevronRight, Circle, Clock, Copy,
  Lightbulb, ListOrdered, LoaderCircle, MessageSquare, Mic, MicOff, RotateCcw,
  MonitorUp, Play, Send, ShieldCheck, Sparkles, Target, Volume2, VolumeX,
  XCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import { interviewAPI } from '../services/api'
import { evaluateInterviewAnswer, getInterviewQuestionSet, summarizeInterview } from '../../shared/interviewEngine.js'

const ROLE_OPTIONS = [
  { id: 'SDE', label: 'SDE', sub: 'Software development' },
  { id: 'Frontend', label: 'Frontend', sub: 'React and web UI' },
  { id: 'Backend', label: 'Backend', sub: 'APIs and services' },
  { id: 'FullStack', label: 'Full stack', sub: 'End to end' },
]
const TYPE_OPTIONS = [
  { id: 'Technical', label: 'Technical', desc: 'Computer science and engineering' },
  { id: 'HR', label: 'Behavioral', desc: 'Experience and collaboration' },
  { id: 'Mixed', label: 'Mixed', desc: 'Technical and behavioral' },
]
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const TIPS = [
  'Answer the question directly before adding detail.',
  'Use a clear sequence: idea, reasoning, example.',
  'For behavioral questions, explain the situation, your action, and the result.',
  'State assumptions when a question is open ended.',
  'Mention trade-offs instead of presenting one approach as perfect.',
  'Keep the answer focused; invite follow-up questions.',
  'Use examples from your own work and be clear about your contribution.',
  'If you are unsure, explain how you would investigate the problem.',
]

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function CircularScore({ value = 0, size = 106 }) {
  const radius = 43
  const perimeter = Math.PI * 2 * radius
  return <div className="mock-score-ring" style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" aria-hidden="true"><circle className="mock-score-track" cx="50" cy="50" r={radius} /><circle className="mock-score-value" cx="50" cy="50" r={radius} style={{ strokeDasharray: perimeter, strokeDashoffset: perimeter * (1 - value / 100) }} /></svg>
    <div><strong>{value}</strong><span>/100</span></div>
  </div>
}

function scoreLabel(score) {
  if (score >= 80) return 'Strong answer'
  if (score >= 60) return 'Good start'
  if (score > 0) return 'Needs more detail'
  return 'Submit an answer to get feedback'
}

export default function MockInterviewPage() {
  const { demoMode } = useAuth()
  const [phase, setPhase] = useState('setup')
  const [role, setRole] = useState('SDE')
  const [type, setType] = useState('Technical')
  const [difficulty, setDifficulty] = useState('Medium')
  const [questionCount, setQuestionCount] = useState(10)
  const [questions, setQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [draft, setDraft] = useState('')
  const [drafts, setDrafts] = useState({})
  const [responses, setResponses] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [starting, setStarting] = useState(false)
  const [ending, setEnding] = useState(false)
  const [activeInterviewId, setActiveInterviewId] = useState(null)
  const [sessionNotice, setSessionNotice] = useState('')
  const [remainingSeconds, setRemainingSeconds] = useState(45 * 60)
  const [roomTab, setRoomTab] = useState('room')
  const [feedbackTab, setFeedbackTab] = useState('overall')
  const [suggestionTab, setSuggestionTab] = useState('example')
  const [tipsExpanded, setTipsExpanded] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [micActive, setMicActive] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [displayStream, setDisplayStream] = useState(null)
  const [mediaNotice, setMediaNotice] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const [results, setResults] = useState(null)
  const recognitionRef = useRef(null)
  const cameraRef = useRef(null)
  const displayRef = useRef(null)
  const questionListRef = useRef(null)
  const currentQuestion = questions[questionIndex]
  const currentResponse = responses[questionIndex]
  const currentEvaluation = currentResponse?.answer === draft ? currentResponse.evaluation : null
  const answeredCount = Object.values(responses).filter((response) => response?.answer?.trim()).length

  useEffect(() => {
    if (phase !== 'interview' || remainingSeconds <= 0) return undefined
    const timeout = window.setTimeout(() => setRemainingSeconds((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearTimeout(timeout)
  }, [phase, remainingSeconds])

  useEffect(() => {
    if (cameraRef.current && cameraStream) cameraRef.current.srcObject = cameraStream
    if (displayRef.current && displayStream) displayRef.current.srcObject = displayStream
  }, [cameraStream, displayStream, roomTab])

  useEffect(() => () => {
    recognitionRef.current?.stop?.()
    window.speechSynthesis?.cancel?.()
  }, [])

  useEffect(() => () => {
    cameraStream?.getTracks().forEach((track) => track.stop())
  }, [cameraStream])

  useEffect(() => () => {
    displayStream?.getTracks().forEach((track) => track.stop())
  }, [displayStream])

  const startInterview = async () => {
    setStarting(true)
    setSessionNotice('')
    const localSet = getInterviewQuestionSet(role, type, difficulty, questionCount)
    let nextQuestions = localSet
    let interviewId = null
    if (!demoMode) {
      try {
        const response = await interviewAPI.start(role, type, difficulty, questionCount)
        const interview = response?.interview
        if (interview?.questions?.length) {
          nextQuestions = interview.questions.map((item, index) => ({
            ...item,
            id: item.id || String(index + 1),
            topic: item.topic || 'Interview question',
            keyPoints: item.keyPoints || [],
            guidance: item.guidance || '',
            sampleAnswer: item.sampleAnswer || '',
          }))
          interviewId = interview._id
        }
      } catch (error) {
        setSessionNotice(`Could not sync this session to your account. You can still practice locally. ${error.message || ''}`)
      }
    }
    setQuestions(nextQuestions)
    setActiveInterviewId(interviewId)
    setQuestionIndex(0)
    setDraft('')
    setDrafts({})
    setResponses({})
    setResults(null)
    setRemainingSeconds(45 * 60)
    setRoomTab('room')
    setShowHints(false)
    setPhase('interview')
    setStarting(false)
  }

  const selectQuestion = (index) => {
    if (index < 0 || index >= questions.length) return
    setQuestionIndex(index)
    setDraft(drafts[index] ?? responses[index]?.answer ?? '')
    setShowHints(false)
  }

  const submitAnswer = async () => {
    if (!draft.trim() || !currentQuestion || submitting) return
    setSubmitting(true)
    setSessionNotice('')
    try {
      let evaluation
      if (!demoMode && activeInterviewId) {
        const response = await interviewAPI.submitAnswer(activeInterviewId, questionIndex, draft.trim())
        evaluation = response.evaluation
      } else {
        evaluation = evaluateInterviewAnswer(currentQuestion, draft.trim())
      }
      setResponses((previous) => ({ ...previous, [questionIndex]: { answer: draft.trim(), evaluation } }))
      setDrafts((previous) => ({ ...previous, [questionIndex]: draft.trim() }))
    } catch (error) {
      const evaluation = evaluateInterviewAnswer(currentQuestion, draft.trim())
      setResponses((previous) => ({ ...previous, [questionIndex]: { answer: draft.trim(), evaluation } }))
      setDrafts((previous) => ({ ...previous, [questionIndex]: draft.trim() }))
      setSessionNotice(`Feedback was generated locally because the account service was unavailable. ${error.message || ''}`)
    } finally {
      setSubmitting(false)
    }
  }

  const finishInterview = async () => {
    if (ending) return
    setEnding(true)
    let summary
    const completedQuestions = questions.map((question, index) => ({ ...question, ...(responses[index] || {}) }))
    if (!demoMode && activeInterviewId) {
      try {
        const response = await interviewAPI.complete(activeInterviewId)
        const interview = response?.interview
        if (interview?.results) {
          summary = {
            ...interview.results,
            answeredCount: interview.answeredCount ?? answeredCount,
            strengths: interview.feedback?.strengths || [],
            weaknesses: interview.feedback?.weaknesses || [],
            improvements: interview.feedback?.improvements || [],
          }
        }
      } catch (error) {
        setSessionNotice(`The final summary could not sync to your account. Showing local feedback. ${error.message || ''}`)
      }
    }
    setResults(summary || summarizeInterview(completedQuestions))
    setPhase('results')
    setEnding(false)
    setMicActive(false)
    recognitionRef.current?.stop?.()
    window.speechSynthesis?.cancel?.()
  }

  const moveNext = () => {
    if (questionIndex < questions.length - 1) selectQuestion(questionIndex + 1)
    else finishInterview()
  }

  const skipQuestion = () => {
    setDrafts((previous) => { const next = { ...previous }; delete next[questionIndex]; return next })
    setDraft('')
    if (questionIndex < questions.length - 1) selectQuestion(questionIndex + 1)
    else finishInterview()
  }

  const toggleMicrophone = () => {
    if (micActive) {
      recognitionRef.current?.stop?.()
      setMicActive(false)
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setMediaNotice('Speech recognition is not available in this browser. You can type your answer instead.')
      return
    }
    try {
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.continuous = true
      recognition.interimResults = true
      const startingDraft = draft.trim()
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map((item) => item[0].transcript).join(' ').trim()
        const nextDraft = [startingDraft, transcript].filter(Boolean).join(' ')
        setDraft(nextDraft)
        setDrafts((previous) => ({ ...previous, [questionIndex]: nextDraft }))
      }
      recognition.onerror = (event) => {
        setMediaNotice(event.error === 'not-allowed' ? 'Microphone permission was denied. Allow microphone access in your browser settings to dictate an answer.' : `Speech recognition stopped: ${event.error}.`)
        setMicActive(false)
      }
      recognition.onend = () => setMicActive(false)
      recognitionRef.current = recognition
      recognition.start()
      setMediaNotice('')
      setMicActive(true)
    } catch {
      setMediaNotice('Could not start speech recognition. Check microphone permissions or type your answer.')
    }
  }

  const toggleCamera = async () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      setCameraStream(stream)
      setMediaNotice('Camera preview is local to this device and is not recorded or sent.')
    } catch (error) {
      setMediaNotice(error.name === 'NotAllowedError' ? 'Camera permission was denied. You can continue without video.' : 'Camera is unavailable. You can continue without video.')
    }
  }

  const toggleDisplay = async () => {
    if (displayStream) {
      displayStream.getTracks().forEach((track) => track.stop())
      setDisplayStream(null)
      return
    }
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setMediaNotice('Screen sharing is not supported in this browser.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
      stream.getVideoTracks()[0].addEventListener('ended', () => setDisplayStream(null), { once: true })
      setDisplayStream(stream)
      setMediaNotice('Screen preview is local to this device and is not recorded or sent.')
    } catch (error) {
      if (error.name !== 'NotAllowedError') setMediaNotice('Could not share the screen. You can continue without it.')
    }
  }

  const readQuestion = () => {
    if (!soundEnabled) {
      setMediaNotice('Turn on interviewer voice to read the question aloud.')
      return
    }
    if (!currentQuestion || !window.speechSynthesis) {
      setMediaNotice('Text-to-speech is not available in this browser.')
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question)
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  const copyText = async (text) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('Copied')
      window.setTimeout(() => setCopyStatus(''), 1800)
    } catch {
      setCopyStatus('Clipboard unavailable')
      window.setTimeout(() => setCopyStatus(''), 2500)
    }
  }

  const startNewSession = () => {
    recognitionRef.current?.stop?.()
    cameraStream?.getTracks().forEach((track) => track.stop())
    displayStream?.getTracks().forEach((track) => track.stop())
    setCameraStream(null)
    setDisplayStream(null)
    setQuestions([])
    setResponses({})
    setActiveInterviewId(null)
    setResults(null)
    setSessionNotice('')
    setDraft('')
    setDrafts({})
    setPhase('setup')
  }

  const currentScores = currentEvaluation?.scores || { technicalAccuracy: 0, communication: 0, clarity: 0, overall: 0 }
  const currentModelAnswer = currentQuestion?.sampleAnswer || ''
  const analysisResults = results || summarizeInterview(questions.map((question, index) => ({ ...question, ...(responses[index] || {}) })))

  return <div className="mock-page">
    <header className="mock-welcome">
      <div><h1>AI Mock Interview</h1><p>Practice interview questions, capture your answers, and review rubric-based feedback.</p></div>
      <div className="mock-quote"><Sparkles size={17} /><span>Practice today. Build confidence for your next conversation.</span></div>
    </header>

    <div className="mock-page-toolbar">
      <div className="mock-session-label"><Bot size={16} />{phase === 'setup' ? 'Interview practice' : `${role} · ${type} · ${difficulty}`}</div>
      {phase !== 'setup' && <button type="button" className="mock-new-session" onClick={startNewSession}><ArrowLeft size={14} />New Session</button>}
      <Link to="/career-roadmap">Skill Roadmap <ArrowRight size={14} /></Link>
    </div>
    {sessionNotice && <div className="mock-notice" role="status">{sessionNotice}</div>}

    {phase === 'setup' && <section className="mock-setup-layout">
      <Card className="mock-setup-card">
        <div className="mock-section-heading"><div><h2>Configure your practice session</h2><p>Choose the role, interview style, challenge level, and number of questions.</p></div><ShieldCheck size={20} /></div>
        <div className="mock-option-group"><label>Target role</label><div className="mock-choice-grid roles">{ROLE_OPTIONS.map((option) => <button type="button" key={option.id} className={role === option.id ? 'selected' : ''} onClick={() => setRole(option.id)}><strong>{option.label}</strong><small>{option.sub}</small>{role === option.id && <Check size={15} />}</button>)}</div></div>
        <div className="mock-option-group"><label>Interview type</label><div className="mock-choice-grid types">{TYPE_OPTIONS.map((option) => <button type="button" key={option.id} className={type === option.id ? 'selected' : ''} onClick={() => setType(option.id)}><strong>{option.label}</strong><small>{option.desc}</small>{type === option.id && <Check size={15} />}</button>)}</div></div>
        <div className="mock-setup-bottom"><div><div className="mock-option-group difficulty"><label>Difficulty</label><div>{DIFFICULTIES.map((value) => <button type="button" className={difficulty === value ? 'selected' : ''} key={value} onClick={() => setDifficulty(value)}>{value}</button>)}</div></div><div className="mock-option-group count"><label>Questions</label><div>{[5, 10].map((value) => <button type="button" className={questionCount === value ? 'selected' : ''} key={value} onClick={() => setQuestionCount(value)}>{value}</button>)}</div></div></div><Button variant="primary" size="lg" onClick={startInterview} disabled={starting} iconRight={starting ? LoaderCircle : ArrowRight}>{starting ? 'Preparing questions…' : 'Start Interview'}</Button></div>
        <p className="mock-privacy"><ShieldCheck size={14} />Answer feedback uses a transparent content checklist. Camera and screen previews stay on your device.</p>
      </Card>
      <aside className="mock-setup-aside"><Card><div className="mock-aside-icon"><ListOrdered /></div><h3>What to expect</h3><p>Your session includes {questionCount} {type.toLowerCase()} questions. You can skip questions, review hints, and return to earlier questions.</p><ul><li><CheckCircle2 />Your timer starts when the interview begins</li><li><CheckCircle2 />Your answers are evaluated one at a time</li><li><CheckCircle2 />Final feedback covers only submitted answers</li></ul></Card><Card className="mock-setup-tips"><h3><Lightbulb size={16} />Quick practice tips</h3>{TIPS.slice(0, 3).map((tip) => <p key={tip}><span />{tip}</p>)}</Card></aside>
    </section>}

    {phase === 'interview' && currentQuestion && <section className="mock-interview-layout">
      <main className="mock-main-column">
        <div className="mock-room-shell">
          <div className="mock-room-toolbar"><div className="mock-view-tabs" role="tablist" aria-label="Interview views">{[['room','Interview Room',Bot],['chat','Chat View',MessageSquare],['questions','Question List',ListOrdered]].map(([id,label,Icon]) => <button type="button" role="tab" aria-selected={roomTab === id} className={roomTab === id ? 'active' : ''} key={id} onClick={() => setRoomTab(id)}><Icon size={14} />{label}</button>)}</div><div className="mock-room-status"><span><Clock size={14} />Time Remaining</span><strong className={remainingSeconds < 300 ? 'urgent' : ''}><AlarmClock size={13} />{formatTime(remainingSeconds)}</strong><button type="button" className="mock-end-button" onClick={finishInterview} disabled={ending}>{ending ? 'Finishing…' : 'End Interview'}</button></div></div>

          {roomTab === 'room' && <div className="mock-room-content">
            <div className="mock-interviewer-stage"><div className="mock-live-badge"><i />Text Interviewer</div><div className="mock-avatar"><span className="mock-avatar-glow" /><Bot size={58} /></div><div className="mock-stage-caption"><span>Question {questionIndex + 1} of {questions.length}</span><strong>{currentQuestion.question}</strong></div>
              {cameraStream && <video ref={cameraRef} autoPlay muted playsInline className="mock-camera-preview" aria-label="Your local camera preview" />}{displayStream && <video ref={displayRef} autoPlay muted playsInline className="mock-display-preview" aria-label="Your local screen preview" />}
              <div className="mock-stage-controls"><button type="button" className={micActive ? 'active' : ''} onClick={toggleMicrophone} aria-label={micActive ? 'Stop voice input' : 'Start voice input'}>{micActive ? <Mic /> : <MicOff />}</button><button type="button" className={cameraStream ? 'active' : ''} onClick={toggleCamera} aria-label={cameraStream ? 'Turn camera off' : 'Turn camera on'}>{cameraStream ? <Camera /> : <CameraOff />}</button><button type="button" className={displayStream ? 'active' : ''} onClick={toggleDisplay} aria-label={displayStream ? 'Stop screen preview' : 'Share screen'}><MonitorUp /></button><button type="button" className={soundEnabled ? 'active' : ''} onClick={() => { setSoundEnabled((value) => !value); if (soundEnabled) window.speechSynthesis?.cancel?.() }} aria-label={soundEnabled ? 'Mute interviewer voice' : 'Enable interviewer voice'}>{soundEnabled ? <Volume2 /> : <VolumeX />}</button><button type="button" className="read-question" onClick={readQuestion} aria-label="Read question aloud"><Play /></button></div>
              <p className="mock-stage-caption">Camera and screen previews are local only. No video or audio is recorded.</p>
            </div>

            <div className="mock-answer-panel"><div className="mock-answer-tabs"><button type="button" className={!showHints ? 'active' : ''} onClick={() => setShowHints(false)}><MessageSquare size={13} />Your Answer</button><button type="button" className={showHints ? 'active' : ''} onClick={() => setShowHints(true)}><Lightbulb size={13} />AI Hints</button></div>
              {showHints ? <div className="mock-hints-pane"><h3>Think about these points</h3><p>{currentQuestion.guidance}</p><ul>{(currentQuestion.keyPoints || []).map((point) => <li key={point}><CheckCircle2 size={14} />{point}</li>)}</ul><button type="button" onClick={() => setShowHints(false)}>Back to your answer <ArrowRight size={14} /></button></div> : <><div className="mock-answer-input-wrap"><textarea aria-label="Your interview answer" value={draft} onChange={(event) => { setDraft(event.target.value); setDrafts((previous) => ({ ...previous, [questionIndex]: event.target.value })); setMediaNotice('') }} placeholder="Speak or type your answer here…" /><span>{draft.trim() ? draft.trim().split(/\s+/).length : 0} words</span></div><div className="mock-answer-actions"><button type="button" onClick={skipQuestion} disabled={ending}>{questionIndex === questions.length - 1 ? 'Skip & Finish' : 'Skip Question'}</button><button type="button" className="primary" onClick={submitAnswer} disabled={!draft.trim() || submitting}>{submitting ? <LoaderCircle className="mock-spin" size={15} /> : <Send size={15} />}{currentResponse && currentResponse.answer === draft ? 'Update Answer' : 'Submit Answer'}<ArrowRight size={15} /></button></div>{remainingSeconds === 0 && <div className="mock-media-notice">Time is up. Submit your answer or end the session to review your feedback.</div>}{mediaNotice && <div className="mock-media-notice" role="status">{mediaNotice}</div>}</>}
            </div>
          </div>}

          {roomTab === 'chat' && <div className="mock-chat-view"><div className="mock-chat-history" ref={questionListRef}>{questions.slice(0, questionIndex + 1).map((question, index) => <div className="mock-chat-turn" key={question.id || index}><div className="interviewer"><span><Bot size={15} /></span><div><small>Interviewer · {question.topic}</small><p>{question.question}</p></div></div>{responses[index]?.answer ? <div className="candidate"><span>You</span><p>{responses[index].answer}</p><small>{responses[index].evaluation?.score ?? 'Submitted'} / 100</small></div> : index === questionIndex ? <div className="candidate draft"><span>Your draft</span><p>{draft || 'Write or dictate your answer using the response box below.'}</p></div> : <div className="candidate skipped"><span>Skipped</span></div>}</div>)}</div><label className="mock-chat-compose"><textarea value={draft} onChange={(event) => { setDraft(event.target.value); setDrafts((previous) => ({ ...previous, [questionIndex]: event.target.value })) }} placeholder="Write your answer…" /><button type="button" onClick={submitAnswer} disabled={!draft.trim() || submitting}><Send size={15} />Submit</button></label><div className="mock-inline-nav"><button type="button" onClick={() => selectQuestion(questionIndex - 1)} disabled={questionIndex === 0}><ArrowLeft size={14} />Previous</button><button type="button" onClick={moveNext}>{questionIndex === questions.length - 1 ? 'Finish' : 'Next'}<ArrowRight size={14} /></button></div></div>}

          {roomTab === 'questions' && <div className="mock-question-list-view"><div className="mock-panel-title"><div><h2>Session questions</h2><p>{answeredCount} answered · {questions.length - answeredCount} remaining</p></div><span>{role} · {difficulty}</span></div>{questions.map((question, index) => <button type="button" key={question.id || index} className={`mock-question-row ${index === questionIndex ? 'current' : ''}`} onClick={() => selectQuestion(index)}><span className={`mock-question-index ${responses[index] ? 'answered' : ''}`}>{responses[index] ? <Check size={14} /> : index + 1}</span><span><strong>{question.question}</strong><small>{question.topic} · {question.difficulty || difficulty}</small></span><em>{responses[index] ? `${responses[index].evaluation?.score ?? 0}/100` : index === questionIndex ? 'Current' : 'Not answered'}</em><ChevronRight size={15} /></button>)}</div>}
        </div>

        <div className="mock-detail-grid">
          <Card className="mock-feedback-card"><div className="mock-panel-title"><div><h2>Answer Feedback</h2><p>{currentEvaluation ? 'Checklist-based feedback on this response' : 'Submit an answer to see a review'}</p></div>{currentEvaluation && <span className="mock-feedback-badge"><CheckCircle2 size={13} />Reviewed</span>}</div><div className="mock-feedback-tabs" role="tablist" aria-label="Feedback categories">{[['overall','Overall'],['content','Content'],['technical','Technical'],['communication','Communication']].map(([id,label]) => <button type="button" key={id} className={feedbackTab === id ? 'active' : ''} onClick={() => setFeedbackTab(id)}>{label}</button>)}</div>{currentEvaluation ? <div className="mock-feedback-body"><CircularScore value={feedbackTab === 'technical' ? currentScores.technicalAccuracy : feedbackTab === 'communication' ? currentScores.communication : feedbackTab === 'content' ? currentScores.clarity : currentScores.overall} /><div><h3>{scoreLabel(currentScores.overall)}</h3><p>{currentEvaluation.feedback}</p><small>{feedbackTab === 'technical' ? 'Concept coverage' : feedbackTab === 'communication' ? 'Structure and detail' : feedbackTab === 'content' ? 'Clarity and organization' : 'Overall checklist score'}</small></div></div> : <div className="mock-feedback-empty"><Target size={19} />Your submitted response will be reviewed against this question’s key points.</div>}{currentEvaluation && <div className="mock-metric-list">{[['Technical Accuracy',currentScores.technicalAccuracy,'teal'],['Depth & Examples',currentScores.communication,'blue'],['Clarity & Structure',currentScores.clarity,'purple'],['Overall',currentScores.overall,'orange']].map(([label,value,color]) => <div key={label}><span>{label}</span><strong>{value}%</strong><i className={color}><b style={{width:`${value}%`}} /></i></div>)}</div>}</Card>

          <Card className="mock-suggestion-card"><div className="mock-panel-title"><div><h2><Sparkles size={16} />Answer Suggestions</h2><p>Use as a learning example, not as a claim about your experience.</p></div></div><div className="mock-suggestion-tabs" role="tablist" aria-label="Answer suggestions"><button type="button" className={suggestionTab === 'example' ? 'active' : ''} onClick={() => setSuggestionTab('example')}>Example Answer</button><button type="button" className={suggestionTab === 'points' ? 'active' : ''} onClick={() => setSuggestionTab('points')}>Key Points</button></div><div className="mock-suggestion-content">{suggestionTab === 'example' ? currentModelAnswer || 'No example answer is available for this question.' : <ul>{(currentQuestion.keyPoints || []).map((point) => <li key={point}><CheckCircle2 size={14} />{point}</li>)}</ul>}</div>{suggestionTab === 'example' && currentModelAnswer && <button type="button" className="mock-copy-answer" onClick={() => copyText(currentModelAnswer)}><Copy size={14} />{copyStatus || 'Copy Example Answer'}</button>}</Card>
        </div>
      </main>

      <aside className="mock-side-column">
        <Card className="mock-progress-card"><div className="mock-panel-title"><h2>Interview Progress</h2><strong>{questionIndex + 1} / {questions.length}</strong></div><div className="mock-progress-meter"><ProgressBar value={((questionIndex + 1) / questions.length) * 100} variant="cyan" size="sm" /><span>{Math.round(((questionIndex + 1) / questions.length) * 100)}%</span></div><div className="mock-progress-list">{questions.slice(0, 5).map((question, index) => <button type="button" key={question.id || index} className={`${index === questionIndex ? 'current' : ''} ${responses[index] ? 'answered' : ''}`} onClick={() => selectQuestion(index)}><span>{responses[index] ? <Check size={13} /> : index === questionIndex ? index + 1 : <Circle size={13} />}</span><strong>{question.question}</strong><small>{question.difficulty || difficulty}</small></button>)}{questions.length > 5 && <button type="button" className="more-questions" onClick={() => setRoomTab('questions')}><ListOrdered size={14} />{questions.length - 5} more questions</button>}</div></Card>

        <Card className="mock-analysis-card"><div className="mock-panel-title"><h2>Question Analysis</h2><span>{currentQuestion.difficulty || difficulty}</span></div><div className="mock-analysis-row"><span><Target />Topic</span><strong>{currentQuestion.topic}</strong></div><div className="mock-analysis-row"><span><ListOrdered />Type</span><strong>{type}</strong></div><div className="mock-analysis-row"><span><Clock />Estimated time</span><strong>{currentQuestion.question.toLowerCase().includes('design') ? '8–10 min' : type === 'HR' ? '2–3 min' : '3–5 min'}</strong></div><div className="mock-analysis-row"><span><ShieldCheck />Key points</span><strong>{currentQuestion.keyPoints?.length || 0}</strong></div></Card>

        <Card className="mock-tips-card"><div className="mock-panel-title"><h2><Lightbulb size={17} />Practice Tips</h2><button type="button" onClick={() => setTipsExpanded((value) => !value)}>{tipsExpanded ? 'Show less' : 'View all'}</button></div><ul>{TIPS.slice(0, tipsExpanded ? TIPS.length : 5).map((tip) => <li key={tip}><CheckCircle2 size={15} />{tip}</li>)}</ul></Card>
      </aside>
    </section>}

    {phase === 'results' && <section className="mock-results-page"><div className="mock-results-heading"><div><h2>Interview Review</h2><p>Feedback is based only on answers submitted during this session.</p></div><span>{analysisResults.answeredCount} of {questions.length} answered</span></div><div className="mock-results-top"><Card className="mock-results-score"><span className="mock-results-status"><CheckCircle2 size={14} />Session complete</span><CircularScore value={analysisResults.overall || 0} size={160} /><h3>{scoreLabel(analysisResults.overall || 0)}</h3><p>{analysisResults.answeredCount ? `Reviewed ${analysisResults.answeredCount} submitted answer${analysisResults.answeredCount === 1 ? '' : 's'}.` : 'No answers were submitted in this session.'}</p></Card><div className="mock-results-metrics">{[['Technical Accuracy',analysisResults.technicalAccuracy,'teal'],['Communication',analysisResults.communication,'purple'],['Clarity',analysisResults.clarity,'blue']].map(([label,value,color]) => <Card className="mock-result-metric" key={label}><span>{label}</span><strong>{value || 0}%</strong><i className={color}><b style={{width:`${value || 0}%`}} /></i></Card>)}</div></div><div className="mock-results-lists">{[['Strengths',analysisResults.strengths,CheckCircle2,'strength'],['Areas to Improve',analysisResults.weaknesses,XCircle,'weak'],['Practice Suggestions',analysisResults.improvements,Lightbulb,'suggest']].map(([title,items,Icon,style]) => <Card className={`mock-result-list ${style}`} key={title}><h3><Icon size={17} />{title}</h3>{items?.length ? <ul>{items.map((item,index) => <li key={`${title}-${index}`}>{item}</li>)}</ul> : <p>No items to show yet.</p>}</Card>)}</div><div className="mock-results-actions"><span>Content-based practice feedback is not a hiring prediction.</span><div><Button variant="outline" size="sm" onClick={startNewSession}><RotateCcw size={14} />New Session</Button><Link to="/career-roadmap"><Button variant="primary" size="sm" iconRight={ArrowRight}>Practice skill gaps</Button></Link></div></div></section>}
  </div>
}
