const fs = require('fs');
let code = fs.readFileSync('src/components/AIImportModal.tsx', 'utf8');

// 1. Add Gemini import
const importMarker = "import { validateFormula } from '../utils/formulaValidator';";
code = code.replace(importMarker, importMarker + "\nimport { analyzeFileWithGemini } from '../services/gemini';\nimport { storageService } from '../services/storage';");

// 2. We need to handle file reading when the user uploads
// Find handleFileUpload and change it to read as base64
const handleUploadRegex = /const handleFileUpload = \(e: React.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?setStep\('processing'\);\n  \};/;
const newHandleUpload = `const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!storageService.getApiKey()) {
        alert('Please add your Gemini API Key in Settings first.');
        return;
      }
      setFileName(file.name);
      setStep('processing');
      
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
             const base64Data = reader.result as string;
             const result = await analyzeFileWithGemini(base64Data, file.type, file.name);
             
             // Map result back to expected internal types
             const mappedNotes = result.notes.map((n, idx) => ({ ...n, id: 'ai-sec-' + Date.now() + idx, order: idx }));
             const mappedFormulas = result.formulas.map((f, idx) => ({ ...f, id: 'ai-form-' + Date.now() + idx, isFavorite: false, isDraft: false, source: file.name }));
             
             setExtractedNotes(mappedNotes);
             setExtractedFormulas(mappedFormulas);
             
             // Auto select all
             setSelectedNotes(new Set(mappedNotes.map(n => n.id)));
             setSelectedFormulas(new Set(mappedFormulas.map(f => f.id!)));
             
             setProcessingProgress(100);
             setTimeout(() => setStep('organize'), 500);
          } catch (err: any) {
             alert('AI Analysis failed: ' + err.message);
             setStep('upload');
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        alert('Failed to read file');
        setStep('upload');
      }
    }
  };`;
code = code.replace(handleUploadRegex, newHandleUpload);

// 3. Remove the mock setTimeout logic in useEffect
const effectRegex = /useEffect\(\(\) => \{\n\s*let interval: NodeJS\.Timeout;\n\s*if \(step === 'processing'\) \{[\s\S]*?\}, \[step\]\);/;
const newEffect = `useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'processing') {
      interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 95) return prev; // Wait at 95% until AI finishes
          return prev + 2;
        });
        setProcessingStage(prev => Math.min(stages - 1, prev + 1));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [step]);`;
code = code.replace(effectRegex, newEffect);

fs.writeFileSync('src/components/AIImportModal.tsx', code);
