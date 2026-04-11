"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { FileUp, FolderOpenDot, ShieldAlert, UserRoundPlus } from "lucide-react";

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

const submitChecklist = [
  "Judul issue harus spesifik dan gampang dicari tim engineering.",
  "Evidence bantu QA dan dev reproduce bug lebih cepat.",
  "Pilih PIC dan project supaya issue langsung masuk jalur triage yang benar.",
] as const;

export function CreateIssuePage() {
  const uploadId = useId();
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);

  return (
    <AppShell
      activeNav="issues"
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
            <form className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="issue-title">Title</Label>
                <Input
                  id="issue-title"
                  placeholder="Contoh: Attachment upload gagal saat file evidence lebih dari 10 MB"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor={uploadId}>Upload evidence</Label>
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
                    setSelectedEvidence(files.map((file) => file.name));
                  }}
                />

                {selectedEvidence.length ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedEvidence.map((fileName) => (
                      <Badge key={fileName} variant="outline">
                        {fileName}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Belum ada file yang dipilih.</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="issue-description">Description</Label>
                <Textarea
                  id="issue-description"
                  placeholder="Jelaskan langkah reproduksi, hasil yang diharapkan, hasil aktual, environment, dan dampak ke user."
                  rows={8}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Issue classification</Label>
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
                  <Label>Criticality tier</Label>
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
                  <Label>PIC</Label>
                  <Select defaultValue={picOptions[0]?.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih PIC" />
                    </SelectTrigger>
                    <SelectContent>
                      {picOptions.map((person) => (
                        <SelectItem key={person.value} value={person.value}>
                          {person.label} - {person.team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Project</Label>
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

          <CardFooter className="justify-between gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/issues">Cancel</Link>}
              variant="outline"
            />
            <div className="flex items-center gap-2">
              <Button variant="outline">Save draft</Button>
              <Button>Submit issue</Button>
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
              {submitChecklist.map((item) => (
                <div key={item} className="rounded-xl border bg-muted/30 p-4">
                  <p className="text-sm leading-6">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Routing preview</CardTitle>
              <CardDescription>
                Ringkasan field yang biasanya menentukan prioritas dan assignment awal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border p-4">
                <span className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldAlert className="size-4" />
                </span>
                <div>
                  <p className="font-medium">Criticality tier</p>
                  <p className="text-sm text-muted-foreground">
                    Gunakan Tier 1 untuk bug yang blok release, transaksi, auth, atau data utama user.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border p-4">
                <span className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRoundPlus className="size-4" />
                </span>
                <div>
                  <p className="font-medium">PIC selection</p>
                  <p className="text-sm text-muted-foreground">
                    PIC dipakai untuk owner awal issue, tapi masih bisa diubah saat triage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border p-4">
                <span className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FolderOpenDot className="size-4" />
                </span>
                <div>
                  <p className="font-medium">Project mapping</p>
                  <p className="text-sm text-muted-foreground">
                    Project membantu dashboard dan kanban memfilter issue berdasarkan product area.
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
