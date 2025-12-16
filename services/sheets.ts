import { Job } from '../types';

export const generateJobId = (company: string, position: string) => {
    // Create a deterministic slug for the ID to link images consistently
    const cleanCompany = (company || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
    const cleanPosition = (position || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
    return `${cleanCompany}-${cleanPosition}`;
};

export const formatBenefitsForSheet = (text: string): string => {
  if (!text) return '';
  
  // Target length between 100-120 characters
  const maxLineLength = 110;
  
  // Preserve existing newlines entered by user
  const paragraphs = text.split('\n'); 
  
  const formattedParagraphs = paragraphs.map(para => {
    // If paragraph is short enough, keep it
    if (para.length <= maxLineLength) return para;
    
    const words = para.split(' ');
    let currentLine = '';
    let result = '';
    
    for (const word of words) {
      // If adding the next word exceeds the max length, break the line
      if ((currentLine + word).length > maxLineLength) {
         // Only break if currentLine is not empty
         if (currentLine.length > 0) {
            result += currentLine.trim() + '\n';
            currentLine = word + ' ';
         } else {
            // Word itself is longer than max length (unlikely but possible), put it on its own line
            result += word + '\n';
            currentLine = '';
         }
      } else {
         currentLine += word + ' ';
      }
    }
    result += currentLine.trim();
    return result;
  });
  
  return formattedParagraphs.join('\n');
};

export const fetchJobsFromSheet = async (scriptUrl: string): Promise<Job[]> => {
  try {
    const response = await fetch(scriptUrl);
    const json = await response.json(); 
    
    // The provided script returns sheet.getDataRange().getValues()
    // This is an array of arrays. row[0] is headers.
    const rows = json.slice(1);
    
    return rows.map((row: any[], index: number) => {
      // Map based on the appendRow order in doPost:
      // [company, position, link, applied, dateApplied, response, payRate, benefits, other]
      
      const dateAppliedRaw = row[4];
      let dateApplied = '';
      if (dateAppliedRaw) {
        // Handle Google Sheets date format if it comes back as a string
        dateApplied = String(dateAppliedRaw).split('T')[0];
      }
      
      const company = row[0] || '';
      const position = row[1] || '';
      
      return {
        id: generateJobId(company, position),
        company: company,
        position: position,
        postingLink: row[2] || '',
        applied: String(row[3] || 'no').toLowerCase() as 'yes' | 'no',
        dateApplied: dateApplied,
        response: row[5] || 'WAITING T-T',
        predictedPay: row[6] || '',
        salaryBenefits: row[7] || '',
        notes: row[8] || '',
        employmentType: row[10] || 'Full-time',
        datePosted: row[11] ? String(row[11]).split('T')[0] : new Date().toISOString().split('T')[0]
      };
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export const postJobToSheet = async (scriptUrl: string, job: Job, isUpdate = false) => {
  const payload = {
    company: job.company,
    position: job.position,
    link: job.postingLink,
    applied: job.applied,
    dateApplied: job.dateApplied,
    response: job.response || 'WAITING T-T',
    payRate: job.predictedPay,
    benefits: job.salaryBenefits,
    other: job.notes,
    employmentType: job.employmentType,
    datePosted: job.datePosted
  };

  await fetch(scriptUrl, {
    method: 'POST',
    body: JSON.stringify(payload),
    mode: 'no-cors' 
  });
  
  return true;
};

export const deleteJobFromSheet = async (scriptUrl: string, job: Job) => {
  const payload = {
    action: 'delete',
    company: job.company,
    position: job.position
  };

  await fetch(scriptUrl, {
    method: 'POST',
    body: JSON.stringify(payload),
    mode: 'no-cors'
  });

  return true;
};