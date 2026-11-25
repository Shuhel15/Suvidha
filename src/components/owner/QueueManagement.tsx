"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  RefreshCw,
  CheckCircle,
  Clock3,
  Phone,
  Play,
  Scissors,
  SkipForward,
  UserRound,
  XCircle,
} from "lucide-react";

type QueueStatus =
  | "WAITING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "SKIPPED";

type QueueToken = {
  id: string;
  tokenNumber: number;
  status: QueueStatus;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
  };
};

type QueueManagementProps = {
  businessId: string;
};

export default function QueueManagement({ businessId }: QueueManagementProps) {
  const [tokens, setTokens] = useState<QueueToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTokenId, setUpdatingTokenId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQueue = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/owner/queue?businessId=${businessId}`,
        { cache: "no-store" },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch queue.");
      }

      setTokens(result.data.tokens ?? []);
    } catch (error) {
      console.error("Queue fetch error:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to load queue.",
      );
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    let ignore = false;

    async function loadQueue() {
      try {
        const response = await fetch(
          `/api/owner/queue?businessId=${businessId}`,
          { cache: "no-store" },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch queue.");
        }

        if (!ignore) {
          setTokens(result.data.tokens ?? []);
        }
      } catch (error) {
        if (!ignore) {
          console.error("Queue fetch error:", error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadQueue();

    const intervalId = setInterval(loadQueue, 5000);

    return () => {
      ignore = true;
      clearInterval(intervalId);
    };
  }, [businessId]);

  const updateTokenStatus = async (tokenId: string, status: QueueStatus) => {
    try {
      setUpdatingTokenId(tokenId);

      const response = await fetch("/api/owner/queue", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenId,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Status update failed.");
      }

      toast.success(result.message || "Token status updated.");
      await fetchQueue();
    } catch (error) {
      console.error("Token update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to update token.",
      );
    } finally {
      setUpdatingTokenId(null);
    }
  };

  const waitingTokens = tokens.filter((token) => token.status === "WAITING");

  const inProgressTokens = tokens.filter(
    (token) => token.status === "IN_PROGRESS",
  );

  const pastTokens = tokens.filter(
    (token) =>
      token.status === "COMPLETED" ||
      token.status === "CANCELLED" ||
      token.status === "SKIPPED",
  );

  if (loading) {
    return (
      <div className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-3xl border border-black/5 bg-white shadow-[0_12px_35px_rgba(80,45,20,0.06)]">
        <RefreshCw className="h-7 w-7 animate-spin text-[#B11226]" />
        <p className="mt-4 text-sm font-semibold text-black/55">
          Loading today&apos;s queue...
        </p>
      </div>
    );
  }

  const completedCount = tokens.filter(
    (token) => token.status === "COMPLETED",
  ).length;

  const summary = [
    {
      label: "Waiting",
      count: waitingTokens.length,
      note: "Ready for service",
      icon: Clock3,
      iconClass: "bg-[#F5EBD0] text-[#B11226]",
    },
    {
      label: "In progress",
      count: inProgressTokens.length,
      note: "Currently being served",
      icon: Scissors,
      iconClass: "bg-amber-100 text-amber-800",
    },
    {
      label: "Completed",
      count: completedCount,
      note: "Visits finished today",
      icon: BadgeCheck,
      iconClass: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Total customers",
      count: tokens.length,
      note: "All queue activity today",
      icon: UserRound,
      iconClass: "bg-rose-100 text-rose-700",
    },
  ];

  const renderToken = (token: QueueToken) => (
    <div
      key={token.id}
      className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_35px_rgba(80,45,20,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-[#B11226]/20 hover:shadow-[0_18px_40px_rgba(80,45,20,0.1)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#B11226] via-[#D49A3A] to-[#B11226]/20" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5EBD0] text-lg font-black text-[#B11226] shadow-inner shadow-black/10">
            {token.tokenNumber}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/40">
              Queue number
            </p>
            <h3 className="mt-1 truncate text-base font-bold text-gray-900">
              {token.customer.name}
            </h3>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            token.status === "WAITING"
              ? "bg-[#F5EBD0] text-[#8A641D]"
              : token.status === "IN_PROGRESS"
                ? "bg-amber-100 text-amber-800"
                : token.status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-700"
                  : token.status === "CANCELLED"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-gray-100 text-gray-600"
          }`}
        >
          {token.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#F5EBD0]/45 p-3.5">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">
            Service
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-gray-800">
            {token.service.name}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">
            Duration
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-800">
            <Clock3 size={14} className="text-[#B11226]" />
            {token.service.duration} min
          </p>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm text-black/55">
        <Phone size={15} className="shrink-0 text-[#B11226]" />
        {token.customer.phone}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-black/5 pt-4">
        {token.status === "WAITING" && (
          <>
            <button
              type="button"
              disabled={updatingTokenId === token.id}
              onClick={() => updateTokenStatus(token.id, "IN_PROGRESS")}
              className="flex min-h-10 items-center gap-2 rounded-xl bg-[#B11226] px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-[#B11226]/15 transition hover:-translate-y-0.5 hover:bg-[#8f0e1e] disabled:cursor-wait disabled:opacity-50"
            >
              <Play size={15} />
              Start
            </button>

            <button
              type="button"
              disabled={updatingTokenId === token.id}
              onClick={() => updateTokenStatus(token.id, "SKIPPED")}
              className="flex min-h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:border-black/20 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-50"
            >
              <SkipForward size={15} />
              Skip
            </button>

            <button
              type="button"
              disabled={updatingTokenId === token.id}
              onClick={() => updateTokenStatus(token.id, "CANCELLED")}
              className="flex min-h-10 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-wait disabled:opacity-50"
            >
              <XCircle size={15} />
              Cancel
            </button>
          </>
        )}

        {token.status === "IN_PROGRESS" && (
          <>
            <button
              type="button"
              disabled={updatingTokenId === token.id}
              onClick={() => updateTokenStatus(token.id, "COMPLETED")}
              className="flex min-h-10 items-center gap-2 rounded-xl bg-emerald-700 px-3.5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-50"
            >
              <CheckCircle size={15} />
              Complete
            </button>

            <button
              type="button"
              disabled={updatingTokenId === token.id}
              onClick={() => updateTokenStatus(token.id, "SKIPPED")}
              className="flex min-h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:border-black/20 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-50"
            >
              <SkipForward size={15} />
              Skip
            </button>

            <button
              type="button"
              disabled={updatingTokenId === token.id}
              onClick={() => updateTokenStatus(token.id, "CANCELLED")}
              className="flex min-h-10 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-wait disabled:opacity-50"
            >
              <XCircle size={15} />
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderSection = (
    title: string,
    description: string,
    count: number,
    icon: typeof Clock3,
    sectionTokens: QueueToken[],
    emptyMessage: string,
  ) => {
    const Icon = icon;

    return (
      <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-[0_12px_35px_rgba(80,45,20,0.05)] sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#F5EBD0] p-2.5 text-[#B11226] shadow-inner shadow-black/10">
              <Icon size={19} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="mt-0.5 text-xs text-black/45">{description}</p>
            </div>
          </div>
          <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#B11226]/10 px-2 text-sm font-bold text-[#B11226]">
            {count}
          </span>
        </div>

        {sectionTokens.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#B11226]/20 bg-[#F5EBD0]/25 px-5 py-8 text-center">
            <p className="text-sm font-semibold text-gray-700">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sectionTokens.map(renderToken)}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="mt-7 space-y-7">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {summary.map(({ label, count, note, icon: Icon, iconClass }) => (
          <article
            key={label}
            className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_12px_35px_rgba(80,45,20,0.05)] sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-black/50">{label}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                  {count}
                </p>
              </div>
              <span className={`rounded-xl p-2.5 ${iconClass}`}>
                <Icon size={19} />
              </span>
            </div>
            <p className="mt-3 hidden text-xs text-black/40 sm:block">{note}</p>
          </article>
        ))}
      </section>

      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-black/5 bg-white/70 p-4 sm:flex-row sm:items-center sm:px-5">
        <div>
          <h2 className="font-bold text-gray-900">Today&apos;s service board</h2>
          <p className="mt-1 text-sm text-black/50">
            Queue updates automatically every few seconds.
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            setRefreshing(true);

            try {
              await fetchQueue();
            } finally {
              setRefreshing(false);
            }
          }}
          disabled={refreshing}
          aria-busy={refreshing}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#B11226]/20 bg-white px-4 py-2 text-sm font-semibold text-[#B11226] transition hover:-translate-y-0.5 hover:border-[#B11226]/50 hover:bg-[#F5EBD0]/40 disabled:cursor-wait disabled:opacity-70"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {renderSection(
        "Waiting",
        "Customers ready to be served",
        waitingTokens.length,
        Clock3,
        waitingTokens,
        "No customers waiting right now.",
      )}
      {renderSection(
        "In progress",
        "Services currently underway",
        inProgressTokens.length,
        Scissors,
        inProgressTokens,
        "No services in progress.",
      )}
      {renderSection(
        "Completed & past",
        "Finished, skipped, or cancelled visits",
        pastTokens.length,
        BadgeCheck,
        pastTokens,
        "No past tokens today.",
      )}
    </div>
  );
}
