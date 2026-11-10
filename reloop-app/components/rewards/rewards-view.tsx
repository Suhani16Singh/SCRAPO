"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DemoBanner, EmptyState, PageSkeleton, Pill } from "@/components/ui/feedback";
import { formatDate, formatNumber } from "@/lib/format";
import { ecoLevels, leaderboard, rewardHistory } from "@/lib/mock/data";
import { usePrototype } from "@/lib/prototype/session";
import { useDemoResource } from "@/lib/prototype/use-demo-resource";
import { cx } from "@/lib/cx";

export function RewardsView() {
  const { ready, profile, admin } = usePrototype();
  const demo = useDemoResource("rewards");
  const [monthOnly, setMonthOnly] = useState(false);
  const board = leaderboard.map((entry) =>
    entry.highlight ? { ...entry, name: profile.name, city: profile.city } : entry,
  );
  const winners = board.slice(0, 3);
  const history = useMemo(
    () => [...admin.extraRewards, ...rewardHistory],
    [admin.extraRewards],
  );
  const visibleHistory = monthOnly ? [] : history;
  const nextLevel = ecoLevels.find((level) => level.from > profile.pointsLifetime);
  const currentLevel = [...ecoLevels].reverse().find((level) => profile.pointsLifetime >= level.from) ?? ecoLevels[0];
  const progress = nextLevel
    ? Math.min(100, Math.round((profile.pointsLifetime / nextLevel.from) * 100))
    : 100;

  if (!ready || demo.phase === "loading") return <PageSkeleton />;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="text-sm font-semibold text-lime">Scrapo Rewards</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight text-ink sm:text-4xl">October board</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Monthly points decide the podium. Lifetime points decide the eco level. Both numbers on this page are samples.
        </p>
      </div>
      <DemoBanner>
        {admin.winnersPublished
          ? "Winners were marked published in this browser. The names are still the sample board."
          : "Top three are a sample. Publishing them is an admin action and stays on this device."}
      </DemoBanner>

      <section className="grid gap-3 md:grid-cols-3">
        {winners.map((entry) => (
          <Card key={entry.rank} className={entry.rank === 1 ? "bg-lime md:-translate-y-2" : ""}>
            <p className={cx("text-sm font-semibold", entry.rank === 1 ? "text-[#080908]/60" : "text-lime")}>Winner #{entry.rank}</p>
            <h2 className={cx("mt-2 text-2xl font-medium", entry.rank === 1 ? "text-[#080908]" : "text-ink")}>{entry.name}</h2>
            <p className={cx("text-sm", entry.rank === 1 ? "text-[#080908]/70" : "text-muted")}>{entry.city}</p>
            <p className={cx("mt-4 font-display text-3xl", entry.rank === 1 ? "text-[#080908]" : "text-lime")}>{formatNumber(entry.points)}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-xl font-medium text-ink">Monthly leaderboard</h2>
          <ol className="mt-4 divide-y divide-line">
            {board.map((entry) => (
              <li key={entry.rank} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    #{entry.rank} {entry.name}
                    {entry.highlight ? <span className="ml-2 rounded-md bg-lime/20 px-1.5 py-0.5 text-xs text-lime">You</span> : null}
                  </p>
                  <p className="text-xs text-muted">{entry.city}</p>
                </div>
                <p className="font-display text-lg text-lime">{formatNumber(entry.points)}</p>
              </li>
            ))}
          </ol>
        </Card>
        <div className="space-y-4">
          <Card>
            <h2 className="text-xl font-medium text-ink">Points</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[18px] border border-line bg-card-secondary p-4">
                <dt className="text-xs font-semibold text-muted">This month</dt>
                <dd className="mt-1 font-display text-3xl text-lime">{formatNumber(profile.pointsMonth)}</dd>
              </div>
              <div className="rounded-[18px] border border-line bg-card-secondary p-4">
                <dt className="text-xs font-semibold text-muted">Lifetime</dt>
                <dd className="mt-1 font-display text-3xl text-ink">{formatNumber(profile.pointsLifetime)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm font-semibold text-ink">Eco level · {currentLevel.name}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-card-secondary border border-line" aria-hidden>
              <div className="h-full bg-lime transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted">
              {nextLevel
                ? `${formatNumber(nextLevel.from - profile.pointsLifetime)} lifetime points to ${nextLevel.name}.`
                : "Top of the sample levels."}
            </p>
          </Card>
          <Card>
            <h2 className="text-xl font-medium text-ink">Eco levels</h2>
            <ul className="mt-4 space-y-3">
              {ecoLevels.map((level) => (
                <li key={level.name} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{level.name}</p>
                    <p className="text-xs text-muted">{level.summary}</p>
                  </div>
                  <Pill tone={level.name === currentLevel.name ? "olive" : "paper"}>{formatNumber(level.from)}+</Pill>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-medium text-ink">Reward history</h2>
          <Button variant={monthOnly ? "lime" : "ghost"} size="sm" onClick={() => setMonthOnly((value) => !value)}>
            {monthOnly ? "Show the sample history" : "Show an empty month"}
          </Button>
        </div>
        {visibleHistory.length === 0 ? (
          <EmptyState
            title="No rewards in this view"
            text="The empty month is a filter on the prototype. The sample history is still available."
          />
        ) : (
          <ul className="space-y-3">
            {visibleHistory.map((event) => (
              <li key={event.id}>
                <Card className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{event.label}</p>
                    <p className="text-xs text-muted">
                      {formatDate(event.at)} · {event.source === "session" ? "Added in this browser" : "Demo sample"}
                    </p>
                  </div>
                  <p className="font-display text-xl text-lime">+{formatNumber(event.points)}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
