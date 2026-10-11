import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle, ArrowDownToLine, ArrowRight, Check, CheckCircle2, Circle,
  ClipboardCheck, FileSearch, FileText, Lightbulb,
  RefreshCw, ShieldCheck, Sparkles, Target, UploadCloud, X, Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { resumeAPI } from '../services/api'
import { analyzeResumeText } from '../../shared/resumeAnalysis.js'

const TABS = [
  { id: 'analysis', label: 'Analyze Resume', icon: FileSearch },
  { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
  { id: 'keywords', label: 'Keywords', icon: Target },
  { id: 'ats', label: 'ATS Insights', icon: ShieldCheck },
  { id: 'export', label: 'Export Report', icon: ArrowDownToLine },
]

const SCORE_CARDS = [
  ['skills', 'Skills Match', 'teal'],
  ['projects', 'Projects', 'blue'],
  ['experience', 'Experience', 'orange'],
  ['keywords', 'Keywords', 'purple'],
  ['ats', 'Text Structure', 'teal'],
]

function ScoreRing({ score = 0 }) {
  const radius = 43
  const circumference = 2 * Math.PI * radius
  return <div className="resume-score-ring">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle className="resume-ring-track" cx="50" cy="50" r={radius} />
      <circle className="resume-ring-value" cx="50" cy="50" r={radius} style={{ strokeDasharray: circumference, strokeDashoffset: circumference * (1 - score / 100) }} />
    </svg>
    <div><strong>{score}</strong><span>/100</span></div>
  </div>
}

function ScoreBar({ score, color = 'teal' }) {
  return <span className={`resume-progress ${color}`}><i style={{ width: `${score}%` }} /></span>
}

function EmptyState({ onChoose, analyzing, error }) {
  return <div className="resume-empty-state">
    <div className="resume-empty-icon">{analyzing ? <RefreshCw className="animate-spin" /> : <UploadCloud />}</div>
    <h3>{analyzing ? 'Reading your resume…' : 'Start with your resume'}</h3>
    <p>{analyzing ? 'Extracting text and preparing your personalized review.' : 'Upload a PDF to see a preview and an analysis based on its actual content.'}</p>
    {!analyzing && <button className="resume-primary-button" onClick={onChoose}><UploadCloud size={17} /> Choose PDF</button>}
    {error && <div className="resume-error" role="alert"><AlertCircle size={15} />{error}</div>}
    <small>PDF only · Maximum 10 MB · Scanned image PDFs are not supported yet</small>
  </div>
}

export default function ResumeAnalyzerPage() {
  const { demoMode, getOnboardingData } = useAuth()
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [rawText, setRawText] = useState('')
  const [activeTab, setActiveTab] = useState('analysis')
  const [analyzing, setAnalyzing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const targetRole = getOnboardingData?.()?.targetRole || getOnboardingData?.()?.careerGoal || ''

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const processFile = async (uploaded) => {
    if (!uploaded) return
    setError('')
    if (!uploaded.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF file.')
      return
    }
    if (uploaded.size > 10 * 1024 * 1024) {
      setError('The PDF is larger than the 10 MB upload limit.')
      return
    }

    setAnalyzing(true)
    setResult(null)
    try {
      const [pdfjs, worker] = await Promise.all([
        import('pdfjs-dist'),
        import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
      ])
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default
      const bytes = new Uint8Array(await uploaded.arrayBuffer())
      if (new TextDecoder().decode(bytes.subarray(0, 5)) !== '%PDF-') throw new Error('This file is not a valid PDF.')
      const pdf = await pdfjs.getDocument({ data: bytes }).promise
      const pages = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) => {
        const page = await pdf.getPage(index + 1)
        const content = await page.getTextContent()
        return content.items.map((item) => item.str).join(' ')
      }))
      const extracted = pages.join('\n').trim()
      if (!extracted) throw new Error('No selectable text was found. Scanned image PDFs need OCR and cannot be analyzed yet.')

      let analysis
      if (demoMode) analysis = analyzeResumeText(extracted, targetRole)
      else {
        const response = await resumeAPI.analyze(extracted.slice(0, 100000), uploaded.name, uploaded.size)
        analysis = response.analysis
      }
      setRawText(extracted)
      setResult(analysis)
      setFile({ name: uploaded.name, size: uploaded.size, pages: pdf.numPages })
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous)
        return URL.createObjectURL(uploaded)
      })
      setActiveTab('analysis')
    } catch (cause) {
      setError(cause.message || 'Could not read this PDF. Please try another file.')
    } finally {
      setAnalyzing(false)
    }
  }

  const removeResume = () => {
    setFile(null)
    setResult(null)
    setRawText('')
    setError('')
    setPreviewUrl((previous) => { if (previous) URL.revokeObjectURL(previous); return '' })
  }

  const exportReport = () => {
    if (!result) return
    const report = [
      'CAREER COPILOT — RESUME REVIEW',
      `File: ${file?.name || 'Resume'}`,
      `Target role: ${targetRole || 'Not specified'}`,
      `Content review score: ${result.atsScore}/100`,
      '', result.analysisNote || 'Content-based review of extracted text.',
      '', 'SCORE BREAKDOWN', ...SCORE_CARDS.map(([key, label]) => `${label}: ${result.scores?.[key] ?? 0}/100`),
      '', 'STRENGTHS', ...(result.strengths || []).map((item) => `• ${item}`),
      '', 'AREAS TO IMPROVE', ...(result.weaknesses || []).map((item) => `• ${item}`),
      '', 'ROLE KEYWORDS TO REVIEW', ...(result.missingKeywords || []).map((item) => `• ${item}`),
      '', 'SUGGESTIONS', ...(result.suggestions || []).map((item) => `• ${item}`),
      '', 'ORIGINAL EXTRACTED RESUME TEXT', rawText,
    ].join('\n')
    const url = URL.createObjectURL(new Blob([report], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${file?.name?.replace(/\.pdf$/i, '') || 'resume'}-review.txt`
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const score = result?.atsScore ?? 0
  const strengths = result?.strengths || []
  const weaknesses = result?.weaknesses || []
  const missing = result?.missingKeywords || []
  const suggestions = result?.suggestions || []
  const checklist = result?.checklist || []

  return <div className="resume-page">
    <header className="resume-welcome">
      <div><h1>Resume Analyzer</h1><p>Get a clear review of your resume’s content, role keywords, and next improvements.</p></div>
      <div className="resume-quote"><Sparkles size={17} /><span>A focused, tailored resume makes your experience easier to understand.</span></div>
    </header>

    <div className="resume-tabs" role="tablist" aria-label="Resume analysis sections">
      {TABS.map(({ id, label, icon: Icon }) => <button key={id} type="button" role="tab" aria-selected={activeTab === id} className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>
        <Icon size={15} />{label}
      </button>)}
      {result && <button type="button" className="resume-download-tab" onClick={exportReport}><ArrowDownToLine size={15} /> Download</button>}
    </div>

    {!result ? <section className="resume-first-upload">
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(event) => { processFile(event.target.files?.[0]); event.target.value = '' }} />
      <div className={`resume-dropzone ${dragging ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); processFile(event.dataTransfer.files?.[0]) }}>
        <EmptyState onChoose={() => inputRef.current?.click()} analyzing={analyzing} error={error} />
      </div>
    </section> : <>
      <div className="resume-file-strip">
        <div className="resume-file-info"><span className="resume-pdf-icon"><FileText size={18} /></span><div><strong title={file.name}>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB · {file.pages} {file.pages === 1 ? 'page' : 'pages'} · Reviewed just now</small></div></div>
        <div className="resume-file-actions"><button onClick={() => inputRef.current?.click()} type="button"><RefreshCw size={14} /> Replace</button><button className="remove" onClick={removeResume} type="button"><X size={14} /> Remove</button></div>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(event) => { processFile(event.target.files?.[0]); event.target.value = '' }} />
      </div>
      {error && <div className="resume-error resume-inline-error" role="alert"><AlertCircle size={15} />{error}</div>}

      {activeTab === 'analysis' && <section className="resume-analysis-grid">
        <article className="resume-preview-card">
          <div className="resume-card-heading"><div><h2>Resume Preview</h2><p>PDF text extraction · {file.pages} pages</p></div><span className="resume-safe-label"><CheckCircle2 size={14} /> Text extracted</span></div>
          <iframe title={`PDF preview: ${file.name}`} src={previewUrl} className="resume-pdf-preview" />
        </article>

        <div className="resume-report-column">
          <article className="resume-score-card">
            <ScoreRing score={score} />
            <div className="resume-score-copy"><div className="resume-card-heading"><div><h2>Resume Content Score</h2><p>{score >= 75 ? 'Strong foundation' : score >= 50 ? 'Room to improve' : 'Several basics need attention'}</p></div><span className="resume-status">{score >= 75 ? 'Good' : score >= 50 ? 'Fair' : 'Getting started'}</span></div><p>{result.analysisNote || 'A content-based review of your extracted resume text.'}</p></div>
            <button className="resume-primary-button" onClick={exportReport}><ArrowDownToLine size={16} /> Download Review</button>
          </article>

          <div className="resume-score-cards">{SCORE_CARDS.map(([key, label, color]) => <article className="resume-mini-score" key={key}><small>{label}</small><strong>{result.scores?.[key] ?? 0}<span>/100</span></strong><ScoreBar score={result.scores?.[key] ?? 0} color={color} /></article>)}</div>

          <div className="resume-feedback-grid">
            <article className="resume-info-card"><div className="resume-card-heading"><h3>Strengths</h3><span className="resume-count good">{strengths.length}</span></div>{strengths.length ? <ul className="resume-feedback-list">{strengths.map((item, index) => <li key={index}><CheckCircle2 />{item}</li>)}</ul> : <p className="resume-muted">No clear strengths detected yet.</p>}</article>
            <article className="resume-info-card"><div className="resume-card-heading"><h3>Areas to Improve</h3><span className="resume-count warn">{weaknesses.length}</span></div>{weaknesses.length ? <ul className="resume-feedback-list warning">{weaknesses.slice(0, 5).map((item, index) => <li key={index}><AlertCircle />{item}</li>)}</ul> : <p className="resume-muted">No high-priority gaps detected.</p>}</article>
            <article className="resume-info-card resume-keyword-card"><div className="resume-card-heading"><h3>Role Keywords to Review</h3><span className="resume-count">{missing.length}</span></div><p className="resume-muted">Terms are suggestions only. Include them only if they reflect your experience.</p><div className="resume-keyword-list">{missing.length ? missing.slice(0, 8).map((word) => <span key={word}>{word}</span>) : <span className="resume-keyword-good">All checked terms found</span>}</div></article>
          </div>

          <div className="resume-lower-grid">
            <article className="resume-info-card resume-suggestions-card"><div className="resume-card-heading"><div><h3>Suggestions based on your resume</h3><p>Practical next steps from the extracted content</p></div><button className="resume-inline-link" onClick={() => setActiveTab('suggestions')}>View all <ArrowRight size={14} /></button></div>{suggestions.slice(0, 3).map((item, index) => <div className="resume-suggestion-row" key={index}><Zap size={15} /><span>{item}</span></div>)}
              {result.beforeAfter?.length > 0 && <div className="resume-rewrite"><strong>Example bullet to refine</strong><div><span>Current</span><p>{result.beforeAfter[0].before}</p></div><div><span>Try adding detail</span><p>{result.beforeAfter[0].after}</p></div></div>}
            </article>
            <article className="resume-info-card"><div className="resume-card-heading"><div><h3>Resume Checklist</h3><p>{checklist.filter((item) => item.done).length} / {checklist.length} content checks</p></div><ClipboardCheck size={17} className="resume-blue-icon" /></div><ul className="resume-checklist">{checklist.map((item) => <li key={item.label} className={item.done ? 'done' : ''}>{item.done ? <CheckCircle2 /> : <Circle />}{item.label}</li>)}</ul></article>
          </div>
        </div>
      </section>}

      {activeTab === 'suggestions' && <section className="resume-tab-panel"><div className="resume-panel-title"><Lightbulb /><div><h2>Suggestions for your resume</h2><p>Recommendations are based on text found in {file.name}. Verify details before making changes.</p></div></div><div className="resume-suggestion-grid">{suggestions.map((item, index) => <article key={index}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></article>)}</div>{result.beforeAfter?.length > 0 && <article className="resume-info-card resume-full-rewrite"><h3>Rewrite example</h3><p className="resume-muted">This suggestion does not add accomplishments or numbers that were not in your source.</p><div><small>Current wording</small><p>{result.beforeAfter[0].before}</p></div><div><small>Suggested direction</small><p>{result.beforeAfter[0].after}</p></div></article>}</section>}

      {activeTab === 'keywords' && <section className="resume-tab-panel"><div className="resume-panel-title"><Target /><div><h2>Role keyword review</h2><p>Compared with {targetRole || 'a general software role'} using extracted text. Add only keywords you can support with experience.</p></div></div><div className="resume-keyword-columns"><article className="resume-info-card"><h3>Found in your resume <span className="resume-count good">{result.matchedKeywords?.length || 0}</span></h3><div className="resume-keyword-list">{result.matchedKeywords?.length ? result.matchedKeywords.map((word) => <span className="resume-keyword-good" key={word}><Check size={12} />{word}</span>) : <p className="resume-muted">No keywords from this role group were detected.</p>}</div></article><article className="resume-info-card"><h3>Not detected <span className="resume-count">{missing.length}</span></h3><div className="resume-keyword-list">{missing.length ? missing.map((word) => <span key={word}>{word}</span>) : <p className="resume-muted">All checked terms were detected.</p>}</div></article></div></section>}

      {activeTab === 'ats' && <section className="resume-tab-panel"><div className="resume-panel-title"><ShieldCheck /><div><h2>ATS and text extraction insights</h2><p>These checks use extracted text only. They do not reproduce a particular applicant tracking system or inspect visual PDF layout.</p></div></div><div className="resume-ats-grid">{SCORE_CARDS.map(([key, label, color]) => <article className="resume-info-card" key={key}><div className="resume-card-heading"><h3>{label}</h3><strong>{result.scores?.[key] ?? 0}/100</strong></div><ScoreBar score={result.scores?.[key] ?? 0} color={color} /></article>)}</div><article className="resume-info-card resume-format-card"><h3>Text review notes</h3><ul className="resume-feedback-list">{(result.formattingIssues || []).map((issue, index) => <li key={index}><AlertCircle />{issue}</li>)}</ul></article></section>}

      {activeTab === 'export' && <section className="resume-tab-panel resume-export-panel"><div className="resume-export-icon"><ArrowDownToLine /></div><h2>Download your resume review</h2><p>Export a text report with your scores, strengths, suggestions, missing role keywords, and the extracted source text. This creates a review report; it does not modify the original PDF.</p><button className="resume-primary-button" onClick={exportReport}><ArrowDownToLine size={17} /> Download .txt report</button><div className="resume-export-note"><FileText size={17} /><span>{file.name} · original PDF remains unchanged</span></div></section>}
    </>}
  </div>
}
