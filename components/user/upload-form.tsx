"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUp, Plus, Trash2 } from "lucide-react"

interface FileWithInstructions {
  file: File | null;
  instructions: string;
}

export function UploadForm({ onNext }: { onNext: (data: any) => void }) {
  const [files, setFiles] = useState<FileWithInstructions[]>([{ file: null, instructions: "" }])
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")

  const addMoreFiles = () => {
    setFiles([...files, { file: null, instructions: "" }])
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleFileChange = (index: number, file: File | null) => {
    const newFiles = [...files]
    newFiles[index].file = file
    setFiles(newFiles)
  }

  const handleInstructionsChange = (index: number, instructions: string) => {
    const newFiles = [...files]
    newFiles[index].instructions = instructions
    setFiles(newFiles)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ files, email, mobile })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
      </div>

      {files.map((fileData, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                required
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeFile(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Textarea
              placeholder="Printing instructions (e.g., color, double-sided, etc.)"
              value={fileData.instructions}
              onChange={(e) => handleInstructionsChange(index, e.target.value)}
              required
            />
          </div>
        </Card>
      ))}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={addMoreFiles}>
          <Plus className="mr-2 h-4 w-4" />
          Add More Files
        </Button>
        <Button type="submit">
          Next
          <FileUp className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}