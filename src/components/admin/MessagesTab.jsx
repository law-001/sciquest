import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Inbox,
  Mail,
  MailOpen,
  RefreshCw,
  Reply,
  Search,
  Trash2,
} from "lucide-react";

import Button from "../Button";
import { PortalPanel, TabHead } from "../portal";
import { cn } from "../../lib/utils";
import {
  deleteContactMessage,
  listContactMessages,
  setMessageRead,
} from "../../lib/contactMessages";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
];

/**
 * Admin inbox for messages sent through the public Contact page.
 * List on the left, reading pane on the right; stacked on small screens.
 */
export function MessagesTab({ onUnreadCountChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const fetchMessages = useCallback(
    () =>
      listContactMessages()
        .then((rows) => {
          setMessages(rows);
          setLoading(false);
        })
        .catch((err) => {
          setLoadError(err.message ?? "Failed to load messages");
          setLoading(false);
        }),
    [],
  );

  const load = () => {
    setLoading(true);
    setLoadError(null);
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  useEffect(() => {
    if (!loading && !loadError && onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, loading, loadError, onUnreadCountChange]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === "unread" && m.isRead) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, query, filter]);

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  const updateRead = async (id, isRead) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead } : m)));
    try {
      await setMessageRead(id, isRead);
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: !isRead } : m)),
      );
    }
  };

  const handleOpen = (message) => {
    setSelectedId(message.id);
    if (!message.isRead) updateRead(message.id, true);
  };

  const handleDeleted = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setSelectedId(null);
  };

  return (
    <div className="space-y-4">
      <TabHead
        title="Messages"
        subtitle="Questions and feedback sent from the Contact page"
      >
        <Button
          size="sm"
          variant="outline"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={load}
          disabled={loading}
        >
          Refresh
        </Button>
      </TabHead>

      <PortalPanel className="lg:grid lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:h-[calc(100vh-9rem)] lg:min-h-128">
        {/* Inbox list — hidden on small screens while a message is open */}
        <div
          className={cn(
            "flex-col min-h-0 lg:flex lg:border-r border-orange-100 dark:border-stone-700",
            selected ? "hidden" : "flex",
          )}
        >
          <div className="p-3 space-y-2.5 border-b border-orange-100 dark:border-stone-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, or message"
                aria-label="Search messages"
                className="w-full h-11 pl-9 pr-3 rounded-xl border-2 border-orange-100 dark:border-stone-600 bg-white dark:bg-stone-900 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
              />
            </div>
            <div className="flex gap-2" role="group" aria-label="Filter messages">
              {FILTERS.map(({ id, label }) => {
                const count = id === "unread" ? unreadCount : messages.length;
                const isActive = filter === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFilter(id)}
                    aria-pressed={isActive}
                    className={cn(
                      "h-11 px-4 rounded-xl text-sm font-bold transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-800 dark:bg-primary-950 dark:text-primary-200"
                        : "text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-700",
                    )}
                  >
                    {label}
                    <span className="ml-1.5 tabular-nums text-xs opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto themed-scrollbar">
            {loading ? (
              <ListSkeleton />
            ) : loadError ? (
              <div className="px-6 py-12 text-center" role="alert">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-4">
                  {loadError}
                </p>
                <Button size="sm" variant="outline" onClick={load}>
                  Retry
                </Button>
              </div>
            ) : messages.length === 0 ? (
              <EmptyState
                title="No messages yet"
                hint="When someone uses the Contact page, their message shows up here."
              />
            ) : visible.length === 0 ? (
              <EmptyState
                title="Nothing matches"
                hint="Try a different search or switch the filter to All."
              />
            ) : (
              <ul className="divide-y divide-orange-100 dark:divide-stone-700">
                {visible.map((m) => (
                  <li key={m.id}>
                    <MessageRow
                      message={m}
                      isSelected={m.id === selectedId}
                      onOpen={() => handleOpen(m)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Reading pane */}
        <div className={cn("min-h-0 lg:flex flex-col", selected ? "flex" : "hidden")}>
          {selected ? (
            <ReadingPane
              key={selected.id}
              message={selected}
              onBack={() => setSelectedId(null)}
              onToggleRead={() => updateRead(selected.id, !selected.isRead)}
              onDeleted={handleDeleted}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <MailOpen className="w-10 h-10 text-stone-300 dark:text-stone-600 mb-3" />
              <p className="text-sm font-bold text-stone-600 dark:text-stone-300">
                Select a message to read it
              </p>
            </div>
          )}
        </div>
      </PortalPanel>
    </div>
  );
}

function MessageRow({ message, isSelected, onOpen }) {
  const unread = !message.isRead;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-current={isSelected ? "true" : undefined}
      className={cn(
        "relative w-full text-left flex gap-3 px-4 py-3 min-h-18 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500",
        isSelected
          ? "bg-primary-50 dark:bg-primary-950/60"
          : "hover:bg-orange-50/60 dark:hover:bg-stone-700/50",
      )}
    >
      {isSelected && (
        <span className="absolute left-0 inset-y-0 w-0.75 bg-primary-500" />
      )}
      <span className="w-2 shrink-0 pt-1.5">
        {unread && <span className="block w-2 h-2 rounded-full bg-primary-500" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span
            className={cn(
              "truncate text-sm",
              unread
                ? "font-black text-stone-900 dark:text-white"
                : "font-semibold text-stone-700 dark:text-stone-200",
            )}
          >
            {message.name}
          </span>
          {unread && (
            <span className="shrink-0 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-200">
              New
            </span>
          )}
          <time
            dateTime={message.createdAt}
            title={formatFull(message.createdAt)}
            className="ml-auto shrink-0 text-[11px] font-medium text-stone-500 dark:text-stone-400"
          >
            {formatRelative(message.createdAt)}
          </time>
        </span>
        <span className="block truncate text-xs text-stone-500 dark:text-stone-400">
          {message.email}
        </span>
        <span
          className={cn(
            "block truncate text-[13px] mt-0.5",
            unread
              ? "font-medium text-stone-800 dark:text-stone-200"
              : "text-stone-500 dark:text-stone-400",
          )}
        >
          {message.message}
        </span>
      </span>
    </button>
  );
}

function ReadingPane({ message, onBack, onToggleRead, onDeleted }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const headingRef = useRef(null);

  // Opening a message below lg swaps the whole view, so move focus with it.
  // On desktop the list stays visible and keeps focus for quick browsing.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      headingRef.current?.focus();
    }
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteContactMessage(message.id);
      onDeleted(message.id);
    } catch (err) {
      setDeleteError(err.message ?? "Failed to delete message");
      setDeleting(false);
    }
  };

  const replyHref = `mailto:${message.email}?subject=${encodeURIComponent(
    "Re: your message to SciQuest",
  )}`;
  const actionClass =
    "inline-flex items-center gap-2 h-11 px-4 rounded-xl text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500";

  return (
    <article className="flex-1 min-h-0 flex flex-col">
      <header className="px-5 py-4 border-b border-orange-100 dark:border-stone-700 space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="lg:hidden inline-flex items-center gap-2 h-11 -ml-2 px-2 rounded-xl text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-700"
        >
          <ArrowLeft className="w-4 h-4" />
          All messages
        </button>

        <div className="flex items-start gap-3">
          <span className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-black text-primary-800 bg-primary-100 dark:bg-primary-950 dark:text-primary-200">
            {message.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-heading text-lg font-black text-stone-900 dark:text-white wrap-break-word focus:outline-none"
            >
              {message.name}
            </h2>
            <a
              href={`mailto:${message.email}`}
              className="text-sm font-medium text-primary-700 dark:text-primary-300 hover:underline break-all"
            >
              {message.email}
            </a>
            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
              <time dateTime={message.createdAt}>{formatFull(message.createdAt)}</time>
              {message.userId && " · Signed-in user"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={replyHref}
            className={cn(actionClass, "bg-primary-700 text-white hover:bg-primary-800")}
          >
            <Reply className="w-4 h-4" />
            Reply
          </a>
          <button
            type="button"
            onClick={onToggleRead}
            className={cn(
              actionClass,
              "text-stone-700 dark:text-stone-200 hover:bg-orange-50 dark:hover:bg-stone-700",
            )}
          >
            {message.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
            {message.isRead ? "Mark unread" : "Mark read"}
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className={cn(
              actionClass,
              "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
            )}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>

        {confirmingDelete && (
          <div
            role="alertdialog"
            aria-label="Confirm delete"
            className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-4"
          >
            <p className="text-sm font-bold text-red-800 dark:text-red-200">
              Delete this message? This can't be undone.
            </p>
            {deleteError && (
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">{deleteError}</p>
            )}
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setConfirmingDelete(false)} disabled={deleting}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className={cn(actionClass, "bg-red-700 text-white hover:bg-red-800 disabled:opacity-60")}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto themed-scrollbar px-5 py-5">
        <p className="max-w-prose whitespace-pre-wrap wrap-break-word text-[15px] leading-relaxed text-stone-800 dark:text-stone-200">
          {message.message}
        </p>
      </div>
    </article>
  );
}

function ListSkeleton() {
  return (
    <ul aria-label="Loading messages" className="divide-y divide-orange-100 dark:divide-stone-700">
      {Array.from({ length: 5 }, (_, i) => (
        <li key={i} className="px-4 py-3.5 pl-9 space-y-2 motion-safe:animate-pulse">
          <div className="h-3.5 w-1/3 rounded bg-stone-200 dark:bg-stone-700" />
          <div className="h-3 w-1/2 rounded bg-stone-100 dark:bg-stone-700/60" />
          <div className="h-3 w-5/6 rounded bg-stone-100 dark:bg-stone-700/60" />
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ title, hint }) {
  return (
    <div className="px-6 py-14 text-center">
      <Inbox className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
      <p className="text-sm font-bold text-stone-700 dark:text-stone-200">{title}</p>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{hint}</p>
    </div>
  );
}

function formatRelative(iso) {
  const date = new Date(iso);
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

function formatFull(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
