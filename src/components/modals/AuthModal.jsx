import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Hash,
  BookOpen,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import Button from "../Button";
import Input from "../Input";
import { useAuth } from "../../context/AuthContext";
import { fetchPublicSections } from "../../lib/sections";

function SectionDropdown({ value, onChange, sections, loading, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = sections.find((s) => s.name === value);

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    }
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown" && open) {
      const idx = sections.findIndex((s) => s.name === value);
      const next = sections[idx + 1];
      if (next) onChange(next.name);
    }
    if (e.key === "ArrowUp" && open) {
      const idx = sections.findIndex((s) => s.name === value);
      const prev = sections[idx - 1];
      if (prev) onChange(prev.name);
    }
  };

  return (
    <div className="w-full" ref={ref}>
      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5 font-heading">
        Section
      </label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={handleKey}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={[
            "w-full h-10 rounded-xl border-2 bg-white dark:bg-stone-800 pl-10 pr-9 text-left",
            "text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed",
            open
              ? "border-primary-500 outline-none ring-4 ring-primary-500/10 dark:ring-primary-400/10"
              : "border-orange-200 dark:border-stone-600 hover:border-orange-300 dark:hover:border-stone-500",
            selected
              ? "text-stone-900 dark:text-stone-100"
              : "text-stone-400 dark:text-stone-500",
          ].join(" ")}
        >
          {loading ? "Loading…" : selected ? selected.name : "Select section"}
        </button>

        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <BookOpen className="w-4 h-4" />
          )}
        </div>

        <div
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>

        {open && sections.length > 0 && (
          <ul
            role="listbox"
            className="absolute z-50 mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 shadow-xl overflow-auto max-h-48 py-1"
          >
            {sections.map((s) => (
              <li
                key={s.id}
                role="option"
                aria-selected={s.name === value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(s.name);
                  setOpen(false);
                }}
                className={[
                  "flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition-colors",
                  s.name === value
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold"
                    : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700/50",
                ].join(" ")}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0 opacity-50" />
                {s.name}
                {s.name === value && (
                  <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-primary-500" />
                )}
              </li>
            ))}
          </ul>
        )}

        {open && sections.length === 0 && !loading && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 shadow-xl px-4 py-3 text-sm text-stone-400 dark:text-stone-500">
            No sections available yet.
          </div>
        )}
      </div>
    </div>
  );
}

const EMPTY_FORM = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  studentNumber: "",
  section: "",
};

const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  {
    id: "upper",
    label: "At least 1 uppercase letter",
    test: (v) => /[A-Z]/.test(v),
  },
  {
    id: "lower",
    label: "At least 1 lowercase letter",
    test: (v) => /[a-z]/.test(v),
  },
  { id: "number", label: "At least 1 number", test: (v) => /[0-9]/.test(v) },
];

const isPasswordStrong = (v) => PASSWORD_RULES.every((rule) => rule.test(v));

export function AuthModal({ isOpen, onClose, onLogin }) {
  const { signIn, signUp, verifyEmailOtp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState("form"); // "form" | "verify"
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", "", "", ""]);
  const otpRefs = useRef([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [rememberMe, setRememberMe] = useState(
    () => localStorage.getItem('sq_pref_remember_me') === '1'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    studentNumber: "",
  });
  const [availableSections, setAvailableSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || isLogin) return;
    setSectionsLoading(true);
    fetchPublicSections()
      .then((all) => setAvailableSections(all))
      .catch(() => setAvailableSections([]))
      .finally(() => setSectionsLoading(false));
  }, [isOpen, isLogin]);

  if (!isOpen) return null;

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
    if (field === "email" && fieldErrors.email)
      setFieldErrors((p) => ({ ...p, email: "" }));
    if (field === "studentNumber" && fieldErrors.studentNumber)
      setFieldErrors((p) => ({ ...p, studentNumber: "" }));
  };

  const setName = (field) => (e) => {
    const value = e.target.value.replace(/[^\p{L} ]/gu, "");
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const setStudentNumber = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, studentNumber: value }));
    if (error) setError("");
    if (fieldErrors.studentNumber)
      setFieldErrors((p) => ({ ...p, studentNumber: "" }));
  };

  const handleClose = () => {
    setError("");
    setPhase("form");
    setOtpDigits(["", "", "", "", "", "", "", ""]);
    setIsLogin(true);
    setForm(EMPTY_FORM);
    setShowPassword(false);
    setShowConfirm(false);
    setPasswordFocused(false);
    setFieldErrors({ email: "", studentNumber: "" });
    onClose();
  };

  const handleToggle = () => {
    setIsLogin((v) => !v);
    setError("");
    setFieldErrors({ email: "", studentNumber: "" });
    setShowPassword(false);
    setShowConfirm(false);
    setPasswordFocused(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const profile = await signIn(form.email, form.password, rememberMe);
      onLogin(profile?.role ?? "student");
      handleClose();
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    if (!form.email.trim().toLowerCase().endsWith("@student.fatima.edu.ph")) {
      setFieldErrors((p) => ({
        ...p,
        email: "Use your @student.fatima.edu.ph email",
      }));
      return;
    }
    if (!form.studentNumber.trim()) {
      setError("Student number is required.");
      return;
    }
    if (!form.section.trim()) {
      setError("Section is required.");
      return;
    }
    if (!isPasswordStrong(form.password)) {
      setError("Please make sure your password meets all the requirements.");
      setPasswordFocused(true);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp({
        email: form.email,
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        studentNumber: form.studentNumber.trim(),
        section: form.section.trim(),
      });
      if (result.session) {
        onLogin("student");
        handleClose();
      } else if (result.user?.identities?.length === 0) {
        setFieldErrors((p) => ({ ...p, email: "Already taken" }));
      } else {
        setPhase("verify");
        setOtpDigits(["", "", "", "", "", "", "", ""]);
      }
    } catch (err) {
      const msg = err.message ?? "";
      if (err.code === "student_number_taken") {
        setFieldErrors((p) => ({ ...p, studentNumber: "Already registered" }));
      } else if (
        /already registered|already in use|email.*exist|user.*exist/i.test(msg)
      ) {
        setFieldErrors((p) => ({ ...p, email: "Already taken" }));
      } else {
        setError(msg || "Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 7) otpRefs.current[index + 1]?.focus();
    if (error) setError("");
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 8);
    const next = ["", "", "", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtpDigits(next);
    const focusIndex = Math.min(pasted.length, 7);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const token = otpDigits.join("");
    if (token.length < 8) {
      setError("Please enter the 8-digit code from your email.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const result = await verifyEmailOtp(form.email, token);
      if (result.session) {
        onLogin("student");
        handleClose();
      }
    } catch (err) {
      setError(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signUp({
        email: form.email,
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        studentNumber: form.studentNumber.trim(),
        section: form.section.trim(),
      });
      setOtpDigits(["", "", "", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch {
      setError("Could not resend the code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (phase === "verify") {
    return (
      <div className="modal-backdrop">
        <div
          className="bg-white dark:bg-stone-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-bounce-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute top-0 left-0 w-full h-51 bg-linear-to-br from-primary-50 to-accent-100 opacity-60" />
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-white/70 rounded-full transition-all z-20 dark:text-stone-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="px-8 py-12 relative z-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 text-primary-500 mb-4 shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-stone-900 dark:text-white mb-2">
                Verify your email
              </h2>
              <p className="text-stone-500 dark:text-stone-100 text-sm font-medium">
                We sent an 8-digit code to
                <strong className="block text-stone-700 dark:text-stone-50 break-all mt-0.5">
                  {form.email}
                </strong>
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-5">
              <div className="flex justify-center gap-2">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    className="w-11 h-14 text-center text-xl font-black rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all"
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isLoading}
              >
                Verify &amp; Create Account
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
                Didn&apos;t receive a code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading}
                  className="font-bold text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50"
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div
        className="bg-white dark:bg-stone-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden relative animate-bounce-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative background */}
        <div
          className={`absolute top-0 left-0 w-full ${isLogin ? "h-34" : "h-34"} bg-linear-to-br from-primary-100 to-accent-100 opacity-60 transition-all duration-500`}
        />
        <div
          className={`absolute -top-12 -right-12 w-40 ${isLogin ? "h-38" : "h-48"} bg-secondary-100 rounded-full blur-3xl opacity-60 transition-all duration-500`}
        />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-white/70 rounded-full transition-all z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 pt-6 pb-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-500 mb-2 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white mb-1">
              {isLogin ? "Welcome back, scientist!" : "Start your journey!"}
            </h2>
            <p className="text-stone-500 dark:text-stone-50 font-medium text-sm">
              {isLogin
                ? "Ready to continue your experiments?"
                : "Create your student account to start."}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <div
            className={`transition-all duration-500 ${
              isLogin
                ? "max-h-96 overflow-hidden"
                : "max-h-128 overflow-y-auto pr-1"
            }`}
          >
            <form
              onSubmit={isLogin ? handleLogin : handleSignup}
              className="space-y-3"
            >
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="First Name"
                      placeholder="Marie"
                      icon={<User className="w-4 h-4" />}
                      value={form.firstName}
                      onChange={setName("firstName")}
                      required
                    />
                    <Input
                      label="Last Name"
                      placeholder="Curie"
                      icon={<User className="w-4 h-4" />}
                      value={form.lastName}
                      onChange={setName("lastName")}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Student No."
                      placeholder="20240001"
                      inputMode="numeric"
                      icon={<Hash className="w-4 h-4" />}
                      value={form.studentNumber}
                      onChange={setStudentNumber}
                      error={fieldErrors.studentNumber}
                      required
                    />
                    <SectionDropdown
                      value={form.section}
                      onChange={(name) => {
                        setForm((prev) => ({ ...prev, section: name }));
                        if (error) setError("");
                      }}
                      sections={availableSections}
                      loading={sectionsLoading}
                      disabled={false}
                    />
                  </div>
                </>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder={
                  isLogin ? "marie@science.lab" : "marie@student.fatima.edu.ph"
                }
                icon={<Mail className="w-5 h-5" />}
                value={form.email}
                onChange={set("email")}
                error={fieldErrors.email}
                required
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                value={form.password}
                onChange={set("password")}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-stone-400 hover:text-stone-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                required
              />

              {!isLogin && passwordFocused && (
                <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 px-4 py-3 space-y-1.5 text-sm">
                  {PASSWORD_RULES.map((rule) => {
                    const pass = rule.test(form.password);
                    return (
                      <div
                        key={rule.id}
                        className={`flex items-center gap-2 font-medium ${
                          pass
                            ? "text-green-600 dark:text-green-400"
                            : "text-stone-500 dark:text-stone-400"
                        }`}
                      >
                        {pass ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 shrink-0 text-red-500" />
                        )}
                        <span>{rule.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="text-stone-400 hover:text-stone-600 transition-colors"
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  required
                />
              )}

              {isLogin && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => {
                        setRememberMe(e.target.checked);
                        localStorage.setItem('sq_pref_remember_me', e.target.checked ? '1' : '0');
                      }}
                      className="w-4 h-4 rounded border-stone-300 accent-primary-600 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                {isLogin ? "Enter Lab" : "Create Account"}
              </Button>
            </form>
          </div>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={handleToggle}
                className="font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
