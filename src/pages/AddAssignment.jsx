import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAssignments } from '../context/AssignmentsContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { STATUSES, DEFAULT_STATUS, statusLabel } from '../lib/status.js'
import { typeAccent } from '../lib/accents.js'
import { typeIcon, PaperclipIcon, LinkIcon } from '../components/Icons.jsx'

const TYPES = ['Homework', 'Quiz', 'Exam', 'Project', 'Paper', 'Application', 'Other']

// The default due time for a new assignment: 11:59 PM today (local).
function defaultDueLocal() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T23:59`
}

function makeEmptyForm() {
  return {
    title: '',
    courseId: '',
    dueDate: defaultDueLocal(),
    type: 'Homework',
    customType: '',
    priority: 'Normal',
    status: DEFAULT_STATUS,
    totalProblems: '',
    completedProblems: 0,
    notes: '',
  }
}

// "HH:mm" (24h) → a friendly "9:00 AM" label.
function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

// ISO → the local "YYYY-MM-DDTHH:mm" string a datetime-local input expects.
function toLocalInput(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Fill the form from an existing assignment (for edit mode). A type that isn't
// one of the presets becomes the custom "Other" value.
function fromAssignment(a) {
  // Legacy assignments used "Test"; it's now "Exam".
  const type = a.type === 'Test' ? 'Exam' : a.type
  const known = TYPES.includes(type)
  return {
    title: a.title ?? '',
    courseId: a.courseId ?? '',
    dueDate: a.dueDate ? toLocalInput(a.dueDate) : '',
    type: known ? type : 'Other',
    customType: known ? '' : type,
    priority: a.priority ?? 'Normal',
    status: a.status ?? DEFAULT_STATUS,
    totalProblems: a.totalProblems ? String(a.totalProblems) : '',
    completedProblems: a.completedProblems ?? 0,
    notes: a.notes ?? '',
  }
}

export default function AddAssignment() {
  const { id } = useParams()
  const { courses, addAssignment, updateAssignment, assignments } = useAssignments()
  const toast = useToast()
  const navigate = useNavigate()

  const editing = Boolean(id)
  const existing = editing ? assignments.find((a) => a.id === id) : null

  const [form, setForm] = useState(existing ? fromAssignment(existing) : makeEmptyForm())
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Prefill once the assignment is available (e.g. on a direct page load where
  // data hasn't finished fetching yet).
  useEffect(() => {
    if (existing) setForm(fromAssignment(existing))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const selectedCourse = courses.find((c) => c.id === form.courseId)

  // Replace just the time portion of the due date, keeping the chosen day.
  function setDueTime(hhmm) {
    const datePart = (form.dueDate || defaultDueLocal()).slice(0, 10)
    set('dueDate', `${datePart}T${hhmm}`)
  }

  function buildPayload() {
    const course = courses.find((c) => c.id === form.courseId)
    const total = Math.max(0, parseInt(form.totalProblems, 10) || 0)
    const completed = Math.min(Math.max(0, parseInt(form.completedProblems, 10) || 0), total)
    return {
      title: form.title.trim(),
      courseId: form.courseId,
      type: form.type === 'Other' ? form.customType.trim() || 'Other' : form.type,
      subtitle: course ? course.name : 'General',
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : new Date().toISOString(),
      priority: form.priority,
      status: form.status,
      totalProblems: total,
      completedProblems: completed,
      notes: form.notes.trim(),
    }
  }

  function validate() {
    if (!form.title.trim()) return 'Please add an assignment title.'
    if (!form.dueDate) return 'Please set a due date.'
    return ''
  }

  async function handleSave(addAnother) {
    const msg = validate()
    if (msg) {
      setError(msg)
      return
    }
    setBusy(true)

    if (editing) {
      await updateAssignment(id, buildPayload())
      setBusy(false)
      toast('Assignment updated')
      navigate('/assignments')
      return
    }

    const newId = await addAssignment(buildPayload())
    setBusy(false)

    if (!newId) {
      setError('Could not save the assignment. Please try again.')
      return
    }
    if (addAnother) {
      setForm(makeEmptyForm())
      setError('')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-6 md:px-8">
      <div className="mb-5">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {editing ? 'Edit Assignment' : 'Add New Assignment'}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {editing
            ? 'Update the details below and save your changes.'
            : 'Fill in the details below to keep your academic momentum going.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Main form card */}
        <div className="rounded-2xl bg-white dark:bg-ink-card p-6 border border-slate-200 shadow-card dark:border-ink-border lg:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wide text-brand-600">
            Assignment Title
          </label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Molecular Biology Lab Report"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:bg-slate-700"
          />

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                Course Name <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <select
                value={form.courseId}
                onChange={(e) => set('courseId', e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">Due Date</label>
              <input
                type="datetime-local"
                value={form.dueDate}
                onChange={(e) => set('dueDate', e.target.value)}
                className="mt-2 block h-[42px] w-full min-w-0 appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDueTime('23:59')}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-600 dark:text-slate-300 dark:hover:border-brand-500"
                >
                  11:59 PM
                </button>
                {selectedCourse?.startTime && (
                  <button
                    type="button"
                    onClick={() => setDueTime(selectedCourse.startTime)}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-600 dark:text-slate-300 dark:hover:border-brand-500"
                  >
                    Class time · {formatTime(selectedCourse.startTime)}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">Assignment Type</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {TYPES.map((t) => {
                const Icon = typeIcon[t]
                const selected = form.type === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set('type', t)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      selected
                        ? `${typeAccent(t).solid} shadow-soft`
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {t}
                  </button>
                )
              })}
            </div>
            {form.type === 'Other' && (
              <input
                value={form.customType}
                onChange={(e) => set('customType', e.target.value)}
                placeholder="Enter a custom type (e.g. Lab Report)"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:bg-slate-700"
              />
            )}
          </div>

          <div className="mt-5">
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">Status</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUSES.map((s) => {
                const selected = form.status === s.value
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => set('status', s.value)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      selected
                        ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${selected ? 'bg-white' : s.dot}`} />
                    {statusLabel(s.value, form.type)}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
              Number of problems <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="number"
              min="0"
              value={form.totalProblems}
              onChange={(e) => set('totalProblems', e.target.value)}
              placeholder="e.g. 20"
              className="mt-2 w-40 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:bg-slate-700"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Then track how many you've finished from the Assignments list.
            </p>
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white dark:bg-ink-card p-5 border border-slate-200 shadow-card dark:border-ink-border">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Urgency Status</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => set('priority', 'Critical')}
                className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                  form.priority === 'Critical'
                    ? 'bg-rose-500 text-white shadow-soft'
                    : 'bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400'
                }`}
              >
                Urgent
              </button>
              <button
                type="button"
                onClick={() => set('priority', 'Normal')}
                className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                  form.priority === 'Normal'
                    ? 'bg-brand-600 text-white shadow-soft'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                Normal
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-ink-card p-5 border border-slate-200 shadow-card dark:border-ink-border">
            <p className="text-sm font-semibold text-brand-600">Productivity Tip</p>
            <p className="mt-2 text-sm italic text-slate-500">
              "The secret of getting ahead is getting started." — Mark Twain
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleSave(false)}
              disabled={busy}
              className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-60"
            >
              {busy ? 'Saving…' : editing ? 'Save Changes' : 'Save Assignment'}
            </button>
            {!editing && (
              <button
                onClick={() => handleSave(true)}
                disabled={busy}
                className="w-full rounded-xl border border-brand-200 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-50 disabled:opacity-60"
              >
                Save &amp; Add Another
              </button>
            )}
            <button
              onClick={() => navigate(editing ? '/assignments' : '/')}
              className="w-full py-1 text-center text-sm font-medium text-slate-400 hover:text-slate-600"
            >
              {editing ? 'Cancel' : 'Discard Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Notes & resources */}
      <div className="mt-5 rounded-2xl bg-white dark:bg-ink-card p-5 border border-slate-200 shadow-card dark:border-ink-border">
        <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          Additional Notes &amp; Resources (Optional)
        </p>
        <textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          rows={4}
          placeholder="Paste links, mention specific requirements, or list sub-tasks here…"
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:bg-slate-700"
        />
        <div className="mt-3 flex items-center gap-5 text-sm font-medium text-brand-600">
          <button className="flex items-center gap-1.5 hover:underline">
            <PaperclipIcon className="h-4 w-4" /> Attach File
          </button>
          <button className="flex items-center gap-1.5 hover:underline">
            <LinkIcon className="h-4 w-4" /> Add Link
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  )
}
