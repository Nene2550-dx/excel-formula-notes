const fs = require('fs');
let code = fs.readFileSync('src/components/AIImportModal.tsx', 'utf8');

// Update generateMockData function
const mockDataStart = "const generateMockData = (fileName: string) => {";
const mockDataEnd = "};";
const mockDataRegex = new RegExp(mockDataStart + "[\\s\\S]*?  };", "m");

const newMockData = `const generateMockData = (fileName: string) => {
  return {
    notes: [
      { id: \`mock-sec-1\`, order: 0, title: '01 VLOOKUP คืออะไร?', content: '<p>VLOOKUP ใช้สำหรับค้นหาข้อมูลจากตาราง โดยจะค้นหาค่าที่เรากำหนดจากคอลัมน์แรกของช่วงข้อมูล แล้วดึงข้อมูลจากคอลัมน์ที่ต้องการกลับมา</p>', layout: 'text' as const },
      { id: \`mock-sec-2\`, order: 1, title: '02 วิธีทำงาน (จำง่ายๆ)', content: '<ul><li>ค้นหาค่าจากคอลัมน์แรก</li><li>เลื่อนไปยังคอลัมน์ที่กำหนด</li><li>ดึงค่าข้อมูลกลับมา</li></ul><p><strong>จำง่าย ๆ:</strong> หาในคอลัมน์แรก แล้วดึงค่าจากคอลัมน์ที่ต้องการ</p>', layout: 'text' as const },
      { id: \`mock-sec-3\`, order: 2, title: '03 Exam Tip', content: '<p>จำไว้เสมอว่า <strong>FALSE = Exact Match (ต้องตรงกันเป๊ะๆ)</strong> ส่วน TRUE = Approximate Match (ค่าใกล้เคียง)</p>', layout: 'warning' as const }
    ],
    formulas: [
      {
        id: \`mock-form-1\`,
        name: 'VLOOKUP',
        category: 'Lookup',
        shortDescription: 'ค้นหาและดึงข้อมูลจากตาราง',
        purpose: 'ใช้ค้นหาข้อมูลจากตาราง โดยจะค้นหาค่าที่เรากำหนดจากคอลัมน์แรกของช่วงข้อมูล แล้วดึงข้อมูลจากคอลัมน์ที่ต้องการกลับมา',
        formula: '=VLOOKUP(A2,A2:D10,3,FALSE)',
        syntax: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
        example: '=VLOOKUP(A2,A2:D10,3,FALSE)',
        teacherNote: 'จำไว้เสมอว่าตารางที่ใช้ค้นหา (table_array) ควรล็อคเซลล์ด้วย $ ก่อนลากสูตรลงมา (เช่น $A$2:$D$10)',
        commonError: '#N/A: แปลว่าหาข้อมูลในคอลัมน์แรกไม่เจอ หรือลืมใส่ FALSE ตอนต้องการข้อมูลที่ตรงกันเป๊ะ',
        source: fileName,
        isFavorite: false,
        isDraft: false,
        importance: 'exam' as const
      },
      {
        id: \`mock-form-2\`,
        name: 'XLOOKUP',
        category: 'Lookup',
        shortDescription: 'ฟังก์ชันค้นหาที่ยืดหยุ่นกว่า VLOOKUP',
        purpose: 'ค้นหาข้อมูลจากช่วงหนึ่ง แล้วคืนค่าจากอีกช่วงหนึ่ง โดยไม่ต้องให้ข้อมูลอยู่คอลัมน์ขวาสุด',
        formula: '=XLOOKUP(A2, Data!A:A, Data!C:C, "Not Found")',
        syntax: 'XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])',
        example: '=XLOOKUP(A2, Data!A:A, Data!C:C, "Not Found")',
        teacherNote: 'ในข้อสอบถ้าใช้ Office 365 อาจารย์อาจจะให้ใช้ XLOOKUP แทน VLOOKUP เพราะเขียนง่ายกว่า ไม่ต้องนับคอลัมน์',
        source: fileName,
        isFavorite: false,
        isDraft: false,
        importance: 'normal' as const
      }
    ]
  };
};`;

code = code.replace(mockDataRegex, newMockData);

// Update processing labels
const labelsStart = "const stages = 5;";
const labelsEnd = "].map((label, idx)";
const processingLabelsOld = `[
                  'Reading file contents',
                  'Understanding context',
                  'Extracting Excel formulas',
                  'Creating study notes',
                  'Preparing import preview'
                ]`;
const processingLabelsNew = `[
                  'Reading file',
                  'Understanding lecture content',
                  'Detecting topics',
                  'Finding formulas',
                  'Reading screenshots',
                  'Creating Thai summary',
                  'Creating examples',
                  'Checking formulas',
                  'Organizing Study Content'
                ]`;

code = code.replace("const stages = 5;", "const stages = 9;");
code = code.replace(processingLabelsOld, processingLabelsNew);

// Update UI text for Organize step to Thai
code = code.replace("Where should we save this?", "อยากเก็บเนื้อหานี้ไว้ที่ไหน?");
code = code.replace("AI has analyzed the file and prepared suggestions.", "AI วิเคราะห์ไฟล์และแนะนำการจัดเก็บข้อมูลให้คุณแล้ว");
code = code.replace("Target Folder / Unit", "สร้างหรือเพิ่มในโฟลเดอร์");
code = code.replace("Existing Unit", "เพิ่มเข้า Unit เดิม");
code = code.replace("Create New Unit", "สร้าง Unit ใหม่");
code = code.replace("✦ AI Suggests: Unit 03", "✦ AI แนะนำให้เก็บที่นี่");

fs.writeFileSync('src/components/AIImportModal.tsx', code);
