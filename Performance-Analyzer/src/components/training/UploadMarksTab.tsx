import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud, FileSpreadsheet, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { yearOptions } from "./trainingTypes";
import { useBranches } from '../../hooks/useBranches';
import { API_BASE_URL } from '../../config';

interface ParsedStudentData {
  rollNumber: string;
  name: string;
  marks: number;
  normalized?: number;
  assessment?: number;
  finalScore?: number;
  category?: string;
}

interface UploadMarksTabProps {
  facultyUsername: string;
}

export const UploadMarksTab = ({ facultyUsername }: UploadMarksTabProps) => {
  const { branchOptions } = useBranches();
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // File State
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validExtensions = ['.xlsx', '.xls', '.pdf'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (validExtensions.includes(fileExtension)) {
      setFile(selectedFile);
    } else {
      toast.error("Invalid file type. Please upload .xlsx, .xls, or .pdf");
    }
  };



  const handleSimulatePDFParsing = () => {
    // PDF extraction pure client-side is very complex without a backend OCR tool.
    // For Phase 1, we will simulate a successful read.
    setTimeout(() => {
      toast.success("PDF uploaded and processed (Simulated)");
      setIsUploading(false);
      resetForm();
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!year || !branch || !section || !subject) {
      toast.error("Please fill in all required Subject Metadata fields.");
      return;
    }

    if (!file) {
      toast.error("Please upload a file to proceed.");
      return;
    }

    setIsUploading(true);
    toast.loading("Uploading and extracting marks...");

    try {
      const isPdf = file.name.toLowerCase().endsWith('.pdf');

      if (isPdf) {
        handleSimulatePDFParsing();
        toast.dismiss();
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('year', year);
      formData.append('branch', branch);
      formData.append('section', section.trim());
      formData.append('subject', subject.trim());
      formData.append('uploadedBy', facultyUsername);

      const response = await fetch(`${API_BASE_URL}/api/upload-marks`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Upload failed");
      }

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        throw new Error("No data returned from server");
      }

      toast.dismiss();
      toast.success(data.message || `Successfully analyzed marks for ${data.data?.length || 0} students!`);
      resetForm();

    } catch (error: any) {
      console.error("Upload error:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to process the uploaded file.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setYear("");
    setBranch("");
    setSection("");
    setSubject("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Upload Section */}
      <Card className="shadow-md border border-border/50">
        <CardHeader>
          <CardTitle>Upload Subject Marks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Metadata Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Year <span className="text-destructive">*</span></Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                <SelectContent>
                  {yearOptions.map(y => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Branch <span className="text-destructive">*</span></Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                <SelectContent>
                  {branchOptions.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Section <span className="text-destructive">*</span></Label>
              <Input
                value={section}
                onChange={(e) => setSection(e.target.value.toUpperCase())}
                placeholder="e.g. A"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Subject Name <span className="text-destructive">*</span></Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Data Structures"
              />
            </div>
          </div>

          {/* Drag & Drop Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors
                ${file ? 'border-primary/50 bg-primary/5' : 'border-border/50 hover:border-primary/50 hover:bg-secondary/20'}
              `}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx, .xls, .pdf"
              onChange={handleFileChange}
            />

            {!file ? (
              <div className="flex flex-col items-center gap-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center">
                  <UploadCloud className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-lg">Click to upload or drag & drop</p>
                  <p className="text-sm text-muted-foreground mt-1">Accepts Excel (.xlsx, .xls) and PDF</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" /> {file.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                  Remove File
                </Button>
              </div>
            )}
          </div>

          <Button
            className="w-full py-6 text-lg"
            onClick={handleSubmit}
            disabled={isUploading || !file}
          >
            {isUploading ? "Uploading..." : "Upload Marks"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
