"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CrawlerSource } from "@/lib/types"

interface AddSourceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (source: CrawlerSource) => void
}

export function AddSourceDialog({ open, onOpenChange, onAdd }: AddSourceDialogProps) {
  const [newSource, setNewSource] = useState<Omit<CrawlerSource, "id">>({
    source: "",
    script: "",
    status: "active",
    interval: "1h",
    initial: new Date().toISOString(),
    type: "website",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(newSource as CrawlerSource)
    setNewSource({
      source: "",
      script: "",
      status: "active",
      interval: "1h",
      initial: new Date().toISOString(),
      type: "website",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Source</DialogTitle>
          <DialogDescription>Add a new source for content acquisition and web crawling.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source" className="text-right">
                Source URL
              </Label>
              <Input
                id="source"
                placeholder="https://example.com"
                className="col-span-3"
                value={newSource.source}
                onChange={(e) => setNewSource({ ...newSource, source: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="script" className="text-right">
                Script
              </Label>
              <Input
                id="script"
                placeholder="ExampleScraper"
                className="col-span-3"
                value={newSource.script}
                onChange={(e) => setNewSource({ ...newSource, script: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interval" className="text-right">
                Interval
              </Label>
              <Select
                value={newSource.interval}
                onValueChange={(value) => setNewSource({ ...newSource, interval: value })}
              >
                <SelectTrigger className="col-span-3" id="interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="2h">2 hours</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="12h">12 hours</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={newSource.type} onValueChange={(value) => setNewSource({ ...newSource, type: value })}>
                <SelectTrigger className="col-span-3" id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="forum">Forum</SelectItem>
                  <SelectItem value="repository">Repository</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="initial" className="text-right">
                Initial Start
              </Label>
              <Input
                id="initial"
                type="datetime-local"
                className="col-span-3"
                value={new Date(newSource.initial).toISOString().slice(0, 16)}
                onChange={(e) =>
                  setNewSource({
                    ...newSource,
                    initial: new Date(e.target.value).toISOString(),
                  })
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Source</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
