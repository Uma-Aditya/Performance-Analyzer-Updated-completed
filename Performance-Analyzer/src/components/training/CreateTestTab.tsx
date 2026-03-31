import { useState, useEffect } from 'react';
import { CreateTestForm } from './CreateTestForm';
import { TestList } from './TestList';
import { BulkQuestionImport } from './BulkQuestionImport';
import { AIQuestionVariationTool } from './AIQuestionVariationTool';
import { AssignedTest } from '../../data/mockTestData';
import { API_BASE_URL } from '../../config';

interface CreateTestTabProps {
    facultyUsername: string;
}

export const CreateTestTab = ({ facultyUsername }: CreateTestTabProps) => {
    const [createdTests, setCreatedTests] = useState<AssignedTest[]>([]);

    const fetchTests = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tests/faculty?username=${facultyUsername}`);
            if (response.ok) {
                const data = await response.json();

                // Map the backend format to the expected AssignedTest format if necessary
                const formattedTests = data.map((t: any) => ({
                    id: t.id,
                    title: t.testName,
                    subject: t.subject,
                    year: t.year,
                    branch: t.branch,
                    section: t.section,
                    // Parse the date back from ISO string
                    date: t.startTime.split('T')[0],
                    startTime: t.startTime.split('T')[1].substring(0, 5),
                    endTime: t.endTime.split('T')[1].substring(0, 5),
                    createdBy: t.createdBy
                }));

                setCreatedTests(formattedTests);
            }
        } catch (error) {
            console.error("Failed to fetch previous tests", error);
        }
    };

    useEffect(() => {
        fetchTests();
    }, [facultyUsername]);

    return (
        <div className="space-y-8">
            {/* Create Test Form Section */}
            <CreateTestForm
                facultyUsername={facultyUsername}
                onTestCreated={fetchTests}
            />

            {/* Bulk Question Import - only shown if there are existing tests */}
            {createdTests.length > 0 && (
                <BulkQuestionImport
                    testId={createdTests[0].id as unknown as number}
                    onImported={fetchTests}
                />
            )}

            {/* Smart Question Bank Expansion Tool (AI) */}
            <AIQuestionVariationTool />

            {/* Renders previous tests */}
            <TestList tests={createdTests} />
        </div>
    );
};
