const fs = require('fs');
let code = fs.readFileSync('src/components/AIImportModal.tsx', 'utf8');

// Update generateMockData function to include IF function example
const mockDataStart = "const generateMockData = (fileName: string) => {";
const mockDataEnd = "};";
const mockDataRegex = new RegExp(mockDataStart + "[\\s\\S]*?  };", "m");

const newMockData = `const generateMockData = (fileName: string) => {
  return {
    notes: [
      { id: \`mock-sec-1\`, order: 0, title: '01 IF คืออะไร?', content: '<p>IF ใช้สำหรับตรวจสอบว่าเงื่อนไขที่เรากำหนดเป็นจริงหรือไม่</p><ul><li>ถ้าจริง &rarr; ให้แสดงค่าที่เราต้องการ</li><li>ถ้าไม่จริง &rarr; ให้แสดงอีกค่าหนึ่ง</li></ul><p><strong>จำง่าย ๆ:</strong> <code>ถ้าเงื่อนไขเป็นแบบนี้ &rarr; ทำ A ถ้าไม่ใช่ &rarr; ทำ B</code></p>', layout: 'text' as const },
      { id: \`mock-sec-2\`, order: 1, title: '02 VLOOKUP คืออะไร?', content: '<p>VLOOKUP ใช้ค้นหาข้อมูลจากตาราง โดยค้นหาค่าที่เราต้องการจากคอลัมน์แรกของตาราง จากนั้นดึงข้อมูลจากคอลัมน์ที่เราระบุออกมา</p><p><strong>จำง่าย ๆ:</strong> หาในคอลัมน์แรก &rarr; แล้วดึงข้อมูลจากคอลัมน์ที่ต้องการ</p>', layout: 'text' as const },
      { id: \`mock-sec-3\`, order: 2, title: '03 Exam Tip', content: '<p>จำไว้เสมอว่า <strong>FALSE = Exact Match (ต้องตรงกันเป๊ะๆ)</strong> ส่วน TRUE = Approximate Match (ค่าใกล้เคียง)</p>', layout: 'warning' as const }
    ],
    formulas: [
      {
        id: \`mock-form-0\`,
        name: 'IF',
        category: 'Logical',
        shortDescription: 'ตรวจสอบเงื่อนไข ถ้าจริงทำอย่าง ถ้าเท็จทำอย่าง',
        purpose: 'IF เป็นฟังก์ชันที่ใช้ตรวจสอบเงื่อนไข ถ้าเงื่อนไขเป็นจริงให้คืนค่าหนึ่ง ถ้าเงื่อนไขเป็นเท็จให้คืนค่าอีกค่าหนึ่ง',
        formula: '=IF(condition, value_if_true, value_if_false)',
        syntax: 'IF(logical_test, [value_if_true], [value_if_false])',
        example: '=IF(B2>=50, "Pass", "Fail")',
        teacherNote: 'ใช้เครื่องหมายคำพูด (" ") เสมอเมื่อต้องการให้ผลลัพธ์ออกมาเป็นข้อความ เช่น "Pass" หรือ "Fail"',
        source: fileName,
        isFavorite: true,
        isDraft: false,
        importance: 'exam' as const
      },
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
      }
    ]
  };
};`;

code = code.replace(mockDataRegex, newMockData);
fs.writeFileSync('src/components/AIImportModal.tsx', code);
