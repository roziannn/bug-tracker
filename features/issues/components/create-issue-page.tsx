"use client";

import type { FormEvent } from "react";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { FileUp, Save, SendHorizonal, ShieldAlert, Trash2, X } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  criticalityTiers,
  issueClassifications,
  picOptions,
  projectOptions,
} from "@/features/bug-tracker/data/bug-tracker-data";
import { appToast } from "@/lib/app-toast";

const submitChecklist = [
  "Judul issue harus spesifik dan gampang dicari tim engineering.",
  "Evidence bantu QA dan dev reproduce bug lebih cepat.",
  "Pilih PIC dan project supaya issue langsung masuk jalur triage yang benar.",
] as const;

type EvidenceUpload = {
  id: string;
  name: string;
  sizeLabel: string;
  progress: number;
  status: "uploading" | "done";
};

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${size} B`;
}

export function CreateIssuePage() {
  const uploadId = useId();
  const formId = useId();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceUpload[]>([]);
  const hasUploadingEvidence = selectedEvidence.some((file) => file.status === "uploading");
  const hasCompletedEvidence = selectedEvidence.some((file) => file.status === "done");
  const missingRequiredFields = [
    !title.trim() ? "title" : null,
    !description.trim() ? "description" : null,
    !hasCompletedEvidence ? "evidence" : null,
  ].filter((field): field is string => Boolean(field));
  const isFormComplete = missingRequiredFields.length === 0;

  useEffect(() => {
    const hasUploadingFile = selectedEvidence.some((file) => file.status === "uploading");

    if (!hasUploadingFile) {
      return;
    }

    const timer = window.setInterval(() => {
      setSelectedEvidence((current) =>
        current.map((file) => {
          if (file.status === "done") {
            return file;
          }

          const nextProgress = Math.min(
            100,
            file.progress + Math.max(6, Math.round((100 - file.progress) * 0.18)),
          );

          return {
            ...file,
            progress: nextProgress,
            status: nextProgress >= 100 ? "done" : "uploading",
          };
        }),
      );
    }, 220);

    return () => window.clearInterval(timer);
  }, [selectedEvidence]);

  function handleDeleteEvidence(id: string) {
    setSelectedEvidence((current) => current.filter((file) => file.id !== id));
  }

  function handleSubmitIssue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (hasUploadingEvidence) {
      appToast.error({
        title: "Evidence masih di-upload",
        description: "Tunggu semua file evidence mencapai 100% sebelum submit issue.",
      });
      return;
    }

    if (!isFormComplete) {
      appToast.error({
        title: "Form belum lengkap",
        description: `Lengkapi field wajib terlebih dahulu: ${missingRequiredFields.join(", ")}.`,
      });
      return;
    }

    appToast.success({
      title: "Issue siap disubmit",
      description: "Field wajib sudah lengkap dan semua evidence selesai di-upload.",
    });
  }

  return (
    <AppShell
      activeNav="issues"
      breadcrumbs={[
        { label: "All Issues", href: "/issues" },
        { label: "Create Issue" },
      ]}
      eyebrow="Issue intake"
      title="Create Issue"
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">New issue form</h2>
            <p className="text-sm text-muted-foreground">
              Lengkapi detail bug report supaya triage, assignment, dan follow-up bisa jalan lebih cepat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="destructive">Tier-aware intake</Badge>
            <Badge variant="outline">Attachment ready</Badge>
            <Badge variant="secondary">Project routing</Badge>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Issue details</CardTitle>
            <CardDescription>
              Isi field utama untuk mendokumentasikan bug yang akan masuk ke backlog atau triage queue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form id={formId} className="grid gap-6" onSubmit={handleSubmitIssue}>
              <div className="grid gap-2">
                <Label htmlFor="issue-title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="issue-title"
                  placeholder="Contoh: Attachment upload gagal saat file evidence lebih dari 10 MB"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor={uploadId}>
                    Upload evidence <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG, PDF, atau video pendek
                  </span>
                </div>

                <label
                  htmlFor={uploadId}
                  className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 px-5 py-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FileUp className="size-5" />
                  </span>
                  <div className="space-y-1">
                    <p className="font-medium">Klik untuk upload evidence</p>
                    <p className="text-sm text-muted-foreground">
                      Bisa upload screenshot, screen recording, log export, atau PDF pendukung.
                    </p>
                  </div>
                </label>
                <Input
                  id={uploadId}
                  multiple
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    if (!files.length) {
                      return;
                    }

                    setSelectedEvidence((current) => [
                      ...current,
                      ...files.map((file, index) => ({
                        id: `${file.name}-${file.size}-${Date.now()}-${index}`,
                        name: file.name,
                        sizeLabel: formatFileSize(file.size),
                        progress: 0,
                        status: "uploading" as const,
                      })),
                    ]);
                    event.target.value = "";
                  }}
                />

                {selectedEvidence.length ? (
                  <div className="space-y-3">
                    {selectedEvidence.map((file) => (
                      <div key={file.id} className="rounded-xl border bg-card p-3">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.sizeLabel}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              {file.progress}%
                            </span>
                            <Badge variant={file.status === "done" ? "secondary" : "outline"}>
                              {file.status === "done" ? "Uploaded" : "Uploading"}
                            </Badge>
                            {file.status === "done" ? (
                              <Button
                                onClick={() => handleDeleteEvidence(file.id)}
                                size="icon-sm"
                                type="button"
                                variant="outline"
                              >
                                <Trash2 />
                              </Button>
                            ) : null}
                          </div>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-200"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Belum ada file yang dipilih.</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="issue-description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="issue-description"
                  placeholder="Jelaskan langkah reproduksi, hasil yang diharapkan, hasil aktual, environment, dan dampak ke user."
                  rows={8}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>
                    Issue classification <span className="text-destructive">*</span>
                  </Label>
                  <Select defaultValue="Functional">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih klasifikasi issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueClassifications.map((classification) => (
                        <SelectItem key={classification} value={classification}>
                          {classification}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>
                    Criticality tier <span className="text-destructive">*</span>
                  </Label>
                  <Select defaultValue="Tier 2 - Major">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih criticality tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {criticalityTiers.map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          {tier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>
                    PIC <span className="text-destructive">*</span>
                  </Label>
                  <Select defaultValue={picOptions[0]?.label}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih PIC" />
                    </SelectTrigger>
                    <SelectContent>
                      {picOptions.map((person) => (
                        <SelectItem key={person.value} value={person.label}>
                          {person.label} - {person.team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>
                    Project <span className="text-destructive">*</span>
                  </Label>
                  <Select defaultValue={projectOptions[0]?.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectOptions.map((project) => (
                        <SelectItem key={project.value} value={project.value}>
                          {project.label} - {project.squad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex items-center justify-between gap-3 border-t">
            <Button
              nativeButton={false}
              render={
                <Link href="/issues">
                  <X />
                  Cancel
                </Link>
              }
              variant="outline"
            />
            {hasUploadingEvidence ? (
              <p className="text-sm text-muted-foreground">
                Submit akan aktif setelah semua evidence selesai upload.
              </p>
            ) : null}
            <div className="flex items-center gap-2">
              <Button variant="outline" type="button">
                <Save />
                Save draft
              </Button>
              <Button disabled={hasUploadingEvidence || !isFormComplete} form={formId} type="submit">
                <SendHorizonal />
                Submit issue
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission guide</CardTitle>
              <CardDescription>
                Checklist singkat supaya laporan bug lebih actionable buat team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {submitChecklist.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] transition-transform duration-200 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_12px_32px_-24px_rgba(2,6,23,0.9)]"
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-semibold text-white shadow-sm dark:bg-slate-800 dark:text-slate-200">
                    {index + 1}
                  </span>
                  <p className="pt-0.5 text-sm leading-6 text-slate-700 dark:text-slate-200">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Routing preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border p-4">
                <div>
                  <p className="font-medium">Criticality tier</p>
                  <p className="text-sm text-muted-foreground">
                    Gunakan Tier 1 untuk bug yang blok release, transaksi, auth, atau data utama user.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
