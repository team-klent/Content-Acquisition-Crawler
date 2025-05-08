"use client"

import { useState } from "react"
import { Plus, Search, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CrawlerTable } from "@/components/crawler-table"
import { AddSourceDialog } from "@/components/add-source-dialog"
import type { CrawlerSource } from "@/lib/types"

export function CrawlerDashboard() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for demonstration
  const [sources, setSources] = useState<CrawlerSource[]>([
    {
      id: "1",
      source: "https://example.com",
      script: "ExampleScraper",
      status: "active",
      interval: "1h",
      initial: "2023-05-01T08:00:00Z",
      type: "blog",
    },
    {
      id: "2",
      source: "https://news.ycombinator.com",
      script: "HackerNewsScraper",
      status: "paused",
      interval: "30m",
      initial: "2023-04-15T12:30:00Z",
      type: "news",
    },
    {
      id: "3",
      source: "https://reddit.com/r/programming",
      script: "RedditScraper",
      status: "error",
      interval: "2h",
      initial: "2023-05-10T10:00:00Z",
      type: "forum",
    },
    {
      id: "4",
      source: "https://dev.to",
      script: "DevToScraper",
      status: "active",
      interval: "4h",
      initial: "2023-05-05T09:15:00Z",
      type: "blog",
    },
    {
      id: "5",
      source: "https://github.com/trending",
      script: "GithubTrendingScraper",
      status: "active",
      interval: "12h",
      initial: "2023-05-02T00:00:00Z",
      type: "repository",
    },
  ])

  const addSource = (source: CrawlerSource) => {
    setSources([...sources, { ...source, id: (sources.length + 1).toString() }])
    setIsAddDialogOpen(false)
  }

  const updateSourceStatus = (id: string, status: string) => {
    setSources(sources.map((source) => (source.id === id ? { ...source, status } : source)))
  }

  const deleteSource = (id: string) => {
    setSources(sources.filter((source) => source.id !== id))
  }

  const filteredSources = sources.filter(
    (source) =>
      source.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.script.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Content Acquisition Dashboard</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Source
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search sources..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="sm:w-auto w-full">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="sm:w-auto w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <CrawlerTable sources={filteredSources} onStatusChange={updateSourceStatus} onDelete={deleteSource} />
        </div>
      </div>

      <AddSourceDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={addSource} />
    </div>
  )
}
