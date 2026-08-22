"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Brain, Check, CircleDot, Compass, FileText, Leaf, Pencil, RefreshCw, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ConstellationLink, ConstellationNode, GrowthReportData, ReflectionProfileData } from "@/app/lib/growth";

type ReportView = GrowthReportData & { id: string; period: "weekly" | "monthly"; createdAt: string };
type CheckIn = { date: string; rating: number; note: string };
type ExperimentView = {
    id: string;
    title: string;
    rationale: string;
    tinyAction: string;
    durationDays: number;
    status: "active" | "completed" | "stopped";
    startedAt: string;
    endsAt: string;
    checkIns: CheckIn[];
};
type Overview = { profile: ReflectionProfileData | null; reports: ReportView[]; activeExperiment: ExperimentView | null };

const NODE_POSITIONS = [
    { x: 50, y: 16 }, { x: 24, y: 27 }, { x: 76, y: 28 }, { x: 13, y: 52 }, { x: 48, y: 48 },
    { x: 88, y: 54 }, { x: 27, y: 76 }, { x: 67, y: 74 }, { x: 48, y: 87 }, { x: 82, y: 88 },
];

function MemoryConstellation({ nodes, links }: { nodes: ConstellationNode[]; links: ConstellationLink[] }) {
    const [selectedId, setSelectedId] = useState(nodes[0]?.id || "");
    const nodePositions = useMemo(() => new Map(nodes.map((node, index) => [node.id, NODE_POSITIONS[index % NODE_POSITIONS.length]])), [nodes]);
    const selected = nodes.find(node => node.id === selectedId) || nodes[0];
    const selectedLinks = links.filter(link => link.source === selected?.id || link.target === selected?.id);

    if (!nodes.length) {
        return <p className="text-pretty text-sm text-gray-600">Generate your reflection profile after a few entries to begin forming your constellation.</p>;
    }

    return (
        <div>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-slate-950" aria-label="Memory constellation">
                <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    {links.map((link, index) => {
                        const source = nodePositions.get(link.source);
                        const target = nodePositions.get(link.target);
                        if (!source || !target) return null;
                        const active = selected?.id === link.source || selected?.id === link.target;
                        return <line key={`${link.source}-${link.target}-${index}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={active ? "#818cf8" : "#475569"} strokeWidth={active ? 0.8 : 0.45} />;
                    })}
                </svg>
                {nodes.map((node, index) => {
                    const position = NODE_POSITIONS[index % NODE_POSITIONS.length];
                    const active = node.id === selected?.id;
                    return (
                        <button
                            type="button"
                            key={node.id}
                            onClick={() => setSelectedId(node.id)}
                            aria-pressed={active}
                            aria-label={`${node.label}, ${node.type}`}
                            style={{ left: `${position.x}%`, top: `${position.y}%` }}
                            className={cn(
                                "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-3 text-center text-xs font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                                node.weight >= 4 ? "min-h-14 min-w-14" : node.weight >= 2 ? "min-h-12 min-w-12" : "min-h-10 min-w-10",
                                active ? "border-indigo-300 bg-indigo-600" : "border-slate-500 bg-slate-800 hover:bg-slate-700",
                            )}
                        >
                            {node.label}
                        </button>
                    );
                })}
            </div>
            {selected && (
                <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4" aria-live="polite">
                    <p className="font-semibold text-gray-900">{selected.label} <span className="text-sm font-normal text-gray-500">· {selected.type}</span></p>
                    <p className="mt-1 text-pretty text-sm text-gray-600">
                        {selectedLinks.length ? selectedLinks.map(link => link.reason).filter(Boolean).join(" · ") : "No strong connection has been identified yet."}
                    </p>
                </div>
            )}
        </div>
    );
}

function EvidenceLinks({ ids }: { ids: string[] }) {
    if (!ids?.length) return null;
    return (
        <div className="mt-2 flex flex-wrap gap-2">
            {ids.map((id, index) => (
                <Link key={id} href={`/entry/${id}`} className="text-xs font-medium text-indigo-700 underline underline-offset-2">
                    Evidence {index + 1}
                </Link>
            ))}
        </div>
    );
}

export default function GrowthPage() {
    const [overview, setOverview] = useState<Overview | null>(null);
    const [loading, setLoading] = useState(true);
    const [working, setWorking] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [rating, setRating] = useState(3);
    const [note, setNote] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");

    const loadOverview = async () => {
        try {
            const response = await axios.get<Overview>("/api/growth/overview");
            setOverview(response.data);
            setError("");
        } catch (requestError) {
            setError(axios.isAxiosError(requestError) ? requestError.response?.data?.error || "Unable to load your workspace." : "Unable to load your workspace.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void loadOverview(); }, []);

    const runAction = async (key: string, action: () => Promise<void>) => {
        setWorking(key);
        setError("");
        try {
            await action();
            await loadOverview();
        } catch (requestError) {
            const message = axios.isAxiosError(requestError) ? requestError.response?.data?.error || "That action could not be completed." : "That action could not be completed.";
            setError(message);
            toast.error(message);
        } finally {
            setWorking(null);
        }
    };

    const latestReport = overview?.reports[0];

    if (loading) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-10" aria-busy="true">
                <div className="h-10 w-72 animate-pulse rounded bg-gray-200" />
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
                    <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <header className="flex flex-col gap-5 border-b border-gray-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-700"><Compass className="size-4" /> Private growth workspace</p>
                    <h1 className="text-balance text-3xl font-bold text-gray-950 sm:text-4xl">Understand what helps you grow</h1>
                    <p className="mt-3 max-w-2xl text-pretty text-gray-600">Echo turns entries you explicitly share into tentative patterns, evidence-linked reports, and one small experiment at a time.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" disabled={!!working} onClick={() => runAction("profile", async () => { await axios.post("/api/growth/profile"); })}>
                        <RefreshCw className="mr-2 size-4" /> {overview?.profile ? "Refresh profile" : "Build profile"}
                    </Button>
                    <Button disabled={!!working} onClick={() => runAction("weekly", async () => { await axios.post("/api/growth/reports", { period: "weekly" }); })}>
                        <FileText className="mr-2 size-4" /> Weekly report
                    </Button>
                    <Button variant="outline" disabled={!!working} onClick={() => runAction("monthly", async () => { await axios.post("/api/growth/reports", { period: "monthly" }); })}>
                        Monthly report
                    </Button>
                </div>
            </header>

            {error && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="text-pretty"><strong>Reflection, not diagnosis.</strong> These are AI-generated hypotheses based only on entries you allowed. Correct or dismiss anything that does not feel true.</p>
            </div>

            <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="profile-heading">
                <Card className="border-gray-200 bg-white shadow-sm hover:bg-white hover:shadow-sm">
                    <CardHeader>
                        <CardTitle id="profile-heading" className="flex items-center gap-2 bg-none text-gray-950"><Brain className="size-5 text-indigo-600" /> Reflection profile</CardTitle>
                        <CardDescription className="text-pretty">An editable set of observations—not a permanent personality label.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!overview?.profile ? (
                            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                                <p className="text-pretty text-sm text-gray-600">Your profile begins after at least three entries that allow growth analysis.</p>
                                <Button className="mt-4" disabled={!!working} onClick={() => runAction("profile", async () => { await axios.post("/api/growth/profile"); })}>Build my profile</Button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-pretty text-gray-700">{overview.profile.summary}</p>
                                <div className="mt-6 space-y-3">
                                    {overview.profile.observations.filter(item => item.status !== "dismissed").map(observation => (
                                        <div key={observation.id} className="rounded-lg border border-gray-200 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase text-indigo-700">{observation.category} · {observation.confidence}</p>
                                                    {editingId === observation.id ? (
                                                        <div className="mt-2">
                                                            <textarea
                                                                value={editingText}
                                                                onChange={event => setEditingText(event.target.value)}
                                                                maxLength={320}
                                                                rows={3}
                                                                aria-label="Correct this profile observation"
                                                                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                            />
                                                            <div className="mt-2 flex gap-2">
                                                                <Button size="sm" disabled={!!working || editingText.trim().length < 3} onClick={() => runAction(`edit-${observation.id}`, async () => { await axios.patch("/api/growth/profile", { observationId: observation.id, text: editingText }); setEditingId(null); })}>Save correction</Button>
                                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                                                            </div>
                                                        </div>
                                                    ) : <p className="mt-1 text-pretty text-sm text-gray-700">{observation.text}</p>}
                                                    <EvidenceLinks ids={observation.evidenceEntryIds} />
                                                </div>
                                                <div className="flex shrink-0 gap-1">
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        aria-label="Correct this observation"
                                                        disabled={!!working}
                                                        onClick={() => { setEditingId(observation.id); setEditingText(observation.text); }}
                                                    ><Pencil className="size-4" /></Button>
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant={observation.status === "confirmed" ? "secondary" : "ghost"}
                                                        aria-label="Confirm this observation"
                                                        disabled={!!working}
                                                        onClick={() => runAction(`confirm-${observation.id}`, async () => { await axios.patch("/api/growth/profile", { observationId: observation.id, status: "confirmed" }); })}
                                                    ><Check className="size-4" /></Button>
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        aria-label="Dismiss this observation"
                                                        disabled={!!working}
                                                        onClick={() => runAction(`dismiss-${observation.id}`, async () => { await axios.patch("/api/growth/profile", { observationId: observation.id, status: "dismissed" }); })}
                                                    ><X className="size-4" /></Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white shadow-sm hover:bg-white hover:shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 bg-none text-gray-950"><Sparkles className="size-5 text-indigo-600" /> Memory Constellation</CardTitle>
                        <CardDescription>Explore the themes and relationships Echo sees recurring together.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MemoryConstellation nodes={overview?.profile?.constellation.nodes || []} links={overview?.profile?.constellation.links || []} />
                    </CardContent>
                </Card>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" aria-labelledby="report-heading">
                <Card className="border-gray-200 bg-white shadow-sm hover:bg-white hover:shadow-sm">
                    <CardHeader>
                        <CardTitle id="report-heading" className="flex items-center gap-2 bg-none text-gray-950"><FileText className="size-5 text-indigo-600" /> Latest report</CardTitle>
                        <CardDescription>{latestReport ? `${latestReport.period} reflection generated ${new Date(latestReport.createdAt).toLocaleDateString()}` : "Generate an evidence-linked weekly or monthly reflection."}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!latestReport ? (
                            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                                <p className="text-sm text-gray-600">No report yet. Two AI-enabled entries in the selected period are enough to begin.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div><h2 className="text-balance text-xl font-semibold text-gray-950">{latestReport.title}</h2><p className="mt-2 text-pretty text-gray-700">{latestReport.summary}</p></div>
                                {latestReport.changed && <div><h3 className="font-semibold text-gray-900">What changed</h3><p className="mt-1 text-pretty text-sm text-gray-600">{latestReport.changed}</p></div>}
                                {[
                                    ["What Echo noticed", latestReport.noticed],
                                    ["What seemed helpful", latestReport.helped],
                                    ["What may need attention", latestReport.needsAttention],
                                    ["What to preserve", latestReport.preserve],
                                ].map(([title, items]) => Array.isArray(items) && items.length > 0 && (
                                    <div key={title as string}>
                                        <h3 className="font-semibold text-gray-900">{title as string}</h3>
                                        <ul className="mt-2 space-y-3">{(items as { text: string; evidenceEntryIds: string[] }[]).map((item, index) => <li key={index} className="text-pretty text-sm text-gray-600"><span className="flex gap-2"><CircleDot className="mt-0.5 size-4 shrink-0 text-indigo-500" />{item.text}</span><EvidenceLinks ids={item.evidenceEntryIds} /></li>)}</ul>
                                    </div>
                                ))}
                                {latestReport.suggestions.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Optional experiments</h3>
                                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                            {latestReport.suggestions.map((suggestion, index) => (
                                                <div key={`${suggestion.title}-${index}`} className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                                                    <p className="font-semibold text-gray-900">{suggestion.title}</p>
                                                    <p className="mt-1 text-pretty text-sm text-gray-600">{suggestion.rationale}</p>
                                                    <p className="mt-3 text-sm font-medium text-indigo-900">Try: {suggestion.tinyAction}</p>
                                                    <EvidenceLinks ids={suggestion.evidenceEntryIds} />
                                                    <Button className="mt-4 w-full" disabled={!!working || !!overview.activeExperiment} onClick={() => runAction(`experiment-${index}`, async () => { await axios.post("/api/growth/experiments", { suggestionIndex: index }); })}>Try for {suggestion.durationDays} days</Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white shadow-sm hover:bg-white hover:shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 bg-none text-gray-950"><Leaf className="size-5 text-indigo-600" /> Current experiment</CardTitle>
                        <CardDescription>One gentle change at a time. Missing a day never resets your progress.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!overview?.activeExperiment ? (
                            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center"><p className="text-pretty text-sm text-gray-600">Choose an optional experiment from your latest report. There is no penalty for stopping.</p></div>
                        ) : (
                            <div>
                                <p className="text-lg font-semibold text-gray-950">{overview.activeExperiment.title}</p>
                                <p className="mt-2 text-pretty text-sm text-gray-600">{overview.activeExperiment.tinyAction}</p>
                                <p className="mt-3 text-sm text-gray-500">Ends {new Date(overview.activeExperiment.endsAt).toLocaleDateString()} · {overview.activeExperiment.checkIns?.length || 0} check-ins</p>
                                <fieldset className="mt-6">
                                    <legend className="text-sm font-semibold text-gray-900">How did it feel today?</legend>
                                    <div className="mt-2 flex gap-2">
                                        {[1, 2, 3, 4, 5].map(value => (
                                            <label key={value} className="cursor-pointer">
                                                <input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} className="peer sr-only" />
                                                <span className="flex size-10 items-center justify-center rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500">{value}</span>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                                <label className="mt-4 block text-sm font-semibold text-gray-900" htmlFor="experiment-note">Optional note</label>
                                <textarea id="experiment-note" value={note} onChange={event => setNote(event.target.value)} maxLength={280} rows={3} className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="What helped or got in the way?" />
                                <Button className="mt-3 w-full" disabled={!!working} onClick={() => runAction("check-in", async () => { await axios.patch(`/api/growth/experiments/${overview.activeExperiment?.id}`, { action: "check-in", rating, note }); setNote(""); })}>Save check-in</Button>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <Button variant="outline" disabled={!!working} onClick={() => runAction("complete", async () => { await axios.patch(`/api/growth/experiments/${overview.activeExperiment?.id}`, { action: "complete" }); })}>Complete</Button>
                                    <Button variant="ghost" disabled={!!working} onClick={() => runAction("stop", async () => { await axios.patch(`/api/growth/experiments/${overview.activeExperiment?.id}`, { action: "stop" }); })}>Stop gently</Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
