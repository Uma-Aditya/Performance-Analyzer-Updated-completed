import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, UserPlus, Users, FileDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { API_BASE_URL } from '../../config';

export const BulkAdminImport = () => {
    const [studentFile, setStudentFile] = useState<File | null>(null);
    const [facultyFile, setFacultyFile] = useState<File | null>(null);
    const [isUploadingStudent, setIsUploadingStudent] = useState(false);
    const [isUploadingFaculty, setIsUploadingFaculty] = useState(false);

    const handleFileUpload = async (type: 'student' | 'faculty') => {
        const file = type === 'student' ? studentFile : facultyFile;
        if (!file) {
            toast.error("Please select a file first");
            return;
        }

        const setter = type === 'student' ? setIsUploadingStudent : setIsUploadingFaculty;
        setter(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const endpoint = type === 'student' ? '/api/admin/bulk-students' : '/api/admin/bulk-faculty';
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                if (type === 'student') setStudentFile(null);
                else setFacultyFile(null);
            } else {
                toast.error(data.detail || "Upload failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during upload");
        } finally {
            setter(false);
        }
    };

    const downloadTemplate = (type: 'student' | 'faculty') => {
        // In a real app, these would be static files served by the backend
        // For now, we'll just redirect to the test_data ones we created
        const url = type === 'student' ? `${API_BASE_URL}/test_data/students_bulk_template.xlsx` : `${API_BASE_URL}/test_data/faculty_bulk_template.xlsx`;
        window.open(url, '_blank');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <UserPlus className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Bulk Student Registration</CardTitle>
                            <CardDescription>Upload an Excel or CSV file to register multiple students at once.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-border rounded-xl bg-secondary/5 space-y-4">
                        <div className="space-y-2 text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
                            <p className="text-sm font-medium">Drag & drop student list here</p>
                            <p className="text-xs text-muted-foreground">Supports .xlsx, .xls, .csv</p>
                        </div>
                        <Input 
                            type="file" 
                            accept=".xlsx,.xls,.csv" 
                            onChange={(e) => setStudentFile(e.target.files?.[0] || null)}
                            className="bg-background"
                        />
                        {studentFile && (
                            <div className="flex items-center gap-2 text-xs text-green-500 font-medium animate-in zoom-in-95">
                                <CheckCircle2 size={14} />
                                Selected: {studentFile.name}
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button 
                            variant="outline" 
                            className="w-full text-xs h-9 font-medium border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
                            onClick={() => downloadTemplate('student')}
                        >
                            <FileDown className="mr-2 h-4 w-4" />
                            Sample Template
                        </Button>
                        <Button 
                            className={`w-full text-xs h-9 font-semibold ${isUploadingStudent ? 'opacity-70 cursor-not-allowed' : 'stellar-btn shadow-md hover:shadow-lg transition-all'}`}
                            onClick={() => handleFileUpload('student')}
                            disabled={isUploadingStudent || !studentFile}
                        >
                            {isUploadingStudent ? 'Importing...' : 'Start Import'}
                        </Button>
                    </div>

                    <div className="rounded-lg bg-orange-500/5 border border-orange-500/20 p-3 text-[11px] leading-relaxed text-orange-600/80">
                         <div className="flex gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold mb-1">Upload Requirements:</p>
                                <ul className="list-disc list-inside space-y-0.5 ml-1">
                                    <li>Mandatory columns: <strong>name</strong>, <strong>roll_number</strong>, <strong>password</strong></li>
                                    <li>Optional: <strong>branch</strong>, <strong>year</strong>, <strong>section</strong></li>
                                    <li>Duplicate roll numbers will be skipped automatically</li>
                                </ul>
                            </div>
                         </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Bulk Faculty Registration</CardTitle>
                            <CardDescription>Upload an Excel or CSV file to register multiple faculty accounts.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-border rounded-xl bg-secondary/5 space-y-4">
                         <div className="space-y-2 text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
                            <p className="text-sm font-medium">Drag & drop faculty list here</p>
                            <p className="text-xs text-muted-foreground">Supports .xlsx, .xls, .csv</p>
                        </div>
                        <Input 
                            type="file" 
                            accept=".xlsx,.xls,.csv" 
                            onChange={(e) => setFacultyFile(e.target.files?.[0] || null)}
                            className="bg-background"
                        />
                        {facultyFile && (
                            <div className="flex items-center gap-2 text-xs text-green-500 font-medium animate-in zoom-in-95">
                                <CheckCircle2 size={14} />
                                Selected: {facultyFile.name}
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button 
                            variant="outline" 
                            className="w-full text-xs h-9 font-medium border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
                            onClick={() => downloadTemplate('faculty')}
                        >
                            <FileDown className="mr-2 h-4 w-4" />
                            Sample Template
                        </Button>
                         <Button 
                            className={`w-full text-xs h-9 font-semibold ${isUploadingFaculty ? 'opacity-70 cursor-not-allowed' : 'stellar-btn shadow-md hover:shadow-lg transition-all'}`}
                            onClick={() => handleFileUpload('faculty')}
                            disabled={isUploadingFaculty || !facultyFile}
                        >
                            {isUploadingFaculty ? 'Importing...' : 'Start Import'}
                        </Button>
                    </div>

                    <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 text-[11px] leading-relaxed text-blue-600/80">
                         <div className="flex gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold mb-1">Upload Requirements:</p>
                                <ul className="list-disc list-inside space-y-0.5 ml-1">
                                    <li>Mandatory: <strong>name</strong>, <strong>username</strong>, <strong>password</strong></li>
                                    <li>Optional: <strong>subject</strong></li>
                                    <li>Registration follows unique username constraints</li>
                                </ul>
                            </div>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
