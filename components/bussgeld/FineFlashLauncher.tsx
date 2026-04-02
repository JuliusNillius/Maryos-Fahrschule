"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  BKAT_REFERENCE_LABEL,
  DATA_AS_OF,
  computeExcessKmH,
  lookupSpeedFine,
  speedAfterTolerance,
  toleranceDeductionKmh,
  type SpeedZone,
} from "@/lib/bussgeld-speed-pkw";
import { SCENARIOS, type ScenarioId } from "@/lib/bussgeld-scenarios";

const WHATSAPP_URL = "https://wa.me/491784557528";

type Tab = "speed" | "other";

export default function FineFlashLauncher() {
  const t = useTranslations("fineFlash");
  const [open, setOpen] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [tab, setTab] = useState<Tab>("speed");
  const [zone, setZone] = useState<SpeedZone>("inner");
  const [limitInput, setLimitInput] = useState("50");
  const [measuredInput, setMeasuredInput] = useState("55");
  const [applyTolerance, setApplyTolerance] = useState(true);
  const [scenarioId, setScenarioId] = useState<ScenarioId | "">("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const fn = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => closeRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      openBtnRef.current?.focus();
    };
  }, [open]);

  const limitKmh = Math.min(250, Math.max(5, parseInt(limitInput, 10) || 0));
  const measuredKmh = Math.min(
    300,
    Math.max(0, parseInt(measuredInput, 10) || 0),
  );

  const speedResult = useMemo(() => {
    const excess = computeExcessKmH({
      limitKmh,
      measuredKmh,
      applyTolerance,
    });
    const row = excess >= 1 ? lookupSpeedFine(zone, excess) : null;
    const adjusted = applyTolerance
      ? speedAfterTolerance(measuredKmh)
      : measuredKmh;
    const ded = applyTolerance ? toleranceDeductionKmh(measuredKmh) : 0;
    return { excess, row, adjusted, ded };
  }, [limitKmh, measuredKmh, applyTolerance, zone]);

  function handleOpen() {
    if (!reduceMotion) {
      setFlashOn(true);
      window.setTimeout(() => setFlashOn(false), 150);
    }
    setOpen(true);
  }

  const scenarioMeta = scenarioId
    ? SCENARIOS.find((s) => s.id === scenarioId)
    : undefined;
  const showLead = scenarioMeta && (scenarioMeta.mpu || scenarioMeta.aufbau);

  return (
    <>
      {flashOn && !reduceMotion && (
        <div
          className="pointer-events-none fixed inset-0 z-[200] bg-white motion-safe:animate-fine-flash"
          aria-hidden
        />
      )}
      <div className="group relative">
        <button
          ref={openBtnRef}
          type="button"
          onClick={handleOpen}
          className="motion-safe:animate-fine-pulse flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-500/90 bg-zinc-950 text-white shadow-lg transition-transform hover:scale-105 md:h-16 md:w-16"
          aria-label={t("ariaLabel")}
          aria-haspopup="dialog"
          aria-expanded={open}
          data-cta
          data-testid="fine-flash-open"
        >
          <span
            className="flex h-9 w-9 items-center justify-center md:h-10 md:w-10"
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              className="h-full w-full drop-shadow-[0_0_6px_rgba(255,80,80,0.85)]"
              fill="currentColor"
            >
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
          </span>
        </button>
        <div className="pointer-events-none absolute right-full top-1/2 z-10 mr-3 hidden max-w-[min(85vw,16rem)] -translate-y-1/2 rounded-lg border border-red-500/30 bg-surface px-3 py-2 text-start font-body text-xs text-text opacity-0 shadow-lg transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 md:block">
          {t("tooltip")}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            aria-label={t("close")}
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="fine-flash-title"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-[rgba(93,196,34,0.25)] bg-bg shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-[rgba(93,196,34,0.15)] px-4 py-3">
              <h2
                id="fine-flash-title"
                className="font-heading text-lg font-bold uppercase italic tracking-wide text-text"
              >
                {t("title")}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-text-muted hover:bg-surface2 hover:text-text"
                aria-label={t("close")}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex gap-1 border-b border-[rgba(93,196,34,0.12)] px-2 pt-2">
              <button
                type="button"
                onClick={() => setTab("speed")}
                className={`flex-1 rounded-t-lg px-3 py-2 font-heading text-xs font-bold uppercase tracking-wide sm:text-sm ${
                  tab === "speed"
                    ? "bg-green-primary text-black"
                    : "text-text-muted hover:bg-surface2"
                }`}
              >
                {t("tabSpeed")}
              </button>
              <button
                type="button"
                onClick={() => setTab("other")}
                className={`flex-1 rounded-t-lg px-3 py-2 font-heading text-xs font-bold uppercase tracking-wide sm:text-sm ${
                  tab === "other"
                    ? "bg-green-primary text-black"
                    : "text-text-muted hover:bg-surface2"
                }`}
              >
                {t("tabOther")}
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              {tab === "speed" && (
                <div className="space-y-4">
                  <p className="font-body text-sm text-text-muted">
                    {t("speedIntro")}
                  </p>
                  <div>
                    <label className="mb-1 block font-body text-xs font-medium uppercase text-text-muted">
                      {t("zoneLabel")}
                    </label>
                    <select
                      value={zone}
                      onChange={(e) => setZone(e.target.value as SpeedZone)}
                      className="w-full rounded-lg border border-[rgba(93,196,34,0.25)] bg-surface px-3 py-2 font-body text-text"
                    >
                      <option value="inner">{t("zoneInner")}</option>
                      <option value="outer">{t("zoneOuter")}</option>
                      <option value="motorway">{t("zoneMotorway")}</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block font-body text-xs font-medium text-text-muted">
                        {t("limitLabel")}
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={250}
                        value={limitInput}
                        onChange={(e) => setLimitInput(e.target.value)}
                        className="w-full rounded-lg border border-[rgba(93,196,34,0.25)] bg-surface px-3 py-2 font-body text-text"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-body text-xs font-medium text-text-muted">
                        {t("measuredLabel")}
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={300}
                        value={measuredInput}
                        onChange={(e) => setMeasuredInput(e.target.value)}
                        className="w-full rounded-lg border border-[rgba(93,196,34,0.25)] bg-surface px-3 py-2 font-body text-text"
                      />
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-start gap-2 font-body text-sm text-text">
                    <input
                      type="checkbox"
                      checked={applyTolerance}
                      onChange={(e) => setApplyTolerance(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-[rgba(93,196,34,0.4)]"
                    />
                    <span>
                      <span className="font-medium">{t("toleranceLabel")}</span>
                      <span className="mt-0.5 block text-xs text-text-muted">
                        {t("toleranceHint")}
                      </span>
                    </span>
                  </label>

                  <div className="rounded-xl border border-[rgba(93,196,34,0.2)] bg-surface2 p-4">
                    {speedResult.excess < 1 ? (
                      <p className="font-heading text-sm font-bold text-green-primary">
                        {t("noViolation")}
                      </p>
                    ) : (
                      <>
                        <p className="font-body text-sm text-text-muted">
                          {t("excess")}:{" "}
                          <strong className="text-text">
                            {speedResult.excess} km/h
                          </strong>
                          {applyTolerance && (
                            <span className="mt-1 block text-xs">
                              {t("afterTolerance", {
                                adjusted:
                                  Math.round(speedResult.adjusted * 10) / 10,
                                ded: speedResult.ded,
                              })}
                            </span>
                          )}
                        </p>
                        {speedResult.row && (
                          <ul className="mt-3 space-y-2 font-body text-sm">
                            <li>
                              {t("fine")}:{" "}
                              <strong>{speedResult.row.fineEur} €</strong>
                            </li>
                            <li>
                              {t("points")}:{" "}
                              <strong>{speedResult.row.points}</strong>
                            </li>
                            <li>
                              {t("ban")}:{" "}
                              <strong>
                                {speedResult.row.banMonths == null
                                  ? t("banNone")
                                  : speedResult.row.banConditional
                                    ? t("banConditional", {
                                        months: speedResult.row.banMonths,
                                      })
                                    : t("banMonths", {
                                        months: speedResult.row.banMonths,
                                      })}
                              </strong>
                            </li>
                          </ul>
                        )}
                      </>
                    )}
                    <p className="mt-3 border-t border-[rgba(93,196,34,0.12)] pt-3 text-xs text-text-muted">
                      {t("legalRef")}: {BKAT_REFERENCE_LABEL} ·{" "}
                      {t("dataStand", { date: DATA_AS_OF })}
                    </p>
                  </div>
                </div>
              )}

              {tab === "other" && (
                <div className="space-y-4">
                  <p className="font-body text-sm text-text-muted">
                    {t("otherIntro")}
                  </p>
                  <div>
                    <label className="mb-1 block font-body text-xs font-medium uppercase text-text-muted">
                      {t("scenarioLabel")}
                    </label>
                    <select
                      value={scenarioId}
                      onChange={(e) =>
                        setScenarioId((e.target.value || "") as ScenarioId | "")
                      }
                      className="w-full rounded-lg border border-[rgba(93,196,34,0.25)] bg-surface px-3 py-2 font-body text-text"
                    >
                      <option value="">{t("scenarioPlaceholder")}</option>
                      {SCENARIOS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {t(`scenarios.${s.id}.title`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {scenarioId && (
                    <p className="rounded-lg bg-surface2 p-3 font-body text-sm text-text">
                      {t(`scenarios.${scenarioId}.desc`)}
                    </p>
                  )}
                  {showLead && (
                    <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4">
                      <p className="font-heading text-sm font-bold uppercase text-amber-200">
                        {t("leadTitle")}
                      </p>
                      <p className="mt-2 font-body text-sm text-text">
                        {t("leadBody")}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-lg bg-green-primary px-4 py-2 font-heading text-xs font-bold uppercase text-black"
                        >
                          {t("ctaWhatsapp")}
                        </a>
                        <Link
                          href="/#kontakt"
                          className="inline-flex items-center justify-center rounded-lg border border-[rgba(93,196,34,0.4)] px-4 py-2 font-heading text-xs font-bold uppercase text-text"
                          onClick={() => setOpen(false)}
                        >
                          {t("ctaContact")}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <p className="mt-6 font-body text-[11px] leading-relaxed text-text-muted">
                {t("disclaimer")}
              </p>

              <div className="mt-6 flex justify-end border-t border-[rgba(93,196,34,0.12)] pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-[rgba(93,196,34,0.35)] bg-surface2 px-4 py-2 font-heading text-xs font-bold uppercase tracking-wide text-text transition-colors hover:border-green-primary/50 hover:text-green-primary"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
