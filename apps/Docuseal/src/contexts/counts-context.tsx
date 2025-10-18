'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from '@/lib/auth-client';

interface CountsContextType {
  submissionsCount: number;
  templatesCount: number;
  loading: boolean;
  refreshCounts: () => Promise<void>;
  incrementSubmissions: () => void;
  decrementSubmissions: () => void;
  incrementTemplates: () => void;
  decrementTemplates: () => void;
}

const CountsContext = createContext<CountsContextType | undefined>(undefined);

export function CountsProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [templatesCount, setTemplatesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCounts = async () => {
    if (!session) return;

    try {
      setLoading(true);
      
      // Fetch templates count - explicitly set high limit to override API default
      const templatesRes = await fetch('/api/docuseal/templates?limit=1000');
      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        const templates = templatesData.data || templatesData.templates || templatesData || [];
        const count = Array.isArray(templates) ? templates.length : 0;
        setTemplatesCount(count);
      }

      // Fetch submissions count - get total count with high limit
      const submissionsRes = await fetch('/api/docuseal/submissions?status=&limit=1000');
      if (submissionsRes.ok) {
        const raw = await submissionsRes.json();
        // Use the exact same logic as the submissions page
        let submissions: any[] = [];
        if (Array.isArray(raw)) submissions = raw;
        else if (Array.isArray(raw?.data)) submissions = raw.data;
        else if (Array.isArray(raw?.items)) submissions = raw.items;
        else submissions = [];
        
        console.log('=== CONTEXT DATA ===');
        console.log('Raw API response:', raw);
        console.log('Processed submissions:', submissions);
        console.log('Pagination info:', raw.pagination);
        
        // Count all submissions since we're fetching with high limit
        const count = Array.isArray(submissions) ? submissions.length : 0;
        console.log('Using count:', count, 'Total submissions fetched:', submissions.length);
        
        // Debug: Group submissions by submission_id to see which ones have multiple recipients
        if (Array.isArray(submissions) && submissions.length > 0) {
          const submissionGroups: Record<string, any[]> = {};
          submissions.forEach((item: any) => {
            const submissionId = String(item.submission_id || item.id);
            if (!submissionGroups[submissionId]) {
              submissionGroups[submissionId] = [];
            }
            submissionGroups[submissionId].push({
              email: item.email || item.submitter?.email,
              name: item.name || item.submitter?.name,
              status: item.status
            });
          });
          
          console.log('=== SUBMISSION ANALYSIS ===');
          console.log('Total submissions/submitters:', count);
          
          const multiRecipientSubmissions: any[] = [];
          Object.keys(submissionGroups).forEach(submissionId => {
            const recipients = submissionGroups[submissionId];
            if (recipients.length > 1) {
              multiRecipientSubmissions.push({
                submissionId,
                recipientCount: recipients.length,
                recipients
              });
            }
          });
          
          console.log('Submissions sent to multiple people:', multiRecipientSubmissions);
          console.log('Number of unique submission documents:', Object.keys(submissionGroups).length);
          console.log('Breakdown by submission ID:', submissionGroups);
        }
        
        setSubmissionsCount(count);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCounts = async () => {
    await fetchCounts();
  };

  const incrementSubmissions = () => {
    setSubmissionsCount(prev => prev + 1);
  };

  const decrementSubmissions = () => {
    setSubmissionsCount(prev => Math.max(0, prev - 1));
  };

  const incrementTemplates = () => {
    setTemplatesCount(prev => prev + 1);
  };

  const decrementTemplates = () => {
    setTemplatesCount(prev => Math.max(0, prev - 1));
  };

  // Fetch counts when component mounts and user is authenticated
  useEffect(() => {
    if (session) {
      fetchCounts();
    } else {
      setSubmissionsCount(0);
      setTemplatesCount(0);
      setLoading(false);
    }
  }, [session]);

  const value: CountsContextType = {
    submissionsCount,
    templatesCount,
    loading,
    refreshCounts,
    incrementSubmissions,
    decrementSubmissions,
    incrementTemplates,
    decrementTemplates,
  };

  return (
    <CountsContext.Provider value={value}>
      {children}
    </CountsContext.Provider>
  );
}

export function useCounts() {
  const context = useContext(CountsContext);
  if (context === undefined) {
    throw new Error('useCounts must be used within a CountsProvider');
  }
  return context;
}
