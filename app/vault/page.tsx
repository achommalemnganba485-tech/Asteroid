"use client"

import type React from "react"

import { useState } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FileText, Upload, Eye, Trash2, Shield, Lock, Plus, Search, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function VaultPage() {
  const { vault, addVaultItem, removeVaultItem, addActivity, isAdvanced } = useSafeTrekStore()
  const { toast } = useToast()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const canUploadMore = true

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload JPEG, PNG, PDF, or Word documents only.",
        variant: "destructive",
      })
      return
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      addVaultItem({
        name: file.name,
        size: file.size,
        date: new Date().toISOString(),
        type: file.type,
      })

      addActivity({
        type: "DOCUMENT_UPLOADED",
        time: new Date().toISOString(),
        meta: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        },
      })

      toast({
        title: "Document uploaded",
        description: `${file.name} has been securely encrypted and stored.`,
      })

      setUploadDialogOpen(false)
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteDocument = (id: string, name: string) => {
    removeVaultItem(id)

    addActivity({
      type: "DOCUMENT_DELETED",
      time: new Date().toISOString(),
      meta: { fileName: name },
    })

    toast({
      title: "Document deleted",
      description: `${name} has been permanently removed from your vault.`,
    })
  }

  const handleViewDocument = (doc: any) => {
    addActivity({
      type: "DOCUMENT_VIEWED",
      time: new Date().toISOString(),
      meta: { fileName: doc.name },
    })

    toast({
      title: "Document accessed",
      description: `Opening ${doc.name}...`,
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return "🖼️"
    if (type.includes("pdf")) return "📄"
    if (type.includes("word")) return "📝"
    return "📁"
  }

  const filteredDocuments = vault.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Secure Document Vault
              {isAdvanced && <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">ADVANCED</Badge>}
            </h1>
            <p className="text-muted-foreground">Your important travel documents, encrypted and secure</p>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Add important documents to your secure vault. All files are encrypted with AES-256.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="focus-ring"
                  />
                  <p className="text-xs text-muted-foreground">Supported: JPEG, PNG, PDF, Word documents (max 10MB)</p>
                </div>
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Encrypting and uploading...
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  AES-256 Encryption + Unlimited Storage
                </h3>
                <p className="text-sm text-green-700 dark:text-green-200">
                  All documents are encrypted end-to-end with unlimited storage in the Advanced pilot program.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{vault.length} documents (unlimited storage)</span>
            <span>{formatFileSize(vault.reduce((total, doc) => total + doc.size, 0))} total</span>
          </div>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getFileIcon(doc.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate" title={doc.name}>
                          {doc.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {doc.type.split("/")[1]?.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mb-4">
                    Uploaded {new Date(doc.date).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)} className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Document</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to permanently delete "{doc.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteDocument(doc.id, doc.name)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No documents found" : "No documents uploaded"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? `No documents match "${searchQuery}"`
                  : "Upload your important travel documents to keep them secure and accessible."}
              </p>
              {!searchQuery && (
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First Document
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
