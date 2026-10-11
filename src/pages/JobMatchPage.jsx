import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle, ArrowRight, BriefcaseBusiness, Building2, Check, CheckCircle2,
  CircleHelp, CloudUpload, Code2, FileText, Lightbulb, LoaderCircle, MapPin,
  Search, ShieldCheck, Sparkles, Target, TrendingUp, XCircle, Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { jobAPI } from '../services/api'
import { analyzeJobMatch } from '../../shared/jobMatchAnalysis.js'

const SAMPLES = [
  {
    company: 'Amazon',
    text: `Software Development Engineer Intern — Amazon\n\nAbout the role\nBuild and maintain scalable backend services and web applications with a collaborative engineering team.\n\nRequirements\n• Strong problem solving skills and knowledge of data structures and algorithms.\n• Experience with Java, Python, or C++.\n• Work with SQL and NoSQL databases.\n• Use Git for version control and code reviews.\n• Familiarity with AWS, REST APIs, and system design.\n\nPreferred qualifications\n• Docker, Kubernetes, and CI/CD experience.`,
  },
  {
    company: 'Frontend',
    text: `Frontend Developer Intern\n\nResponsibilities\nBuild accessible, responsive web experiences with the product and design teams.\n\nRequired qualifications\n• Proficiency in JavaScript, TypeScript, React, HTML, and CSS.\n• Knowledge of Git, communication, and problem solving.\n\nNice to have\n• Node.js, CI/CD, and experience with cloud deployment.`,
  },
  {
    company: 'Data',
    text: `Junior Data Analyst\n\nRequirements\n• Use Python, SQL, and data analysis to answer product questions.\n• Apply statistics and communicate findings with clear visualizations.\n• Familiarity with machine learning is preferred.`,
  },
]

function ScoreRing({ score }) {
  const radius = 43
  const perimeter = 2 * Math.PI * radius
  return <div className="job-score-ring">
    <svg viewBox="0 0 100 100" aria-hidden="true"><circle className="job-ring-track" cx="50" cy="50" r={radius} /><circle className="job-ring-value" cx="50" cy="50" r={radius} style={{ strokeDasharray: perimeter, strokeDashoffset: perimeter * (1 - score / 100) }} /></svg>
    <div><strong>{score}</strong><span>/ 100</span></div>
  </div>
}

function SkillBar({ item }) {
  return <div className="job-skill-bar-row">
    <span className="job-skill-mark"><Code2 size={13} /></span><span className="job-skill-label">{item.skill}</span>
    <span className="job-skill-track"><i className={item.current ? 'covered' : ''} style={{ width: `${item.current}%` }} /><b style={{ left: `${item.required}%` }} /></span>
    <span className="job-skill-percent">{item.current ? 'In profile' : 'Gap'}</span>
  </div>
}

function SkillPills({ names, positive = false }) {
  if (!names.length) return <p className="job-muted">Nothing detected in this category.</p>
  return <div className="job-pills">{names.map((name) => <span key={name} className={positive ? 'positive' : ''}>{positive ? <Check size={12} /> : null}{name}</span>)}</div>
}

export default function JobMatchPage() {
  const { demoMode, getOnboardingData } = useAuth()
  const candidate = getOnboardingData?.() || {}
  const inputRef = useRef(null)
  const [jobDescription, setJobDescription] = useState('')
  const [jobFile, setJobFile] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const runAnalysis = async (description = jobDescription) => {
    const text = description.trim()
    if (text.length < 30) {
      setError('Paste a job description with its requirements (at least 30 characters).')
      return
    }
    if (text.length > 5000) {
      setError('Keep the job description under 5,000 characters.')
      return
    }
    setError('')
    setAnalyzing(true)
    setAnalysis(null)
    try {
      if (demoMode) setAnalysis(analyzeJobMatch(text, candidate))
      else {
        const response = await jobAPI.analyze(text)
        setAnalysis(response.analysis)
      }
    } catch (cause) {
      setError(cause.message || 'The job description could not be analyzed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const loadSample = (sample) => {
    setJobDescription(sample.text)
    setJobFile('')
    setError('')
    runAnalysis(sample.text)
  }

  const uploadJobDescription = async (file) => {
    if (!file) return
    setError('')
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF job description.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('The PDF is larger than the 10 MB upload limit.')
      return
    }
    try {
      const [pdfjs, worker] = await Promise.all([
        import('pdfjs-dist'),
        import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
      ])
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default
      const bytes = new Uint8Array(await file.arrayBuffer())
      if (new TextDecoder().decode(bytes.subarray(0, 5)) !== '%PDF-') throw new Error('This file is not a valid PDF.')
      const pdf = await pdfjs.getDocument({ data: bytes }).promise
      const pages = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) => {
        const page = await pdf.getPage(index + 1)
        const content = await page.getTextContent()
        return content.items.map((item) => item.str).join(' ')
      }))
      const text = pages.join('\n').trim()
      if (!text) throw new Error('No selectable text was found in this PDF. Scanned image PDFs are not supported yet.')
      setJobDescription(text.slice(0, 5000))
      setJobFile(file.name)
      await runAnalysis(text.slice(0, 5000))
    } catch (cause) {
      setError(cause.message || 'Could not read this PDF.')
    }
  }

  const matched = analysis?.matchedSkills || []
  const missing = analysis?.missingSkills || []
  const optionalMatched = analysis?.matchedOptionalSkills || []
  const optionalMissing = analysis?.missingOptionalSkills || []
  const recommendations = analysis?.recommendations || []
  const comparison = analysis?.skillComparison || []
  const role = candidate.targetRole || 'Your saved career goal'
  const profileSkillCount = candidate.skills?.length || 0

  return <div className="job-page">
    <header className="job-welcome">
      <div><h1>Job Match Analyzer</h1><p>Paste a job description and compare its requirements with your saved skills and projects.</p></div>
      <div className="job-quote"><Sparkles size={17} /><span>See where your experience aligns and what to build next.</span></div>
    </header>

    <section className="job-top-grid">
      <article className="job-input-card">
        <div className="job-input-heading"><div><h2><FileText size={17} /> Paste Job Description</h2><p>Use a job post or try a sample to explore the analyzer.</p></div><div className="job-samples">{SAMPLES.map((sample) => <button key={sample.company} type="button" onClick={() => loadSample(sample)}>{sample.company}</button>)}</div></div>
        <textarea value={jobDescription} maxLength={5000} onChange={(event) => { setJobDescription(event.target.value); setAnalysis(null); setError('') }} placeholder="Paste the role, responsibilities, and required or preferred skills here…" aria-label="Job description" />
        <div className="job-input-footer"><span>{jobDescription.length}/5000 characters{jobFile ? ` · ${jobFile}` : ''}</span><div><input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(event) => { uploadJobDescription(event.target.files?.[0]); event.target.value = '' }} /><button className="job-upload-button" type="button" onClick={() => inputRef.current?.click()}><CloudUpload size={15} /> Upload JD (PDF)</button><button className="job-analyze-button" type="button" disabled={analyzing} onClick={() => runAnalysis()}>{analyzing ? <LoaderCircle size={16} className="job-spin" /> : <Zap size={16} />}{analyzing ? 'Analyzing…' : 'Analyze Job'}<ArrowRight size={15} /></button></div></div>
        {error && <div className="job-error" role="alert"><AlertCircle size={15} />{error}</div>}
      </article>

      <article className="job-score-card">
        <div className="job-card-title"><h2>Overall Job Match</h2>{analysis && <span className="job-live-label"><CheckCircle2 size={13} />Based on profile coverage</span>}</div>
        {analysis ? <div className="job-score-content"><ScoreRing score={analysis.matchScore || 0} /><div className="job-score-message"><div className="job-score-verdict"><Target size={17} />{analysis.matchScore >= 75 ? 'Strong profile overlap' : analysis.matchScore >= 45 ? 'Some requirements match' : 'Build more profile evidence'}</div><p>{analysis.summary}</p><small>This is a comparison of listed skills and project text, not a hiring or interview prediction.</small></div></div>
          : <div className="job-score-empty"><div className="job-empty-target"><Search /></div><h3>Ready when you are</h3><p>Analyze a job description to see how its requirements line up with your profile.</p><span><CircleHelp size={13} /> No match score is shown before analysis</span></div>}
      </article>
    </section>

    {analysis && <>
      <section className="job-skills-grid">
        <article className="job-panel job-coverage-panel"><div className="job-panel-heading"><div><h2>Skill Match</h2><p>Profile coverage for skills named in this posting</p></div><span className="job-count-chip">{comparison.filter((item) => !item.isOptional).length} required</span></div>
          {comparison.filter((item) => !item.isOptional).length ? <div className="job-skill-bars">{comparison.filter((item) => !item.isOptional).map((item) => <SkillBar key={item.skill} item={item} />)}</div> : <p className="job-muted">No recognized skill requirements were found in this description.</p>}
        </article>
        <article className="job-panel"><div className="job-panel-heading"><h2>Matched Skills</h2><span className="job-count-chip good">{matched.length}</span></div><SkillPills names={matched} positive /></article>
        <article className="job-panel"><div className="job-panel-heading"><h2>Missing Skills</h2><span className="job-count-chip gap">{missing.length}</span></div>{missing.length ? <div className="job-gap-list">{missing.slice(0, 7).map((skill) => <div key={skill.name}><span className="job-gap-icon"><XCircle size={14} /></span><span>{skill.name}</span><em className={`priority-${skill.priority?.toLowerCase()}`}>{skill.priority}</em></div>)}</div> : <p className="job-muted">All recognized required skills appear in your saved profile.</p>}</article>
        <article className="job-panel"><div className="job-panel-heading"><h2>Optional / Nice to Have</h2><span className="job-count-chip">{optionalMatched.length + optionalMissing.length}</span></div>{optionalMatched.length + optionalMissing.length ? <div className="job-pills">{optionalMatched.map((name) => <span className="positive" key={name}><Check size={12} />{name}</span>)}{optionalMissing.map((skill) => <span key={skill.name}>{skill.name}</span>)}</div> : <p className="job-muted">No optional skills were identified in the posting.</p>}</article>
      </section>

      <section className="job-bottom-grid">
        <article className="job-panel job-role-card"><div className="job-panel-heading"><h2>Job Role Insights</h2><BriefcaseBusiness size={16} className="job-blue-icon" /></div><div className="job-role-identity"><div className="job-company-mark">{analysis.company ? analysis.company.slice(0, 1) : <Building2 size={19} />}</div><div><h3>{analysis.jobTitle}</h3><p>{analysis.company || 'Company not identified from the text'}</p></div></div><div className="job-role-facts"><span><Target />Target profile<strong>{role}</strong></span><span><TrendingUp />Recognized requirements<strong>{analysis.requirementCount || 0}</strong></span><span><CheckCircle2 />Profile skills<strong>{profileSkillCount} saved</strong></span><span><MapPin />Evidence sources<strong>Skills & projects</strong></span></div><div className="job-role-actions"><button type="button" onClick={() => document.querySelector('.job-input-card textarea')?.focus()}>Review job description <ArrowRight size={14} /></button><Link to="/onboarding">Update profile <ArrowRight size={14} /></Link></div></article>

        <article className="job-panel job-recommendations"><div className="job-panel-heading"><div><h2><Lightbulb size={17} /> Top Recommendations</h2><p>Start with requirements missing from your saved profile.</p></div><Link to="/career-roadmap" aria-label="Open career roadmap"><ArrowRight size={15} /></Link></div>{recommendations.length ? <div className="job-recommendation-list">{recommendations.slice(0, 5).map((item, index) => <div key={item.skill || index}><span>{index + 1}</span><div><strong>{item.title || item.skill}</strong><p>{item.description || item}</p></div><em>{item.priority || 'Review'}</em></div>)}</div> : <p className="job-muted">No skill gaps to prioritize from the recognized requirements.</p>}<Link className="job-roadmap-link" to="/career-roadmap">Open career roadmap <ArrowRight size={14} /></Link></article>

        <article className="job-panel job-insight-card"><div className="job-panel-heading"><h2><Sparkles size={17} /> Match Insights</h2></div><p>{analysis.summary}</p><div className="job-disclaimer"><ShieldCheck size={15} /><span>Only skills and project information in your saved profile count as evidence. Update your profile to improve this comparison.</span></div><Link to="/onboarding">Edit profile details <ArrowRight size={14} /></Link></article>
      </section>
    </>}
  </div>
}
