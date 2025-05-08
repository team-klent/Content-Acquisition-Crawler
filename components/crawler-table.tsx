"use client"

import { useState } from "react"
import { MoreHorizontal, Play, Pause, Trash2, Edit, Clock, Code, Globe, Tag } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CrawlerSource } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface CrawlerTableProps {
  sources: CrawlerSource[]
  onStatusChange: (id: string, status: string) => void
  onDelete: (id: string) => void
}

export function CrawlerTable({ sources, onStatusChange, onDelete }: CrawlerTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "paused":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Paused
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const toggleRowExpansion = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Source
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Script
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Interval
              </div>
            </TableHead>
            <TableHead>Initial/Start</TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Type
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No sources found. Add a new source to get started.
              </TableCell>
            </TableRow>
          ) : (
            sources.map((source) => (
              <TableRow
                key={source.id}
                className={source.status === "error" ? "bg-red-50 dark:bg-red-900/10" : ""}
                onClick={() => toggleRowExpansion(source.id)}
              >
                <TableCell className="font-medium">
                  <div className="truncate max-w-[250px]" title={source.source}>
                    {source.source}
                  </div>
                </TableCell>
                <TableCell>{source.script}</TableCell>
                <TableCell>{getStatusBadge(source.status)}</TableCell>
                <TableCell>{source.interval}</TableCell>
                <TableCell>{formatDate(source.initial)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{source.type}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onStatusChange(source.id, source.status === "active" ? "paused" : "active")
                        }}
                      >
                        {source.status === "active" ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            <span>Activate</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(source.id)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
