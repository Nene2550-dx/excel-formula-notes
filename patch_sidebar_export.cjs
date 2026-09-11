const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// The Settings Modal in Sidebar currently looks like:
/*
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Gemini API Key</label>
                ...
*/
// I will append a Data Management section to it.
const targetRegex = /<\/div>\n\n            <button \n              onClick=\{\(\) => \{/g;

const dataManagementJSX = `
              <div className="pt-4 border-t border-[var(--color-powder)]">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Backup & Sync (iPad / Mac)</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const data = storageService.exportData();
                      const blob = new Blob([data], {type: 'application/json'});
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = \`excel-notes-backup-\${new Date().toISOString().split('T')[0]}.json\`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex-1 px-4 py-2 bg-stone-100 text-stone-600 font-bold text-xs rounded-xl hover:bg-[var(--color-ivory)] hover:text-[var(--color-ink)] transition-colors border border-stone-200"
                  >
                    📥 Save Backup
                  </button>

                  <label className="flex-1 px-4 py-2 bg-stone-100 text-stone-600 font-bold text-xs rounded-xl hover:bg-[var(--color-ivory)] hover:text-[var(--color-ink)] transition-colors border border-stone-200 cursor-pointer text-center">
                    📤 Load Backup
                    <input 
                      type="file" 
                      accept=".json" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const result = storageService.importData(evt.target?.result as string);
                            if (result.success) {
                              alert('อัปเดตข้อมูลสำเร็จ! กรุณารีเฟรชหน้าเว็บ');
                              window.location.reload();
                            } else {
                              alert('Error: ' + result.message);
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-stone-400 mt-2 text-center">เซฟไฟล์ Backup จาก Mac ไปไว้ใน Google Drive แล้วกด Load Backup ใน iPad เพื่อใช้งานต่อได้เลย!</p>
              </div>
            </div>

            <button 
              onClick={() => {`;

code = code.replace(targetRegex, dataManagementJSX);

fs.writeFileSync('src/components/Sidebar.tsx', code);
