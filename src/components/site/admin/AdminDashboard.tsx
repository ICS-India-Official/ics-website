import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Loader2,
  LockKeyhole,
  LogOut,
  NotebookPen,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, type AdminData } from "@/lib/admin-client";
import {
  type AdminApplicationRow,
  type AdminStudentRow,
  APPLICATION_STATUSES,
  STUDENT_STATUSES,
  type ApplicationStatus,
  type StudentStatus,
} from "@/lib/admin-types";
import { COURSES } from "@/lib/application-data";
import { formatMobileDisplay } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COURSE_ABBR = new Map<string, string>(COURSES.map((c) => [c.id as string, c.abbr]));

const STATUS_LABEL: Record<ApplicationStatus | StudentStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  accepted: "Accepted",
  rejected: "Rejected",
  enrolled: "Enrolled",
  active: "Active",
  alumni: "Alumni",
  withdrawn: "Withdrawn",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ── Login gate ─────────────────────────────────────────────────────── */

function LoginCard({ onSuccess }: { onSuccess: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!passcode) return;
    setBusy(true);
    try {
      await adminApi.login(passcode);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto mt-24 w-full max-w-md px-4">
      <form
        onSubmit={submit}
        className="card-sheen rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-black/20"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/15">
          <LockKeyhole className="h-5 w-5 text-gold" aria-hidden />
        </div>
        <h1 className="mt-5 text-center font-[family-name:var(--font-display)] text-2xl text-foreground">
          Staff Console
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Restricted area — Institute of Christian Studies &amp; Research admissions office.
        </p>
        <div className="mt-7">
          <Label htmlFor="admin-passcode" className="field-label">
            Admin passcode
          </Label>
          <Input
            id="admin-passcode"
            type="password"
            autoComplete="current-password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="field-input mt-2"
            placeholder="Enter passcode"
            disabled={busy}
          />
        </div>
        <Button
          type="submit"
          disabled={busy || !passcode}
          className="mt-6 w-full rounded-full bg-gold py-3 text-sm font-semibold text-gold-foreground hover:bg-gold/90"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Sign in"}
        </Button>
        <p className="mt-5 flex items-center justify-center gap-1.5 text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/70">
          <ShieldCheck className="h-3 w-3 text-gold/60" aria-hidden />
          Sessions expire automatically after 12 hours
        </p>
      </form>
    </div>
  );
}

/* ── Stat cards ─────────────────────────────────────────────────────── */

function StatCards({ stats }: { stats: AdminData["stats"] }) {
  const cards = [
    { icon: ClipboardList, label: "Applications", value: stats.totalApplications },
    { icon: NotebookPen, label: "Pending review", value: stats.pendingReview },
    { icon: GraduationCap, label: "Students", value: stats.totalStudents },
    { icon: Users, label: "Active students", value: stats.activeStudents },
    { icon: BookOpen, label: "Enquiries", value: stats.totalLeads },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-border bg-card p-4 shadow-lg shadow-black/10"
        >
          <c.icon className="h-4 w-4 text-gold/80" aria-hidden />
          <dd className="mt-2 font-[family-name:var(--font-display)] text-2xl tabular-nums text-gold">
            {c.value}
          </dd>
          <dt className="mt-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {c.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

/* ── Applications table ─────────────────────────────────────────────── */

function NotesCell({ row }: { row: AdminApplicationRow }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(row.adminNotes ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => setValue(row.adminNotes ?? ""), [row.adminNotes]);

  async function save() {
    setSaving(true);
    try {
      await adminApi.updateApplication(row.id, { adminNotes: value });
      toast.success("Note saved.");
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save note.");
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <div className="flex min-w-56 items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Internal note…"
          className="h-8 text-xs"
          disabled={saving}
          onKeyDown={(e) => {
            if (e.key === "Enter") void save();
            if (e.key === "Escape") setEditing(false);
          }}
          autoFocus
        />
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-gold"
          onClick={() => void save()}
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
        </Button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="max-w-44 truncate text-left text-xs text-muted-foreground transition-colors hover:text-gold"
      title={row.adminNotes ?? "Click to add a note"}
    >
      {row.adminNotes || <span className="italic opacity-60">Add note…</span>}
    </button>
  );
}

function ApplicationsTable({
  rows,
  onChanged,
}: {
  rows: AdminApplicationRow[];
  onChanged: () => void;
}) {
  const [busyId, setBusyId] = useState<string>();

  async function setStatus(row: AdminApplicationRow, status: ApplicationStatus) {
    setBusyId(row.id);
    try {
      await adminApi.updateApplication(row.id, { status });
      toast.success(`${row.referenceCode} → ${STATUS_LABEL[status]}`);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(undefined);
    }
  }

  async function admit(row: AdminApplicationRow) {
    setBusyId(row.id);
    try {
      const res = await adminApi.admit(row.id, true);
      toast.success(
        res.alreadyEnrolled
          ? "Already enrolled — student exists."
          : `${row.fullName} enrolled and added to the directory.`,
      );
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enrolment failed.");
    } finally {
      setBusyId(undefined);
    }
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/80 px-4 py-8 text-center text-sm text-muted-foreground">
        No applications yet — they appear here the moment someone applies.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-200 text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
            <th className="px-4 py-3 font-semibold">Reference</th>
            <th className="px-4 py-3 font-semibold">Applicant</th>
            <th className="px-4 py-3 font-semibold">Course</th>
            <th className="px-4 py-3 font-semibold">Submitted</th>
            <th className="px-4 py-3 font-semibold">Notes</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-muted/20">
              <td className="px-4 py-3 font-mono text-xs text-gold">{row.referenceCode}</td>
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{row.fullName}</p>
                <p className="text-xs text-muted-foreground">{row.email}</p>
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold">
                  {COURSE_ABBR.get(row.courseId) ?? row.courseId}
                </span>
                <span className="ml-1.5 text-xs text-muted-foreground">{row.medium}</span>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {fmtDate(row.submittedAt)}
              </td>
              <td className="px-4 py-3">
                <NotesCell row={row} />
              </td>
              <td className="px-4 py-3">
                <Select
                  value={row.status}
                  onValueChange={(v) => void setStatus(row, v as ApplicationStatus)}
                >
                  <SelectTrigger className="h-8 w-36 border-border/70 bg-background/60 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="px-4 py-3 text-right">
                {row.status === "accepted" ? (
                  <Button
                    size="sm"
                    disabled={busyId === row.id}
                    onClick={() => void admit(row)}
                    className="h-8 gap-1.5 rounded-full bg-gold px-3 text-xs font-semibold text-gold-foreground hover:bg-gold/90"
                  >
                    {busyId === row.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <UserPlus className="h-3.5 w-3.5" />
                    )}
                    Enrol
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground/40">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Students table ─────────────────────────────────────────────────── */

function StudentsTable({
  rows,
  onChanged,
  onAdd,
}: {
  rows: AdminStudentRow[];
  onChanged: () => void;
  onAdd: () => void;
}) {
  const [busyId, setBusyId] = useState<string>();

  async function patch(row: AdminStudentRow, p: Parameters<typeof adminApi.updateStudent>[1]) {
    setBusyId(row.id);
    try {
      await adminApi.updateStudent(row.id, p);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(undefined);
    }
  }

  async function remove(row: AdminStudentRow) {
    if (!window.confirm(`Remove ${row.fullName} from the student register?`)) return;
    setBusyId(row.id);
    try {
      await adminApi.deleteStudent(row.id);
      toast.success(`${row.fullName} removed.`);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusyId(undefined);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {rows.length} student{rows.length === 1 ? "" : "s"} on register · toggle{" "}
          <span className="font-semibold text-gold">Directory</span> to publish on the public
          students page.
        </p>
        <Button
          size="sm"
          onClick={onAdd}
          className="h-8 gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 text-xs font-semibold text-gold hover:bg-gold/20"
          variant="ghost"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add student
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/80 px-4 py-8 text-center text-sm text-muted-foreground">
          No students yet — accept an application and press Enrol, or add one manually.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-200 text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Enrolled</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Directory</th>
                <th className="px-4 py-3 text-right font-semibold">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{row.fullName}</p>
                    {row.city ? <p className="text-xs text-muted-foreground">{row.city}</p> : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold">
                      {COURSE_ABBR.get(row.courseId) ?? row.courseId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <p>{row.email}</p>
                    <p>{formatMobileDisplay(row.mobile)}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {fmtDate(row.enrolledAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={row.status}
                      onValueChange={(v) => void patch(row, { status: v as StudentStatus })}
                    >
                      <SelectTrigger className="h-8 w-32 border-border/70 bg-background/60 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STUDENT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={row.publicDirectory}
                      onCheckedChange={(v) => void patch(row, { publicDirectory: v === true })}
                      disabled={busyId === row.id}
                      aria-label={`Publish ${row.fullName} in public directory`}
                      className="data-[state=checked]:bg-gold data-[state=checked]:text-gold-foreground"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={busyId === row.id}
                      onClick={() => void remove(row)}
                      className="h-8 w-8 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                      aria-label={`Remove ${row.fullName}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Add-student dialog ─────────────────────────────────────────────── */

function AddStudentDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    courseId: "",
    medium: "English",
    city: "",
    state: "",
    publicDirectory: true,
  });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await adminApi.createStudent(form);
      toast.success(`${form.fullName} added to the register.`);
      setForm({
        fullName: "",
        email: "",
        mobile: "",
        courseId: "",
        medium: "English",
        city: "",
        state: "",
        publicDirectory: true,
      });
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add student.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent className="border-border bg-card text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-display)]">
            Add student manually
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="ns-name" className="field-label">
              Full name
            </Label>
            <Input
              id="ns-name"
              className="field-input mt-1.5"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
              minLength={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ns-email" className="field-label">
                Email
              </Label>
              <Input
                id="ns-email"
                type="email"
                className="field-input mt-1.5"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="ns-mobile" className="field-label">
                Mobile
              </Label>
              <Input
                id="ns-mobile"
                inputMode="numeric"
                maxLength={10}
                className="field-input mt-1.5"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="field-label" htmlFor="ns-course">
                Course
              </Label>
              <Select
                value={form.courseId}
                onValueChange={(v) => setForm({ ...form, courseId: v })}
              >
                <SelectTrigger
                  id="ns-course"
                  className="mt-1.5 w-full border-border/70 bg-background/60 text-sm"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.abbr} — {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="field-label" htmlFor="ns-medium">
                Medium
              </Label>
              <Select value={form.medium} onValueChange={(v) => setForm({ ...form, medium: v })}>
                <SelectTrigger
                  id="ns-medium"
                  className="mt-1.5 w-full border-border/70 bg-background/60 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ns-city" className="field-label">
                City
              </Label>
              <Input
                id="ns-city"
                className="field-input mt-1.5"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="ns-state" className="field-label">
                State
              </Label>
              <Input
                id="ns-state"
                className="field-input mt-1.5"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-gold/20 bg-gold/[0.06] px-4 py-3">
            <Label htmlFor="ns-dir" className="text-xs text-muted-foreground">
              Show on public students page
            </Label>
            <Switch
              id="ns-dir"
              checked={form.publicDirectory}
              onCheckedChange={(v) => setForm({ ...form, publicDirectory: v === true })}
              className="data-[state=checked]:bg-gold data-[state=checked]:text-gold-foreground"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-full">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                busy || !form.fullName || !form.email || form.mobile.length !== 10 || !form.courseId
              }
              className="rounded-full bg-gold px-6 text-sm font-semibold text-gold-foreground hover:bg-gold/90"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ── Dashboard root ─────────────────────────────────────────────────── */

export function AdminDashboard() {
  const [phase, setPhase] = useState<"checking" | "login" | "ready" | "unconfigured">("checking");
  const [data, setData] = useState<AdminData>();
  const [refreshing, setRefreshing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const d = await adminApi.data();
      setData(d);
      setPhase("ready");
    } catch (err) {
      const e = err as Error & { unauthorized?: boolean };
      if (e.unauthorized) setPhase("login");
      else if (e.message.includes("ADMIN_PASSCODE")) setPhase("unconfigured");
      else toast.error(e.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const content = useMemo(() => {
    if (phase === "checking") {
      return (
        <div className="flex min-h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gold" aria-hidden />
        </div>
      );
    }
    if (phase === "unconfigured") {
      return (
        <div className="mx-auto mt-24 max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-gold" aria-hidden />
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-xl text-foreground">
            Admin console not configured
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Set the{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-gold">
              ADMIN_PASSCODE
            </code>{" "}
            environment variable on the server, then reload this page.
          </p>
        </div>
      );
    }
    if (phase === "login" || !data) return <LoginCard onSuccess={() => void refresh()} />;

    return (
      <>
        <StatCards stats={data.stats} />

        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-foreground">
            Applications
          </h2>
          <p className="mb-4 mt-1 text-xs text-muted-foreground">
            Move accepted applicants to <span className="text-gold">Accepted</span>, then press
            Enrol to add them to the student register.
          </p>
          <ApplicationsTable rows={data.applications} onChanged={() => void refresh()} />
        </section>

        <section className="mt-12">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-foreground">
            Students
          </h2>
          <div className="mt-4">
            <StudentsTable
              rows={data.students}
              onChanged={() => void refresh()}
              onAdd={() => setAddOpen(true)}
            />
          </div>
        </section>

        <AddStudentDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onCreated={() => void refresh()}
        />
      </>
    );
  }, [phase, data, refresh]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.035]"
        style={{
          background:
            "radial-gradient(60% 40% at 85% -5%, var(--gold), transparent 70%)," +
            "radial-gradient(50% 35% at 0% 100%, color-mix(in oklab, var(--maroon) 80%, transparent), transparent 70%)",
        }}
      />
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-gold" aria-hidden />
            <div>
              <p className="font-[family-name:var(--font-display)] text-sm leading-tight text-foreground">
                ICSR Staff Console
              </p>
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                Admissions &amp; Registry
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => void refresh()}
              disabled={refreshing}
              aria-label="Refresh data"
              className="text-muted-foreground hover:text-gold"
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} aria-hidden />
            </Button>
            {phase === "ready" ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  try {
                    await adminApi.logout();
                  } catch {
                    /* clearing anyway */
                  }
                  setPhase("login");
                  setData(undefined);
                }}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                Sign out
              </Button>
            ) : null}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{content}</main>
    </div>
  );
}
