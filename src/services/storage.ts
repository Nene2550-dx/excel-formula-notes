import type { Unit, Formula, UserProfile } from '../types';
import { get, set, del } from 'idb-keyval';

const UNITS_KEY = 'excel_notes_units_v2';
const FORMULAS_KEY = 'excel_notes_formulas_v2';
const INITIAL_DATA_FLAG = 'excel_notes_initialized_v2';

// หน่วยการเรียนรู้ 6 Units อ้างอิงตามหลักสูตรวิชา ดท201 / DX201 (ผศ.ดร. อัจฉรา ภูอ่าง)
export const COURSE_UNITS: Unit[] = [
  {
    id: 'unit-01',
    unitNumber: 'Unit 01',
    title: 'การจัดรูปแบบ & สูตรคำนวณพื้นฐาน',
    description: 'การอ้างอิงเซลล์ (Relative, Absolute, Mixed), การคำนวณร้อยละ, ลำดับเครื่องหมาย, AutoFill และการตรึงแนวตาราง',
    order: 1,
    icon: '📘',
    colorTheme: 'sage',
    createdAt: '2026-09-01T09:00:00.000Z',
    studyContent: `<p>1. การใช้จุดทศนิยม / จัดรูปแบบตัวเลข (Number Formatting)</p><ul><li>ไปที่แท็บ: Home</li><li>กลุ่มเครื่องมือ: Number</li><li>วิธีใช้ & กดเพื่อ:</li><li>เลือกเซลล์ที่ต้องการ แล้วคลิกเลือกรูปแบบตัวเลขจากดรอปดาวน์ (เช่น เปลี่ยนเป็นสกุลเงิน Accounting)</li><li>คลิกปุ่ม Decrease Decimal (ลดทศนิยม) หรือ Increase Decimal (เพิ่มทศนิยม) เพื่อปรับจำนวนตำแหน่งทศนิยมให้แสดงผลตามต้องการ</li></ul><p>2. วิธีการใช้สูตรคำนวณ (ตัวอย่างเช่น ยอดขายเดือนถัดไป)</p><ul><li>วิธีใช้ & กดเพื่อ:</li><li>คลิกเลือกเซลล์ที่ต้องการใส่สูตร (เช่น เซลล์ B3)</li><li>พิมพ์เครื่องหมายเท่ากับตามด้วยสูตร เช่น =B2*103.5% แล้วกด Enter</li><li>เหตุผลที่ใส่แต่ละส่วน:</li><li>= : บอก Excel ว่ากำลังจะเริ่มใส่สูตรคำนวณ</li><li>B2 : อ้างอิงตำแหน่งเซลล์ยอดขายของเดือนก่อนหน้า เพื่อนำค่ามาคำนวณต่อ</li><li>* : เครื่องหมายคูณ</li><li>103.5% : อัตราการเติบโตที่ต้องการเพิ่มขึ้นจากเดือนก่อน (เพิ่มขึ้น 3.5%)</li></ul><p>3. การใช้ฟังก์ชันเติมข้อมูลอัตโนมัติ (AutoFill)</p><ul><li>วิธีใช้ & กดเพื่อ:</li><li>คลิกที่เซลล์ต้นแบบ (เช่น เซลล์สูตร หรือเซลล์ชื่อเดือน)</li><li>เลื่อนเมาส์ไปที่มุมล่างขวาของเซลล์จนเคอร์เซอร์เปลี่ยนเป็นเครื่องหมายบวกสีดำทึบ (Fill Handle)</li><li>คลิกซ้ายค้างไว้แล้วลากลงมาตามจำนวนเซลล์ที่ต้องการแล้วปล่อยเมาส์ เพื่อให้ Excel คัดลอกสูตรหรือเติมข้อมูลเดือนถัดไปให้อัตโนมัติโดยไม่ต้องพิมพ์เอง</li></ul><p>4. การรวมยอดทั้งหมด (Total Row)</p><ul><li>ไปที่แท็บ: Table Tools > Design (หรือคลิกที่ตารางแล้วเลือกแท็บ Design)</li><li>กลุ่มเครื่องมือ: Table Style Options</li><li>วิธีใช้ & กดเพื่อ:</li><li>ติ๊กเลือกช่อง Total Row เพื่อให้ Excel เพิ่มแถวสรุปผลรวม (Sum) ด้านล่างสุดของตารางให้อัตโนมัติ</li></ul><p>5. การสร้างแผนภูมิ (Creating a Chart)</p><ul><li>ไปที่แท็บ: Insert</li><li>กลุ่มเครื่องมือ: Charts</li><li>วิธีใช้ & กดเพื่อ:</li><li>คลุมดำเลือกข้อมูลที่ต้องการนำมาทำกราฟ</li><li>คลิกปุ่ม Recommended Charts เพื่อดูรูปแบบกราฟที่ Excel แนะนำว่าเหมาะสมกับชุดข้อมูล แล้วคลิกเลือกแบบที่ต้องการ (เช่น คอลัมน์แท่ง) กด OK</li></ul><p>6. การตรึงแนวหน้าจอ (Freeze Panes)</p><ul><li>ไปที่แท็บ: View</li><li>กลุ่มเครื่องมือ: Window</li><li>วิธีใช้ & กดเพื่อ:</li><li>คลิกเลือกเซลล์ที่อยู่ถัดจากแถวหรือคอลัมน์ที่ต้องการให้แสดงค้างไว้เวลาเลื่อนหน้าจอ</li><li>คลิกปุ่ม Freeze Panes แล้วเลือกคำสั่ง เพื่อช่วยให้หัวข้อตารางไม่เลื่อนหายไปไหนเวลาเลื่อนดูข้อมูลยาวๆ</li></ul><p>7. การเพิ่มความคิดเห็นในเซลล์ (Add Comments)</p><ul><li>ไปที่แท็บ: Review</li><li>กลุ่มเครื่องมือ: Comments</li><li>วิธีใช้ & กดเพื่อ:</li><li>คลิกเลือกเซลล์ที่ต้องการใส่โน้ต</li><li>คลิกปุ่ม New Comment แล้วพิมพ์ข้อความบันทึกเตือนความจำหรือคำอธิบายเพิ่มเติมลงไป</li></ul><p>ปรับจุดทศนิยม: ไปที่ Home > Group: Number > คลิกปุ่ม Decrease Decimal (ลดทศนิยม) หรือ Increase Decimal (เพิ่มทศนิยม) กดเพื่อปรับจำนวนตำแหน่งทศนิยมของตัวเลขในเซลล์ให้แสดงผลตามต้องการ</p><p>การใส่สูตรคำนวณ (เช่น =B2*103.5%): คลิกเซลล์ที่ต้องการพิมพ์สูตรแล้วกด Enter โดยแต่ละตัวมีความหมายดังนี้:</p><ul><li>= : แจ้ง Excel ว่ากำลังจะเริ่มคำนวณสูตร</li><li>B2 : อ้างอิงเซลล์ยอดขายตั้งต้นเพื่อนำค่ามาคำนวณ</li><li>* : เครื่องหมายคูณ</li><li>103.5% : อัตราส่วนที่ต้องการคำนวณเพิ่มขึ้นจากเดือนก่อน</li></ul><p>เติมข้อมูลหรือสูตรอัตโนมัติ (AutoFill): คลิกที่มุมล่างขวาของเซลล์ (จุด Fill Handle) แล้วลากลงมา กดเพื่อคัดลอกสูตรหรือเติมชื่อเดือนถัดไปให้อัตโนมัติโดยไม่ต้องพิมพ์ใหม่</p><p>รวมยอดทั้งหมด (Total Row): ไปที่ คลิกเซลล์ในตาราง > แท็บ Design > ติ๊กเลือก Total Row กดเพื่อให้ Excel คำนวณผลรวมแถวล่างสุดให้อัตโนมัติ</p><p>สร้างแผนภูมิ (Chart): ไปที่ คลุมดำเลือกข้อมูล > แท็บ Insert > Recommended Charts > เลือกแบบกราฟที่ต้องการแล้วกด OKกดเพื่อสร้างแผนภูมิแสดงผลข้อมูลอัตโนมัติ</p><p>ตรึงแนวตาราง (Freeze Panes): ไปที่ คลิกเซลล์ถัดจากแถว/คอลัมน์ที่ต้องการตรึง > แท็บ View > Freeze Panes กดเพื่อล็อกหัวตารางให้แสดงค้างไว้เวลาเลื่อนหน้าจอลงมาดูข้อมูลข้างล่าง</p><p>เพิ่มความคิดเห็น (Comment): ไปที่ คลิกเซลล์ที่ต้องการ > แท็บ Review > New Comment กดเพื่อพิมพ์ข้อความโน้ตเตือนความจำหรือคำอธิบายเพิ่มเติมในเซลล์นั้นๆ</p><p>การจัดเรียงและกรองข้อมูล (Sort & Filter): ไปที่ คลิกปุ่มลูกศรดรอปดาวน์ที่หัวตาราง (Filter Button) > เลือก Sort A to Z หรือเลือกติ๊กเฉพาะข้อมูลที่ต้องการแล้วกด OK กดเพื่อจัดเรียงลำดับตัวอักษร/ตัวเลข หรือเลือกแสดงเฉพาะข้อมูลที่สนใจ</p><p>การพิมพ์งานและตั้งค่าหัวกระดาษ (Page Layout & Print Titles): ไปที่ แท็บ Page Layout > เลือก Print Titles กดเพื่อกำหนดค่าหน้ากระดาษและเลือกให้หัวตารางพิมพ์ซ้ำอัตโนมัติทุกหน้ากระดาษเมื่อเอกสารมีความยาวหลายหน้า</p><p>การปรับระยะขอบกระดาษ (Margins): ไปที่ แท็บ Page Layout > Margins > เลือกรูปแบบระยะขอบหรือตั้งค่า Custom Margins กดเพื่อปรับระยะห่างขอบกระดาษและจัดหน้าให้อยู่กึ่งกลาง (Center on page) ก่อนสั่งพิมพ์</p>`,
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'unit-02',
    unitNumber: 'Unit 02',
    title: 'การทำความสะอาดและจัดการข้อมูล (Data Cleaning)',
    description: 'จัดการข้อมูลซ้ำ, เติมเซลล์ว่างด้วย F5 (Blanks) & Ctrl+Enter, แปลง Text to Columns, TRIM, SUBSTITUTE, CLEAN, Flash Fill',
    order: 2,
    icon: '✨',
    colorTheme: 'rose',
    createdAt: '2026-09-02T09:00:00.000Z',
    studyContent: `<p>สรุปขั้นตอนการใช้งานเครื่องมือและสูตรในการจัดการข้อมูล (Data Cleaning) ด้วย Excel จากเอกสารแบบกระชับ เรียงตามลำดับเมนูและคำสั่งต่อเนื่อง พร้อมหน้าที่และวิธีใช้งาน มีดังนี้ครับ:</p><ul><li>2.1 การจัดการข้อมูลที่ซ้ำซ้อน (Highlight & Removing Duplicate Rows)</li><li>Highlight ข้อมูลซ้ำ: Home > Conditional Formatting > Highlight Cells Rules > Duplicate Values</li><li>หน้าที่/วิธีใช้: ใช้สำหรับเน้นสี (Highlight) แถวหรือเซลล์ที่มีข้อมูลซ้ำกัน เพื่อให้มองเห็นและตรวจสอบได้ง่ายขึ้น</li><li>ลบข้อมูลซ้ำ: Data > Data Tools > Remove Duplicates</li><li>หน้าที่/วิธีใช้: ใช้ลบแถวข้อมูลที่ซ้ำกันออกไปจากชีท โดยสามารถเลือกคอลัมน์ที่ต้องการใช้ตรวจสอบข้อมูลซ้ำได้</li><li>2.2 การเติมข้อมูลที่ขาดหายไป (Filling Missing Data)</li><li>เลือกเซลล์ว่าง: Home > Editing > Find & Select > Go To Special > Blanks (หรือกด F5 > Blanks)</li><li>หน้าที่/วิธีใช้: ค้นหาและเลือกเฉพาะเซลล์ที่ไม่มีข้อมูล (ว่างเปล่า) ในช่วงข้อมูลที่เลือกไว้อย่างรวดเร็ว</li><li>เติมข้อมูลลงในเซลล์ว่างแบบระบุค่า: พิมพ์ข้อมูลที่ต้องการ (เช่น เลข 0) แล้วกด Ctrl + Enter</li><li>หน้าที่/วิธีใช้: ใส่ค่าเดียวกันลงในเซลล์ว่างที่ถูกเลือกไว้ทั้งหมดพร้อมกันทันที</li><li>เติมข้อมูลโดยอ้างอิงเซลล์ด้านบน: พิมพ์สูตรอ้างอิง (เช่น =G6) แล้วกด Ctrl + Enter</li><li>หน้าที่/วิธีใช้: คัดลอกค่าจากเซลล์ด้านบนมาเติมลงในเซลล์ว่างแต่ละแถวอย่างต่อเนื่อง</li><li>2.3 การเปลี่ยนประเภทของข้อมูล (Fixing data format)</li><li>แปลงข้อความที่เป็นตัวเลข: Data > Text to Columns</li><li>หน้าที่/วิธีใช้: แก้ไขปัญหาตัวเลขที่ถูกจัดเก็บในรูปแบบของตัวอักษร (Text) ให้กลับมาเป็นรูปแบบตัวเลขที่ถูกต้องสำหรับการคำนวณ</li><li>2.4 การกำจัดตัวอักษรแปลกๆ และแทนที่คำ (Remove/Replace Word)</li><li>ฟังก์ชัน TRIM: =TRIM(เซลล์)</li><li>หน้าที่/วิธีใช้: กำจัดช่องว่างส่วนเกินออก ยกเว้นช่องว่างระหว่างคำ</li><li>ฟังก์ชัน SUBSTITUTE: =SUBSTITUTE(เซลล์, "ข้อความเดิม", "ข้อความใหม่")</li><li>หน้าที่/วิธีใช้: แทนที่ข้อความหรือช่องว่างเดิมด้วยข้อความใหม่ที่ต้องการ</li><li>ฟังก์ชัน CLEAN: =CLEAN(เซลล์)</li><li>หน้าที่/วิธีใช้: กำจัดตัวอักษรพิมพ์ที่ไม่สามารถมองเห็นได้ออกจากข้อความ</li><li>2.5 การเติมข้อมูลตามรูปแบบที่กำหนด (Flash Fill)</li><li>ใช้งาน Flash Fill: พิมพ์รูปแบบตัวอย่างที่ต้องการในเซลล์แรก > เลือกเซลล์ถัดลงมา > Data > Data Tools > Flash Fill</li><li>หน้าที่/วิธีใช้: ให้ Excel ช่วยเติมข้อมูลในคอลัมน์อัตโนมัติโดยแกะรอยตามรูปแบบ (Pattern) ที่เราทำตัวอย่างไว้ให้</li><li>2.6 การรวมและแยกข้อมูลหลายคอลัมน์ (Merging and splitting columns)</li><li>รวมคอลัมน์: ใช้สัญลักษณ์ & หรือฟังก์ชัน CONCATENATE</li><li>หน้าที่/วิธีใช้: เชื่อมข้อความจากหลายคอลัมน์ให้มารวมอยู่ในเซลล์เดียวกัน</li><li>แยกคอลัมน์: Data > Data Tools > Text to Columns</li><li>หน้าที่/วิธีใช้: แยกข้อความในคอลัมน์เดียวออกเป็นหลายคอลัมน์โดยใช้ตัวคั่น (เช่น ลูกน้ำ, แท็บ, ช่องว่าง)</li><li>2.7 การแปลงและเพิ่มข้อมูล (Transforming & Enriching)</li><li>สร้างเงื่อนไขตรวจสอบข้อมูล: ฟังก์ชัน IF เช่น =IF(D6>C6, "YES", "NO")</li><li>หน้าที่/วิธีใช้: ใช้ตรวจสอบเงื่อนไขทางตรรกะ หากเป็นจริงจะแสดงค่าหนึ่ง หากเป็นเท็จจะแสดงอีกค่าหนึ่ง (เช่น ใช้ดูว่าคะแนนหลังเรียนพัฒนาขึ้นหรือไม่)</li><li>2.8 การนำข้อมูลจากอีกแหล่งมาผสม (Reconciling table data)</li><li>ฟังก์ชัน LOOKUP / VLOOKUP / HLOOKUP:</li><li>หน้าที่/วิธีใช้: ค้นหาและดึงข้อมูลจากตารางอื่นหรือช่วงข้อมูลอื่นมาแสดงผล โดย VLOOKUP ใช้ค้นหาในแนวตั้ง และ HLOOKUP ใช้ค้นหาในแนวนอน</li></ul>`,
    updatedAt: '2026-09-05T11:00:00.000Z',
  },
  {
    id: 'unit-03',
    unitNumber: 'Unit 03',
    title: 'ฟังก์ชันตรรกศาสตร์ & การตรวจสอบเงื่อนไข (Logic)',
    description: 'IF ตรวจสอบพัฒนาการคะแนน, IF ซ้อน AVERAGE, Nested IF หลายเงื่อนไข (ตัดเกรด & จำแนกประเภทยานยนต์), SUMIF, COUNTIF',
    order: 3,
    icon: '💡',
    colorTheme: 'amber',
    createdAt: '2026-09-03T09:00:00.000Z',
    studyContent: `<p>สรุปเนื้อหาบทที่ 3 (Formulas, Functions and Lookups) แบบเรียงลำดับขั้นตอนและอธิบายการใช้เครื่องมือ/สูตรตามเนื้อหาในเอกสาร:</p><p>3.1 การสร้างสูตรและการคำนวณเปอร์เซ็นต์ (Understanding Formula and Calculating Percentages)</p><ul><li>การเขียนสูตรคำนวณพื้นฐาน:</li><li>เส้นทางการใช้งาน/วิธีทำ: คลิกเลือกเซลล์ > พิมพ์เครื่องหมาย = (ทุกสูตรต้องขึ้นต้นด้วยเครื่องหมายเท่ากับเสมอ) > ตามด้วยตัวดำเนินการ, การอ้างอิงเซลล์ หรือฟังก์ชัน</li><li>หน้าที่/วิธีใช้: ใช้สำหรับการคำนวณทางคณิตศาสตร์และการประมวลผลข้อมูลในตาราง เช่น =A1+A2, =150*0.05 หรือ =SUM(A1:A12)</li><li>ลำดับความสำคัญของตัวดำเนินการ (Operator Precedence):</li><li>ลำดับการประมวลผล:</li></ul><p>1. ยกกำลัง (^)</p><p>2. คูณ (*) และ หาร (/)</p><p>3. บวก (+) และ ลบ (-)</p><p>4. เชื่อมข้อความ (&)</p><p>5. การเปรียบเทียบเชิงตรรกะ (=, <, >)</p><ul><li>หน้าที่/วิธีใช้: ควบคุมลำดับการคำนวณของ Excel ให้ถูกต้องตามหลักคณิตศาสตร์เมื่อมีเครื่องหมายคำนวณหลายตัวอยู่ในสูตรเดียว</li><li>การอ้างอิงเซลล์ในสูตร (Cell References):</li><li>Relative (สัมพัทธ์): อ้างอิงแบบปกติ เช่น =B4*C4 (ตำแหน่งแถวและคอลัมน์จะเปลี่ยนไปโดยอัตโนมัติเมื่อคัดลอกสูตรไปยังเซลล์อื่น)</li><li>Absolute (สัมบูรณ์): ล็อกตำแหน่งเซลล์ถาวรด้วยเครื่องหมายดอลลาร์ เช่น =\$B\$4*\$C\$4 (ตำแหน่งจะไม่เปลี่ยนเลยแม้จะคัดลอกสูตรไปที่อื่น)</li><li>Mixed (ผสม): ล็อกเพียงบางส่วน เช่น \$B7*C4 (ล็อกเฉพาะคอลัมน์หรือล็อกเฉพาะแถวใดแถวหนึ่ง)</li><li>การใช้ฟังก์ชันสำเร็จรูปแทนสูตรยาวๆ:</li><li>ตัวอย่างฟังก์ชัน:</li><li>=AVERAGE(D3:D9) หาค่าเฉลี่ย</li><li>=SUM(D3:D9) หาผลรวม</li><li>=SQRT(D3) หารากที่สอง</li><li>=MAX(D3:D9) หาค่าสูงสุด</li><li>=MIN(D3:D9) หาค่าต่ำสุด</li><li>=COUNT(D3:D9) นับจำนวนเซลล์ที่มีตัวเลข</li><li>หน้าที่/วิธีใช้: ลดความซับซ้อนในการเขียนสูตรยาวๆ (เช่น แทนที่จะเขียน D3+D4+...) ให้ทำงานได้รวดเร็วขึ้น</li></ul><p>3.2 การวิเคราะห์แบบมีเงื่อนไข (Understanding Conditional Analysis)</p><ul><li>การตรวจสอบเงื่อนไขด้วยฟังก์ชัน IF:</li><li>รูปแบบสูตร: =IF(C3>AVERAGE(C\$3:C\$11), "High", "Low")</li><li>หน้าที่/วิธีใช้: ใช้ตรวจสอบว่าเงื่อนไขเป็นจริงหรือเท็จ หากเป็นจริงจะแสดงผลลัพธ์แบบที่หนึ่ง (เช่น "High") หากเป็นเท็จจะแสดงผลลัพธ์แบบที่สอง (เช่น "Low") และสามารถซ้อนฟังก์ชัน IF หลายชั้น (Nested IF) สำหรับกรณีที่มีหลายเงื่อนไขได้</li><li>การรวมข้อมูลตามเงื่อนไขด้วย SUMIF:</li><li>รูปแบบสูตร: =SUMIF(C3:C12, "<0")</li><li>หน้าที่/วิธีใช้: ใช้รวมผลเฉพาะเซลล์ที่ตรงตามเงื่อนไขที่กำหนดในขอบเขตที่เลือก (เช่น รวมเฉพาะยอดที่เป็นค่าลบ)</li><li>การนับจำนวนตามเงื่อนไขด้วย COUNTIF:</li><li>รูปแบบสูตร: =COUNTIF(D3:D212, G3)</li><li>หน้าที่/วิธีใช้:ใช้นับจำนวนแถวหรือเซลล์ที่ตรงกับเงื่อนไขหรือค่าที่กำหนดไว้ในเซลล์อ้างอิง</li></ul><p>3.3 การใช้สูตรค้นหาข้อมูล (Introducing Lookup Formulas)</p><ul><li>การค้นหาข้อมูลแบบแนวนอนด้วย HLOOKUP (Horizontal Lookup):</li><li>รูปแบบสูตร: =HLOOKUP(Lookup_Value, Table_Array, Row_Index, FALSE)</li><li>หน้าที่/วิธีใช้: ค้นหาค่าใน แถวบนสุด ของตารางตามค่าที่กำหนด (Lookup_Value) แล้วดึงข้อมูลจากแถวที่ระบุ (Row_Index) ในคอลัมน์เดียวกันมาแสดงผล</li><li>การค้นหาข้อมูลแบบแนวตั้งด้วย VLOOKUP (Vertical Lookup):</li><li>รูปแบบสูตร: =VLOOKUP(Lookup_Value, Table_Array, Index_Column_number, FALSE)</li><li>หน้าที่/วิธีใช้: ค้นหาค่าใน คอลัมน์แรกทางซ้ายสุด ของตาราง แล้วดึงข้อมูลจากคอลัมน์อื่นที่ระบุในแถวเดียวกัน โดยกำหนดค่าสุดท้ายเป็น FALSE เพื่อหาข้อมูลที่ตรงกันทุกประการ (Exact Match)</li><li>การค้นหาข้อมูลแบบอิสระด้วย INDEX และ MATCH:</li><li>รูปแบบสูตร: =INDEX(B3:D25, MATCH(G4, C3:C25, FALSE), 1)</li><li>หน้าที่/วิธีใช้: ใช้ทดแทน VLOOKUP เมื่อต้องการความยืดหยุ่นสูงขึ้น (สามารถค้นหาข้อมูลจากคอลัมน์ใดก็ได้ ไม่จำกัดว่าต้องเป็นคอลัมน์ซ้ายสุด) โดยฟังก์ชัน MATCH จะหาตำแหน่งแถว และฟังก์ชัน INDEX จะดึงค่าจากตำแหน่งนั้น</li><li>โครงสร้างสูตร XLOOKUP พื้นฐาน: =XLOOKUP(lookup, lookup_array, return_array, [not_found], [match_mode], [search_mode]) ซึ่งเป็นฟังก์ชันสมัยใหม่ที่ใช้แทน VLOOKUP, HLOOKUP และ LOOKUP โดยรองรับการค้นหาทั้งแบบแนวตั้งและแนวนอน รวมถึงการจับคู่แบบแม่นยำและแบบใกล้เคียง</li><li>ส่วนประกอบของสูตร (Syntax components):</li><li>lookup: ค่าหรือข้อมูลที่ต้องการค้นหา</li><li>lookup_array: ช่วงเซลล์หรือพื้นที่ที่ใช้ในการค้นหาข้อมูล</li><li>return_array: ช่วงเซลล์หรือพื้นที่ที่ต้องการดึงค่าผลลัพธ์กลับมา</li><li>[not_found]: ค่าที่จะให้แสดงผลลัพธ์หากไม่พบข้อมูลที่ค้นหา (เช่น "Not found")</li><li>[match_mode]: กำหนดรูปแบบการจับคู่ข้อมูล</li><li>[search_mode]: กำหนดรูปแบบและทิศทางการค้นหาข้อมูล</li><li>ตัวอย่างรูปแบบการใช้งานจริง:</li><li>การคืนค่าเดี่ยว (Return single value): =XLOOKUP(H4, A2:A24, C2:C24, "Not found") ใช้ค้นหาค่าจากเซลล์ H4 ในช่วง A2:A24 แล้วดึงข้อมูลจากช่วง C2:C24 พร้อมแสดงข้อความ "Not found" หากไม่พบข้อมูล</li><li>การคืนค่าหลายค่า (Return multiple value): =XLOOKUP(F3, C2:C24, A2:B24) ใช้ค้นหาค่าจากเซลล์ F3 ในช่วง C2:C24 และดึงข้อมูลผลลัพธ์จากหลายคอลัมน์พร้อมกันในช่วง A2:B24</li></ul>`,
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
  {
    id: 'unit-04',
    unitNumber: 'Unit 04',
    title: 'ฟังก์ชันค้นหาและจับคู่ข้อมูล (Lookup & Reference)',
    description: 'LOOKUP (Vector), VLOOKUP (Exact Match), HLOOKUP (แนวนอน), INDEX & MATCH (ค้นหาจากขวาไปซ้าย), XLOOKUP (คืนค่าเดี่ยว & หลายค่า)',
    order: 4,
    icon: '🔍',
    colorTheme: 'purple',
    createdAt: '2026-09-04T09:00:00.000Z',
    studyContent: `<p>นี่คือสรุปขั้นตอนการใช้งานเครื่องมือและสูตรทั้งหมดจากเอกสารแบบ step-by-step เรียงตามลำดับหน้า พร้อมบอกหน้าที่และวิธีทำแบบกระชับครับ:</p><p>ส่วนที่ 1: Conditional Formatting (การจัดรูปแบบตามเงื่อนไข)</p><ul><li>การใช้ Highlight Cells Rules (เน้นเซลล์ตามเงื่อนไขค่าหรือข้อความ):</li><li>Home Ribbon > Conditional Formatting > Highlight Cells Rules > เลือกเงื่อนไข (เช่น Greater Than, Less Than, Between, Equal To, Text that Contains, Duplicate Values)</li><li>หน้าที่: ใช้เน้นข้อมูลที่สนใจหรือค่าที่โดดเด่น เช่น ค่าที่มากกว่าที่กำหนด หรือข้อมูลที่ซ้ำกัน</li><li>การใช้ Top/Bottom Rules (เน้นค่าสูงสุด/ต่ำสุดหรือค่าเฉลี่ย):</li><li>Home Ribbon > Conditional Formatting > Top/Bottom Rules > เลือกเงื่อนไข (เช่น Top 10 Items, Top 10%, Bottom 10 Items, Above Average)</li><li>หน้าที่: กรองและเน้นกลุ่มข้อมูลระดับบนหรือล่างสุด รวมถึงข้อมูลที่อยู่เหนือหรือต่ำกว่าค่าเฉลี่ย</li><li>การใช้ Data Bars, Color Scales, และ Icon Sets (สร้าง Visual Effects):</li><li>Home Ribbon > Conditional Formatting > เลือก Data Bars / Color Scales / Icon Sets</li><li>หน้าที่: แสดงผลเปรียบเทียบค่าข้อมูลในตารางด้วยแท่งกราฟสี สเกลสี หรือไอคอนสัญลักษณ์</li><li>การจัดการกฎ (Manage Rules):</li><li>Home Ribbon > Conditional Formatting > Manage Rules > เลือกกฎที่ต้องการ > คลิก Delete Rule</li><li>หน้าที่: ใช้ตรวจสอบ แก้ไข หรือลบกฎการจัดรูปแบบเฉพาะบางตัวออก</li><li>การล้างกฎทั้งหมด (Clear Rules):</li><li>Home Ribbon > Conditional Formatting > Clear Rules > เลือกขอบเขตที่ต้องการล้าง (เช่น Clear Rules from Selected Cells / Entire Sheet / This Table)</li><li>หน้าที่: ยกเลิกและล้างค่าการจัดรูปแบบตามเงื่อนไขทั้งหมดออกจากพื้นที่ที่เลือก</li></ul><p>ส่วนที่ 2: Excel Tables (การจัดการตาราง)</p><ul><li>การสร้าง Excel Table:</li><li>เลือกช่วงข้อมูล > Insert Ribbon > Table > ตรวจสอบช่วงข้อมูลในหน้าต่าง Create Table > คลิก OK</li><li>หน้าที่: แปลงช่วงข้อมูลธรรมดาให้เป็นตารางสำเร็จรูป ขอบเขตขยาย/หดอัตโนมัติ มีปุ่มกรองและจัดรูปแบบสวยงาม</li><li>การยกเลิกตาราง (Convert to Range):</li><li>คลิกเลือกตาราง > Table Tools > Design > Convert to Range</li><li>หน้าที่: แปลงตารางกลับเป็นช่วงข้อมูลปกติ (ยกเลิกฟีเจอร์ Table แต่ยังคงรูปแบบและสูตรเดิมไว้)</li><li>การปรับขนาดตาราง (Resize Table):</li><li>คลิกค้างที่มุมขวาล่างสุดของตาราง แล้วลากเมาส์เพิ่มหรือลดขนาดพื้นที่ข้อมูล</li><li>หน้าที่: ปรับขอบเขตตารางด้วยตนเอง</li><li>การปรับรูปแบบและองค์ประกอบตาราง (Table Styles & Options):</li><li>คลิกเลือกตาราง > Table Tools > Design > เลือกสไตล์ใน Table Styles</li><li>ติ๊กเลือกตัวเลือกใน Table Style Options:</li><li>Header Row (แสดง/ซ่อนแถวหัวตาราง)</li><li>Total Row (แสดงแถหายอดรวม/สรุปผลด้านล่าง สามารถเลือกสูตรคำนวณ เช่น Sum, Average ได้)</li><li>Banded Rows / Banded Columns (สลับสีแถวหรือคอลัมน์ให้อ่านง่าย)</li><li>First Column / Last Column (เน้นคอลัมน์แรกหรือคอลัมน์สุดท้าย)</li><li>Filter Button (เปิด/ปิดปุ่มลูกศรกรองข้อมูลที่หัวตาราง)</li><li>การเรียงลำดับข้อมูล (Sorting):</li><li>คลิกปุ่ม Filter ที่หัวคอลัมน์ > เลือก Sort A to Z หรือ Sort Z to A</li><li>เรียงหลายคอลัมน์พร้อมกัน: คลิกปุ่ม Filter > Sort by Color > Custom Sort > กำหนดระดับ (Sort by / Then by) > คลิก OK (หากต้องการยกเลิกให้กด Delete Level)</li><li>หน้าที่: จัดลำดับข้อมูลจากน้อยไปมาก/มากไปน้อย หรือเรียงซ้อนหลายเงื่อนไข</li><li>การกรองข้อมูล (Filtering):</li><li>คลิกปุ่ม Filter ที่หัวคอลัมน์ > เลือกติ๊กถูกข้อมูลที่ต้องการแสดง (หรือใช้ Text Filters / Number Filters เพื่อใส่เงื่อนไขเฉพาะ)</li><li>ยกเลิกตัวกรอง: คลิกปุ่ม Filter > เลือก Clear Filter From [ColumnName]</li><li>หน้าที่: คัดแสดงเฉพาะข้อมูลที่ตรงตามเงื่อนไขที่ต้องการ</li><li>การสร้างสูตรคำนวณในตาราง:</li><li>พิมพ์สูตรลงในเซลล์ใดก็ได้ของคอลัมน์ใหม่ในตาราง (เช่น =H3*10%) แล้วกด Enter</li><li>หน้าที่: Excel จะทำการคัดลอกสูตรและคำนวณให้ทุกเซลล์ในคอลัมน์นั้นโดยอัตโนมัติทันที</li></ul>`,
    updatedAt: '2026-09-05T13:00:00.000Z',
  },
  {
    id: 'unit-05',
    unitNumber: 'Unit 05',
    title: 'การจัดการตาราง & Conditional Formatting',
    description: 'การสร้าง Excel Tables (Ctrl+T), สูตรคำนวณอัตโนมัติในตาราง (=H3*10%), Total Row (SUBTOTAL), Highlight Cells, Data Bars',
    order: 5,
    icon: '📊',
    colorTheme: 'blue',
    createdAt: '2026-09-05T09:00:00.000Z',
    studyContent: `<p>จากเอกสารเกี่ยวกับ Pivot Table และ Pivot Chart ขอสรุปวิธีใช้งานเครื่องมือแบบ step-by-step เรียงตามลำดับคำสั่ง พร้อมหน้าที่การใช้งานสั้นๆ ดังนี้ครับ:</p><p>1. การสร้าง Pivot Table (สร้างรายงานสรุปผลข้อมูลหลายมิติ)</p><ul><li>Insert > PivotTable</li><li>วิธีใช้/หน้าที่: ใช้สำหรับเปิดหน้าต่างสร้างรายงานสรุปผล โดยต้องระบุช่วงตารางข้อมูลต้นทาง (Table/Range) และเลือกตำแหน่งที่จะแสดงผลรายงาน (New Worksheet หรือ Existing Worksheet)</li><li>การจัดการ Fields ใน PivotTable Fields (ลากวางข้อมูลในกล่อง 4 ส่วน):</li><li>FILTERS: กรองข้อมูลเฉพาะกลุ่มที่ต้องการแสดงผล (เช่น เลือกดูเฉพาะประเทศ)</li><li>ROWS: กำหนดหัวข้อข้อมูลให้อยู่ในแนวแถว (Row Labels)</li><li>COLUMNS: กำหนดหัวข้อข้อมูลให้อยู่ในแนวคอลัมน์ (Column Labels)</li><li>VALUES: คำนวณค่าผลสรุปตัวเลขด้วยฟังก์ชันต่างๆ เช่น Sum, Count, Average</li></ul><p>2. การสร้าง Pivot Chart (การนำเสนอข้อมูลในรูปแบบแผนภูมิ/กราฟ)</p><ul><li>วิธีที่ 1: สร้างจาก PivotTable ที่มีอยู่แล้ว</li><li>คลิกเลือกเซลล์ใน PivotTable > PivotTable Analyze > Tools > PivotChart</li><li>วิธีใช้/หน้าที่: ใช้เลือกรูปแบบกราฟที่ต้องการ (เช่น Clustered Column) เพื่อแปลงข้อมูลจากตารางสรุปให้อยู่ในรูปแผนภูมิ</li><li>วิธีที่ 2: สร้างโดยตรงจากตารางข้อมูล (Table)</li><li>คลิกเซลล์ในตารางข้อมูล > Insert > PivotChart > กด OK</li><li>วิธีใช้/หน้าที่: สร้างกราฟพร้อมเลือกฟิลด์ใส่ลงในกล่อง (Filters, Legend, Axis, Values) เพื่อแสดงผลข้อมูลทันที</li></ul><p>3. การปรับแต่งและจัดการ Pivot Chart</p><ul><li>Chart Design > Switch Row/Column</li><li>วิธีใช้/หน้าที่: สลับมุมมองข้อมูลระหว่างแถวและคอลัมน์บนกราฟและตารางที่เชื่อมโยงกัน</li><li>Chart Design > Change Chart Type</li><li>วิธีใช้/หน้าที่: เปลี่ยนประเภทของแผนภูมิ (เช่น เปลี่ยนจากแท่ง Column เป็น Stacked Area หรือ Line)</li><li>Chart Design > Add Chart Element</li><li>วิธีใช้/หน้าที่: เพิ่มหรือปรับแต่งองค์ประกอบต่างๆ ของกราฟ เช่น ชื่อแผนภูมิ (Chart Title), ข้อมูลในตาราง (Data Table), หรือป้ายชื่อข้อมูล</li><li>Chart Tools > Format</li><li>วิธีใช้/หน้าที่: ปรับแต่งรูปแบบการแสดงผล สีสัน หรือสไตล์ของรูปร่างและข้อความในแผนภูมิ</li></ul><p>The current local time is: 2026-09-05T22:38:19+07:00.</p><p></ADDITIONAL_METADATA></p><p><USER_SETTINGS_CHANGE></p><p>The user changed setting 'Model Selection' from Gemini 3.8 Flash (High) to Gemini 3.1 Pro (High). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.</p><p></USER_SETTINGS_CHANGE></p>`,
    updatedAt: '2026-09-05T14:00:00.000Z',
  },
  {
    id: 'unit-06',
    unitNumber: 'Unit 06',
    title: 'PivotTable & PivotChart สำหรับวิเคราะห์ข้อมูล',
    description: 'โครงสร้าง 4 กล่อง (Filters, Columns, Rows, Values), การสร้าง PivotChart 2 วิธี, Switch Row/Column, Change Chart Type',
    order: 6,
    icon: '📈',
    colorTheme: 'emerald',
    createdAt: '2026-09-05T09:30:00.000Z',
    updatedAt: '2026-09-05T15:00:00.000Z',
  },
];

// รายการสูตรและคำสั่งครบถ้วนตามสไลด์ DX201 และเอกสารสรุป
export const COURSE_FORMULAS: Formula[] = [
  // ================= UNIT 01 =================
  {
    id: 'f-u1-percentage',
    unitId: 'unit-01',
    name: 'การคำนวณร้อยละ & ยอดขายคาดการณ์',
    shortDescription: 'คำนวณยอดขายที่เติบโตขึ้นตามอัตราส่วนเปอร์เซ็นต์',
    formula: '=B2*103.5%',
    purpose: 'ใช้คำนวณยอดขายที่คาดการณ์ของเดือนถัดไป (Projected Sales) โดยเพิ่มขึ้น 3.5% จากยอดเดิมของเดือนก่อนหน้า (B2)',
    syntax: '=เซลล์อ้างอิง * (100% + อัตราส่วนที่เพิ่มขึ้น)',
    example: '=B2*103.5% (เมื่อ B2 คือ 50000 จะได้ 51750 ในเดือนกุมภาพันธ์)',
    teacherNote: '📌 ผศ.ดร. อัจฉรา ย้ำ: = คือเริ่มต้นสูตร, B2 อ้างอิงยอดขายตั้งต้น, * คือคูณ, 103.5% คืออัตราที่เพิ่มขึ้น จากนั้นใช้ Fill Handle ลากลงมาจนถึง B13 ได้เลย',
    importance: 'important',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-01T09:10:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'f-u1-relative',
    unitId: 'unit-01',
    name: 'การอ้างอิงเซลล์แบบสัมพัทธ์ (Relative Reference)',
    shortDescription: 'ตำแหน่งแถวและคอลัมน์จะเลื่อนเปลี่ยนอัตโนมัติตามการคัดลอก',
    formula: '=B4*C4',
    purpose: 'การอ้างอิงเซลล์ค่าเริ่มต้นของ Excel ตำแหน่งจะเปลี่ยนไปตามทิศทางที่ลากสูตร เหมาะกับการคิดยอดทีละแถว',
    syntax: '=คอลัมน์แถว * คอลัมน์แถว',
    example: '=B5*C5 (เมื่อลากลงมา 1 แถว สูตรจะปรับเลขแถวจาก 4 เป็น 5 ให้อัตโนมัติ)',
    teacherNote: '📌 ค่าเริ่มต้นของ Excel ทุกสูตรจะเป็น Relative Reference เสมอ หากต้องการล็อกตำแหน่งต้องใส่เครื่องหมาย $ เพิ่ม',
    importance: 'normal',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-01T09:20:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'f-u1-absolute',
    unitId: 'unit-01',
    name: 'การอ้างอิงเซลล์แบบสัมบูรณ์ (Absolute Reference $)',
    shortDescription: 'ล็อกตำแหน่งเซลล์ถาวรไม่ให้เลื่อนเมื่อคัดลอกสูตรด้วย $',
    formula: '=$B$4*$C$4',
    purpose: 'ล็อกทั้งคอลัมน์และแถวให้อยู่กับที่ ไม่ว่าจะคัดลอกสูตรไปที่ใด ตำแหน่งเซลล์ที่ใส่ $ จะคงเดิมเสมอ',
    syntax: '=$คอลัมน์$แถว',
    example: '=B5*$B$7 (เมื่อ $B$7 เป็นอัตราภาษี Tax Rate หรือค่าคอมมิชชันคงที่)',
    teacherNote: '⭐ ออกสอบ 100%! ใช้เครื่องหมายดอลลาร์สองตัว เช่น $A$5 หรือ $B$7 กดปุ่ม F4 บนคีย์บอร์ดเพื่อใส่ $ อัตโนมัติ ป้องกันสูตรเพี้ยนเวลาลาก AutoFill',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-01T09:30:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'f-u1-mixed',
    unitId: 'unit-01',
    name: 'การอ้างอิงเซลล์แบบผสม (Mixed Reference)',
    shortDescription: 'ล็อกเฉพาะคอลัมน์หรือล็อกเฉพาะแถวอย่างใดอย่างหนึ่ง',
    formula: '=$B$7*C4',
    purpose: 'ล็อกเฉพาะส่วน เช่น ล็อกคอลัมน์ ($B4) เมื่อลากไปทางขวาคอลัมน์จะไม่เปลี่ยน หรือล็อกแถว (B$4) เมื่อลากลงมาแถวจะไม่เปลี่ยน',
    syntax: '=$คอลัมน์แถว (ล็อกคอลัมน์) หรือ =คอลัมน์$แถว (ล็อกแถว)',
    example: '=$A2*B$1 (เมื่อต้องการคูณค่าระหว่างหัวแถว A กับหัวคอลัมน์ 1 ในตาราง Matrix)',
    teacherNote: '⭐ ข้อสอบชอบออก: $ นำหน้าตัวอักษร = ล็อกคอลัมน์ ($A4), $ นำหน้าตัวเลข = ล็อกแถว (A$4) ให้สังเกตตำแหน่งของ $ ให้ดี',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-01T09:40:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'f-u1-sheet-ref',
    unitId: 'unit-01',
    name: 'การอ้างอิงเซลล์ข้ามชีท (Cross-Worksheet Reference)',
    shortDescription: 'ดึงข้อมูลหรือคำนวณจากอีก Worksheet หนึ่งในไฟล์เดียวกัน',
    formula: '=B4*Sheet4!B2',
    purpose: 'ใช้คำนวณโดยอ้างอิงค่าจากอีกแผ่นงานหนึ่ง โดยใช้ชื่อแผ่นงานตามด้วยเครื่องหมายอัศเจรีย์ (!)',
    syntax: '=ชื่อชีท!เซลล์อ้างอิง',
    example: '=B5*Sheet4!B3 หรือ =SUM(\'Q1 Sales\'!C2:C10)',
    teacherNote: '📌 หากชื่อ Sheet มีการเว้นวรรค เช่น "Sales Data" ต้องใส่เครื่องหมาย Single Quote ครอบชื่อชีทด้วย เช่น =\'Sales Data\'!B2',
    importance: 'normal',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-01T09:50:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'f-u1-precedence',
    unitId: 'unit-01',
    name: 'ลำดับความสำคัญของเครื่องหมาย (Operator Precedence)',
    shortDescription: 'การใส่วงเล็บควบคุมลำดับการคำนวณทางคณิตศาสตร์',
    formula: '=(C3/D3)/100',
    purpose: 'Excel จะคำนวณตามลำดับ: 1) ยกกำลัง ^, 2) คูณ * และ หาร /, 3) บวก + และ ลบ -, 4) เชื่อมข้อความ &, 5) เปรียบเทียบ (=, <, >)',
    syntax: '=(พจน์ที่ต้องทำก่อน) / พจน์ถัดไป',
    example: '=(C4/D4)/100 ได้ผลลัพธ์เป็น 0.0055 แต่ถ้าไม่ใส่วงเล็บ =C4-D4*100 จะกลายเป็น -19890',
    teacherNote: '⭐ ในสไลด์ 3.1 หน้า 4-5 อาจารย์ยกตัวอย่างตารางเปรียบเทียบชัดเจน: หากมีทั้งการคูณและการบวก Excel จะทำคูณก่อนเสมอ ถ้าต้องการบวกก่อนต้องใส่วงเล็บครอบ!',
    importance: 'important',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'f-u1-stat-basics',
    unitId: 'unit-01',
    name: 'ฟังก์ชันพื้นฐาน: AVERAGE, SUM, SQRT, MAX, MIN, COUNT',
    shortDescription: 'ชุดฟังก์ชันคำนวณและสรุปข้อมูลสถิติที่ใช้บ่อยที่สุด',
    formula: '=AVERAGE(D3:D9)',
    purpose: 'ใช้คำนวณค่าเฉลี่ยแทนการเขียนบวกทีละเซลล์ เช่น =D3+D4+D5+D6+D7+D8+D9 ให้เขียนเป็น =AVERAGE(D3:D9)',
    syntax: '=AVERAGE(ช่วงเซลล์), =SUM(ช่วงเซลล์), =SQRT(ตัวเลข), =MAX(ช่วงเซลล์), =MIN(ช่วงเซลล์), =COUNT(ช่วงเซลล์)',
    example: '=SUM(D3:D9) หาผลรวม, =SQRT(D3) ถอดรากที่สอง, =COUNT(D3:D9) นับจำนวนเซลล์ตัวเลข',
    teacherNote: '📌 สไลด์ 3.1 หน้า 6-7: การใช้ฟังก์ชันในตัวช่วยลดความผิดพลาดและพิมพ์ได้เร็วกว่าการกดบวกทีละตัวมาก',
    importance: 'normal',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-01T10:15:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'f-u1-freeze-panes',
    unitId: 'unit-01',
    name: 'การตรึงแนวตาราง (Freeze Panes)',
    shortDescription: 'ล็อกหัวตารางหรือคอลัมน์ให้มองเห็นค้างไว้ขณะเลื่อนหน้าจอ',
    formula: 'View > Freeze Panes',
    purpose: 'ล็อกแถวชื่อคอลัมน์ด้านบนไว้ ไม่ให้เลื่อนหายไปเมื่อเลื่อนดูข้อมูลแถวล่าง ๆ ที่มีปริมาณมาก',
    syntax: 'คลิกเซลล์ที่อยู่ "ใต้แถว" และ "ขวาของคอลัมน์" ที่ต้องการตรึง > ไปที่แท็บ View > Freeze Panes',
    example: 'หากต้องการล็อกแถวที่ 1 (หัวตาราง) ให้คลิกเซลล์ A2 หรือเลือก Freeze Top Row ได้ทันที',
    teacherNote: '📌 สไลด์ 1.3 หน้า 24: จุดสำคัญคือต้องวางเคอร์เซอร์ที่เซลล์ด้านล่างของแถวที่ต้องการตรึง เช่น อยากล็อกแถว 1-2 ให้คลิกเซลล์ที่แถว 3',
    importance: 'important',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-01T10:30:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },

  // ================= UNIT 02 =================
  {
    id: 'f-u2-duplicate',
    unitId: 'unit-02',
    name: 'การไฮไลต์และลบข้อมูลซ้ำ (Duplicate Handling)',
    shortDescription: 'ค้นหาและตัดแถวข้อมูลที่มีค่าซ้ำกันออกจากชีท',
    formula: 'Data > Remove Duplicates',
    purpose: 'ตรวจสอบข้อมูลซ้ำด้วยสี และลบแถวที่ซ้ำซ้อนออก เพื่อให้ชุดข้อมูลมีความสมบูรณ์ถูกต้อง (Data Integrity)',
    syntax: 'ไฮไลต์: Home > Conditional Formatting > Highlight Cells Rules > Duplicate Values / ลบ: Data > Remove Duplicates',
    example: 'เลือกคอลัมน์ UserID และ Pre-Test เพื่อตรวจสอบและลบแถวที่ส่งแบบทดสอบซ้ำ',
    teacherNote: '⭐ ทริกจากสไลด์ 2.1 หน้า 2-3 ของ อ.อัจฉรา: กดปุ่มลัด Ctrl + Shift + ↓ เพื่อเลือกช่วงข้อมูลลงมาจนสุดคอลัมน์ได้อย่างรวดเร็ว!',
    importance: 'important',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-02T09:10:00.000Z',
    updatedAt: '2026-09-05T11:00:00.000Z',
  },
  {
    id: 'f-u2-goto-blanks',
    unitId: 'unit-02',
    name: 'การเลือกเซลล์ว่างทั้งหมด (Go To Special Blanks)',
    shortDescription: 'ค้นหาและเลือกเฉพาะเซลล์ที่ไม่มีข้อมูลพร้อมกันในพริบตา',
    formula: 'F5 > Special > Blanks',
    purpose: 'ใช้เลือกเซลล์ว่างทั้งหมดในตาราง เพื่อเตรียมเติมค่า 0 หรือใส่สูตรดึงค่าต่อเนื่อง',
    syntax: 'Home > Find & Select > Go To Special > เลือก Blanks (หรือกดปุ่ม F5 บนคีย์บอร์ด)',
    example: 'เลือกช่วงคะแนนที่มีช่องว่าง > กด F5 > เลือก Blanks > เซลล์ว่างทุกช่องจะถูกไฮไลต์พร้อมกัน',
    teacherNote: '⭐ ออกสอบปฏิบัติบ่อยมาก! เมื่อเลือกเซลล์ว่างแล้ว "ห้ามคลิกเมาส์ที่อื่น" ให้พิมพ์ข้อมูลที่ต้องการลงไปทันที แล้วกด Ctrl + Enter',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-02T09:20:00.000Z',
    updatedAt: '2026-09-05T11:00:00.000Z',
  },
  {
    id: 'f-u2-fill-upper',
    unitId: 'unit-02',
    name: 'การเติมค่าอ้างอิงเซลล์บนด้วย Ctrl + Enter (=G6)',
    shortDescription: 'คัดลอกข้อมูลจากเซลล์ด้านบนลงมาเติมในเซลล์ว่างต่อเนื่อง',
    formula: '=G6',
    purpose: 'แก้ปัญหาตารางที่ Unmerge เซลล์แล้วมีช่องว่าง ให้ดึงข้อมูลชื่อหรือแผนกจากบรรทัดด้านบนลงมาเติมเต็มทุกแถว',
    syntax: 'เลือกเซลล์ว่างด้วย F5 > พิมพ์ = ตามด้วยตำแหน่งเซลล์บน เช่น =G6 > กด Ctrl + Enter',
    example: 'ในเซลล์ G7 ที่เป็นช่องว่าง พิมพ์ =G6 แล้วกด Ctrl + Enter ข้อมูลจะถูกดึงลงมาเติมใน G7, G8, G9 ทันที',
    teacherNote: '⭐ เทคนิคไฮไลต์ประจำบทที่ 2 (สไลด์หน้า 6): ต้องกด Ctrl + Enter เท่านั้น! หากกด Enter ธรรมดาจะติดแค่เซลล์เดียว',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-02T09:30:00.000Z',
    updatedAt: '2026-09-05T11:00:00.000Z',
  },
  {
    id: 'f-u2-text-to-columns',
    unitId: 'unit-02',
    name: 'การแปลงข้อความเป็นตัวเลข (Fix Data Format)',
    shortDescription: 'แก้ไขตัวเลขที่ถูกเก็บเป็น Text ให้กลับมาคำนวณสถิติได้',
    formula: 'Data > Text to Columns',
    purpose: 'แก้ไขปัญหาตัวเลขที่มีสัญลักษณ์สามเหลี่ยมสีเขียวเตือน "Number Stored as Text" ซึ่งทำให้สูตร AVERAGE หรือ SUM ขึ้น Error #DIV/0!',
    syntax: 'เลือกคอลัมน์ข้อมูล > ไปที่ Data > Text to Columns > กดปุ่ม Finish ได้ทันที',
    example: 'แปลงตัวเลขในคอลัมน์ Pre-Test ที่ติดรูปแบบ Text ให้กลับมาเป็นตัวเลขจริงเพื่อคำนวณค่าเฉลี่ย',
    teacherNote: '📌 สไลด์ 2.3 หน้า 7: หากตัวเลขถูกเก็บเป็นข้อความ จะไม่สามารถนำไปคำนวณได้ ต้องใช้ Text to Columns แปลงกลับเป็นตัวเลขก่อน',
    importance: 'important',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-02T09:40:00.000Z',
    updatedAt: '2026-09-05T11:00:00.000Z',
  },
  {
    id: 'f-u2-trim',
    unitId: 'unit-02',
    name: 'TRIM: ตัดช่องว่างส่วนเกิน',
    shortDescription: 'ลบ Spacebar ที่อยู่หน้า-หลังข้อความออก เหลือแค่ 1 เคาะระหว่างคำ',
    formula: '=TRIM(A2)',
    purpose: 'ทำความสะอาดข้อความ เพื่อไม่ให้เว้นวรรคส่วนเกินส่งผลให้สูตร VLOOKUP หรือการเปรียบเทียบข้อความค้นหาไม่เจอ',
    syntax: '=TRIM(ข้อความหรือเซลล์)',
    example: '=TRIM(A10) (ถ้าในเซลล์ A10 มีข้อความ "  5788 305  " จะถูกปรับเป็น "5788 305")',
    teacherNote: '📌 TRIM จะตัดช่องว่างที่อยู่หน้าสุดและท้ายสุดทิ้งทั้งหมด แต่ช่องว่างเดี่ยวระหว่างคำตรงกลางจะยังคงไว้ 1 เคาะ',
    importance: 'important',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-02T09:50:00.000Z',
    updatedAt: '2026-09-05T11:00:00.000Z',
  },
  {
    id: 'f-u2-substitute',
    unitId: 'unit-02',
    name: 'SUBSTITUTE: แทนที่คำหรือข้อความ',
    shortDescription: 'แทนที่คำหรือเว้นวรรคเดิมด้วยข้อความใหม่ที่กำหนด',
    formula: '=SUBSTITUTE(A9, " ", "")',
    purpose: 'ใช้ลบเว้นวรรคทั้งหมดในเซลล์ออก หรือเปลี่ยนเครื่องหมาย เช่น ลบช่องว่างในรหัสนักศึกษาออกให้ชิดติดกัน',
    syntax: '=SUBSTITUTE(text, old_text, new_text, [instance_num])',
    example: '=SUBSTITUTE(A9, " ", "") (แทนที่ spacebar ด้วยความว่างเปล่า เพื่อให้รหัสกลายเป็นตัวเลขติดกัน)',
    teacherNote: '📌 ต่างจาก REPLACE ตรงที่ SUBSTITUTE สามารถระบุคำที่ต้องการแทนที่ได้โดยตรง ไม่ต้องนับตำแหน่งตัวอักษร',
    importance: 'important',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-02T10:00:00.000Z',
    updatedAt: '2026-09-05T11:00:00.000Z',
  },
  {
    id: 'f-u2-clean',
    unitId: 'unit-02',
    name: 'CLEAN: กำจัดอักขระที่มองไม่เห็น',
    shortDescription: 'ลบตัวอักษรพิเศษที่ไม่สามารถพิมพ์หรือมองไม่เห็น (Non-printable)',
    formula: '=CLEAN(A9)',
    purpose: 'ลบอักขระควบคุม (ASCII 0-31) เช่น การขึ้นบรรทัดใหม่ที่แอบซ่อนอยู่จากการ Export ข้อมูลจากระบบอื่น',
    syntax: '=CLEAN(ข้อความหรือเซลล์)',
    example: '=CLEAN(A11)',
    teacherNote: '📌 มักนำมาซ้อนกับ SUBSTITUTE เพื่อทำความสะอาดข้อมูลที่มองไม่เห็นด้วยตาเปล่า',
    importance: 'normal',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-02T10:10:00.000Z',
    updatedAt: '2026-09-05T11:00:00.000Z',
  },
  {
    id: 'f-u2-clean-substitute',
    unitId: 'unit-02',
    name: 'สูตรผสมคลีนรหัส: CLEAN + SUBSTITUTE',
    shortDescription: 'สูตรผสมขั้นสูงสำหรับลบทั้งเว้นวรรคและอักขระซ่อนเร้น',
    formula: '=CLEAN(SUBSTITUTE(A9, " ", ""))',
    purpose: 'ใช้คลีนรหัสนักศึกษาหรือเบอร์โทรศัพท์ให้มีจำนวนตัวอักษรถูกต้องสมบูรณ์ (Final Length เท่ากันทุกแถว)',
    syntax: '=CLEAN(SUBSTITUTE(cell, " ", ""))',
    example: '=CLEAN(SUBSTITUTE(A11, " ", "")) (แปลงรหัส "5688036 " ที่เดิมมี 12 ตัวอักษรให้เหลือ 7 ตัวอักษรพอดี)',
    teacherNote: '⭐ ในสไลด์บทที่ 2 หน้า 8 อาจารย์มีตารางเปรียบเทียบ LEN อย่างละเอียด สูตรผสมนี้ช่วยแก้ปัญหาความยาวตัวอักษรไม่เท่ากันได้ 100%',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-02T10:20:00.000Z',
    updatedAt: '2026-09-05T11:00:00.000Z',
  },
  {
    id: 'f-u2-flashfill',
    unitId: 'unit-02',
    name: 'Flash Fill (เติมข้อมูลตามรูปแบบ Pattern)',
    shortDescription: 'เติมข้อมูลอัตโนมัติโดยระบบจะแกะรอยตามตัวอย่างที่พิมพ์ไว้',
    formula: 'Ctrl + E (Data > Flash Fill)',
    purpose: 'ใช้จัดรูปแบบข้อความ เช่น ปรับเบอร์โทรศัพท์ 0-2751-0951 ให้เป็น 02 751 0951 หรือแยกชื่อ-นามสกุล โดยไม่ต้องเขียนสูตร',
    syntax: 'พิมพ์ตัวอย่างที่ต้องการในแถวแรก > คลิกเซลล์ถัดไปด้านล่าง > กดปุ่มลัด Ctrl + E หรือไปที่ Data > Flash Fill',
    example: 'พิมพ์ "02 751 0951" ในเซลล์แรก แล้วกด Ctrl + E เบอร์โทรในแถวที่เหลือจะเปลี่ยนรูปแบบตามทันที',
    teacherNote: '📌 สไลด์ 2.5 หน้า 9: รวดเร็วมากสำหรับงานจัด Format ข้อความในชีวิตประจำวัน',
    importance: 'important',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-02T10:30:00.000Z',
    updatedAt: '2026-09-05T11:00:00.000Z',
  },
  {
    id: 'f-u2-merge-split',
    unitId: 'unit-02',
    name: 'การรวมและแยกคอลัมน์ (& / CONCATENATE / Text to Columns)',
    shortDescription: 'รวมข้อความด้วยเครื่องหมาย & และแยกคอลัมน์ด้วยตัวคั่น',
    formula: '=A2 & " " & B2',
    purpose: 'รวม: ใช้เครื่องหมาย & หรือฟังก์ชัน CONCATENATE เชื่อมข้อความ / แยก: ใช้ Data > Text to Columns เพื่อแยกข้อมูลด้วยตัวคั่น',
    syntax: 'รวม: =เซลล์1 & "ตัวคั่น" & เซลล์2 / แยก: Data > Text to Columns > Delimited',
    example: '=FirstName & " " & LastName หรือแยกคอลัมน์ชื่อเต็มด้วยช่องว่าง (Space)',
    teacherNote: '📌 สไลด์ 2.6 หน้า 10: ในการแยกข้อความ ให้เลือกประเภท Delimited แล้วติ๊กเลือกเครื่องหมายที่ใช้คั่น เช่น Comma, Space, Semicolon',
    importance: 'normal',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-02T10:40:00.000Z',
    updatedAt: '2026-09-05T11:00:00.000Z',
  },

  // ================= UNIT 03 =================
  {
    id: 'f-u3-if-single',
    unitId: 'unit-03',
    name: 'IF: ตรวจสอบเงื่อนไขเดี่ยว (เปรียบเทียบคะแนน Pre/Post)',
    shortDescription: 'ตรวจสอบเงื่อนไขทางตรรกะ จริงแสดงค่าหนึ่ง เท็จแสดงอีกค่าหนึ่ง',
    formula: '=IF(D6>C6, "YES", "NO")',
    purpose: 'ใช้เปรียบเทียบว่าคะแนนหลังเรียน (Post-Test ใน D6) มากกว่าก่อนเรียน (Pre-Test ใน C6) หรือไม่ ถ้าพัฒนาขึ้นแสดง "YES" ถ้าไม่แสดง "NO"',
    syntax: '=IF(เงื่อนไขเปรียบเทียบ, ค่าถ้าจริง, ค่าถ้าเท็จ)',
    example: '=IF(D6>C6, "YES", "NO")',
    teacherNote: '⭐ ในสไลด์บทที่ 2 หน้า 11 และบทที่ 3 หน้า 11: ข้อความที่ต้องการให้แสดงผลต้องใส่อยู่ในเครื่องหมายคำพูดคู่ " " เสมอ เช่น "YES", "NO" ห้ามลืม!',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-03T09:10:00.000Z',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
  {
    id: 'f-u3-if-average',
    unitId: 'unit-03',
    name: 'IF ซ้อน AVERAGE (เปรียบเทียบกับค่าเฉลี่ยของกลุ่ม)',
    shortDescription: 'ตรวจสอบว่าค่าของแต่ละรายการสูงหรือต่ำกว่าค่าเฉลี่ย',
    formula: '=IF(C3>AVERAGE(C$3:C$11), "High", "Low")',
    purpose: 'ตรวจสอบว่าราคาของรัฐนั้น ๆ ในเดือนสิงหาคม สูงกว่าค่าเฉลี่ยรวมของทุกรัฐหรือไม่ ถ้าสูงกว่าแสดง "High" ต่ำกว่าแสดง "Low"',
    syntax: '=IF(เซลล์ที่ต้องการตรวจ > AVERAGE(ช่วงเซลล์ที่ล็อกแถว), "High", "Low")',
    example: '=IF(C3>AVERAGE(C$3:C$11), "High", "Low")',
    teacherNote: '⭐ จุดสำคัญที่อาจารย์เน้นย้ำมาก: ช่วงข้อมูลในสูตร AVERAGE ต้องล็อกแถวด้วยเครื่องหมาย $ เช่น C$3:C$11 เพื่อให้ช่วงค่าเฉลี่ยไม่เลื่อนเวลาลากสูตรลงมา!',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-03T09:20:00.000Z',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
  {
    id: 'f-u3-nested-if-grade',
    unitId: 'unit-03',
    name: 'Nested IF หลายชั้น (การตัดเกรด & ประเมินผลงาน)',
    shortDescription: 'ตรวจสอบเงื่อนไขหลายระดับตามลำดับคะแนน',
    formula: '=IF(E4>=65,"Excellent",IF(E4>=50,"Satisfactory","Poor"))',
    purpose: 'จำแนกผลงานนักเรียน: ถ้าคะแนน >= 65 ได้ "Excellent", ถ้า >= 50 ได้ "Satisfactory", ถ้าน้อยกว่า 50 จะได้ "Poor"',
    syntax: '=IF(เงื่อนไข1, ผลลัพธ์1, IF(เงื่อนไข2, ผลลัพธ์2, ผลลัพธ์สุดท้าย))',
    example: '=IF(Total>=80, "A", IF(Total>=70, "B", IF(Total>=60, "C", "F")))',
    teacherNote: '⭐ ข้อสอบออกบ่อยมาก: อย่าลืมปิดวงเล็บให้ครบตามจำนวน IF ที่เปิดไว้ เช่น เปิด IF สองตัว ต้องปิดวงเล็บสองตัวท้ายสูตร ))',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-03T09:30:00.000Z',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
  {
    id: 'f-u3-nested-if-2d',
    unitId: 'unit-03',
    name: 'Nested IF 2 มิติ (จำแนกประเภทยานยนต์ Automobile Type)',
    shortDescription: 'ตรวจสอบเงื่อนไขซ้อนกัน 2 ปัจจัยที่ผู้ใช้เลือก',
    formula: '=IF(E2="Car", IF(E3="2-door", "Coupe", "Sedan"), IF(E3="Has Bed", "Pickup", "SUV"))',
    purpose: 'ตรวจสอบประเภทรถยนต์จาก 2 ตัวแปร: ประเภทรถ (Car/Truck ใน E2) และคุณสมบัติ (2-door/Has Bed ใน E3) เพื่อระบุรุ่นรถ (Coupe, Sedan, Pickup, SUV)',
    syntax: '=IF(ประเภท="Car", IF(ประตู="2-door", "Coupe", "Sedan"), IF(กระบะ="Has Bed", "Pickup", "SUV"))',
    example: 'เมื่อเลือก E2="Truck" และ E3="Has Bed" สูตรจะแสดงผลเป็น "Pickup"',
    teacherNote: '📌 ตัวอย่างจากสไลด์ 3.2 หน้า 13 แสดงโครงสร้าง Decision Tree: IF ตัวแรกแยกสาย Car กับ Truck, IF ตัวถัดไปตัดสินใจตามคุณสมบัติย่อย',
    importance: 'important',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-03T09:40:00.000Z',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
  {
    id: 'f-u3-sumif',
    unitId: 'unit-03',
    name: 'SUMIF: รวมผลเฉพาะยอดที่ติดลบ (Negative Balances)',
    shortDescription: 'คำนวณผลรวมเฉพาะตัวเลขที่ตรงตามเงื่อนไขที่กำหนด',
    formula: '=SUMIF(C3:C12, "<0")',
    purpose: 'ใช้คำนวณผลรวมของยอดเงินเฉพาะรายการที่ติดลบ (<0) ในงบดุลบัญชี เพื่อนำไปเปรียบเทียบกับยอดบวก (>0)',
    syntax: '=SUMIF(ช่วงข้อมูล, เงื่อนไข, [ช่วงที่ต้องการบวก])',
    example: '=SUMIF(C3:C12, "<0") ได้ยอดลบ -31,425.00 / =SUMIF(C3:C12, ">0") ได้ยอดบวก 31,425.00',
    teacherNote: '📌 สไลด์ 3.2 หน้า 14: หากช่วงที่ตรวจสอบเงื่อนไขเป็นช่วงเดียวกับตัวเลขที่จะหาผลรวม ไม่ต้องใส่ [sum_range] ตัวที่สาม',
    importance: 'important',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-03T09:50:00.000Z',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },
  {
    id: 'f-u3-countif',
    unitId: 'unit-03',
    name: 'COUNTIF: นับจำนวนตามเงื่อนไขในเซลล์อ้างอิง',
    shortDescription: 'นับว่ามีกี่รายการที่ตรงตามเงื่อนไขในเซลล์เป้าหมาย',
    formula: '=COUNTIF(D3:D212, G3)',
    purpose: 'นับจำนวนปีที่ค่า GDP ของประเทศมากกว่าหรือเท่ากับ 1 ล้าน โดยเงื่อนไขถูกพิมพ์ไว้ในเซลล์ G3 (>=1000000)',
    syntax: '=COUNTIF(ช่วงข้อมูลที่ตรวจ, เซลล์เงื่อนไข)',
    example: '=COUNTIF(D3:D212, G3) หรือพิมพ์เงื่อนไขตรง ๆ =COUNTIF(D3:D212, ">=1000000")',
    teacherNote: '⭐ ในสไลด์ 3.2 หน้า 15: เทคนิคการใส่เงื่อนไขผ่านเซลล์อ้างอิง G3 ช่วยให้ผู้ใช้เปลี่ยนเงื่อนไขได้ง่ายบนชีทโดยไม่ต้องเข้าไปแก้ในสูตร',
    importance: 'exam',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-03T10:00:00.000Z',
    updatedAt: '2026-09-05T12:00:00.000Z',
  },

  // ================= UNIT 04 =================
  {
    id: 'f-u4-lookup',
    unitId: 'unit-04',
    name: 'LOOKUP: ค้นหาค่าแบบเวกเตอร์ (Vector Form)',
    shortDescription: 'ค้นหาค่าจากช่วง 1 แถวหรือ 1 คอลัมน์ แล้วดึงผลลัพธ์จากตำแหน่งเดียวกัน',
    formula: '=LOOKUP(C15, B3:B12, C3:C12)',
    purpose: 'ค้นหารหัสพนักงานในคอลัมน์ B แล้วดึงชื่อพนักงานที่อยู่แถวเดียวกันในคอลัมน์ C ออกมาแสดง',
    syntax: '=LOOKUP(lookup_value, lookup_vector, result_vector)',
    example: '=LOOKUP(319, B3:B12, C3:C12) ได้ชื่อ "Elizabeth Marshall"',
    teacherNote: '📌 ข้อจำกัดสำคัญ: ข้อมูลใน lookup_vector ต้องเรียงลำดับจากน้อยไปมาก (A to Z / Ascending) เสมอ มิฉะนั้นอาจได้ค่าผิดพลาด',
    importance: 'important',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-04T09:10:00.000Z',
    updatedAt: '2026-09-05T13:00:00.000Z',
  },
  {
    id: 'f-u4-vlookup',
    unitId: 'unit-04',
    name: 'VLOOKUP: ค้นหาข้อมูลแนวดิ่ง (Vertical Lookup)',
    shortDescription: 'ค้นหาค่าในคอลัมน์แรกซ้ายสุด แล้วดึงข้อมูลจากคอลัมน์ที่กำหนดในแถวเดียวกัน',
    formula: '=VLOOKUP($L$3, $B$3:$I$12, 2, FALSE)',
    purpose: 'ใช้ดึงข้อมูลพนักงาน เช่น ชื่อ (คอลัมน์ 2), เงินเดือน (คอลัมน์ 5), ภาษี (คอลัมน์ 8) มาใส่ในแบบฟอร์มสลิปเงินเดือน (Paystub)',
    syntax: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    example: '=VLOOKUP($L$3, $B$3:$I$12, 5, FALSE) / VLOOKUP($L$3, $B$3:$I$12, 4, FALSE)',
    teacherNote: '⭐ ข้อสอบออก 100%! จุดตายที่ต้องจำ: 1) สิ่งที่ใช้ค้นหา ($L$3) ต้องอยู่คอลัมน์ซ้ายสุดของตาราง 2) ต้องกด F4 ล็อคช่วงตาราง ($B$3:$I$12) 3) Argument ตัวสุดท้ายต้องใส่ FALSE เพื่อค้นหาแบบตรงตัว (Exact Match)',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-04T09:20:00.000Z',
    updatedAt: '2026-09-05T13:00:00.000Z',
  },
  {
    id: 'f-u4-vlookup-calc',
    unitId: 'unit-04',
    name: 'VLOOKUP ในสมการคำนวณภาษี & เงินได้สุทธิ',
    shortDescription: 'นำผลลัพธ์ที่ดึงได้จาก VLOOKUP ไปคำนวณต่อในสูตรคณิตศาสตร์',
    formula: '=M7*VLOOKUP($L$3, $B$3:$I$12, 8, FALSE)',
    purpose: 'คำนวณยอดภาษี (Taxes) โดยนำเงินได้ (Pay ใน M7) ไปคูณกับอัตราภาษี (Tax Rate ในคอลัมน์ 8) ที่ดึงมาด้วย VLOOKUP',
    syntax: '=ยอดเงิน * VLOOKUP(รหัส, ตาราง, ลำดับคอลัมน์, FALSE)',
    example: 'Taxes = Pay * Tax Rate, Net Pay = Pay - Deductions',
    teacherNote: '📌 สไลด์ 3.3 หน้า 21-22: VLOOKUP สามารถเป็นส่วนหนึ่งของสูตรคำนวณใด ๆ ก็ได้ ไม่จำเป็นต้องอยู่เดี่ยว ๆ',
    importance: 'important',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-04T09:30:00.000Z',
    updatedAt: '2026-09-05T13:00:00.000Z',
  },
  {
    id: 'f-u4-hlookup',
    unitId: 'unit-04',
    name: 'HLOOKUP: ค้นหาข้อมูลแนวนอน (Horizontal Lookup)',
    shortDescription: 'ค้นหาค่าในแถวบนสุด แล้วดึงข้อมูลจากแถวที่ระบุในคอลัมน์เดียวกัน',
    formula: '=HLOOKUP(C5, C2:L3, 2, FALSE)',
    purpose: 'ค้นหาชื่อเมืองในแถวบนสุด (แถวที่ 2) แล้วดึงอุณหภูมิของเมืองนั้นจากแถวที่ 2 ของช่วงตาราง (แถวที่ 3 บนชีท) ออกมาแสดง',
    syntax: '=HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])',
    example: '=HLOOKUP("Casablanca", C2:L3, 2, FALSE) (คืนค่าอุณหภูมิ 55)',
    teacherNote: '⭐ จำคู่กัน: VLOOKUP = Vertical (ตารางแนวตั้ง ค้นหาคอลัมน์ซ้ายสุด), HLOOKUP = Horizontal (ตารางแนวนอน ค้นหาแถวบนสุด)',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-04T09:40:00.000Z',
    updatedAt: '2026-09-05T13:00:00.000Z',
  },
  {
    id: 'f-u4-index-match',
    unitId: 'unit-04',
    name: 'INDEX & MATCH: คู่หูค้นหาข้อมูลยืดหยุ่นสูง (แก้ข้อจำกัด VLOOKUP)',
    shortDescription: 'ค้นหาข้อมูลได้จากทุกคอลัมน์ ไม่จำกัดว่าต้องอยู่ซ้ายสุด (ค้นหาจากขวาไปซ้ายได้)',
    formula: '=INDEX(B3:D25, MATCH(G4, C3:C25, FALSE), 1)',
    purpose: 'ค้นหาชื่อเมืองในคอลัมน์ B โดยอ้างอิงจากรหัสรัฐ (State) ในคอลัมน์ C ซึ่ง VLOOKUP ทำไม่ได้เพราะค่าค้นหาอยู่ทางขวาของค่าที่ต้องการดึง',
    syntax: '=INDEX(ตารางทั้งหมด, MATCH(ค่าที่หา, คอลัมน์ที่หา, 0), เลขคอลัมน์ที่ต้องการดึง)',
    example: '=INDEX(B3:D25, MATCH("NH", C3:C25, 0), 1) คืนค่าชื่อเมือง "Manchester"',
    teacherNote: '⭐ ข้อสอบระดับสูงออกข้อนี้แน่นอน! สไลด์ 3.3 หน้า 24 ระบุชัดเจน: "ใช้แก้ข้อจำกัดของ VLOOKUP ที่ต้องค้นหาจากซ้ายไปขวา โดย MATCH จะหาตำแหน่งแถว และ INDEX จะดึงค่าจากตารางตามตำแหน่งนั้น"',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-04T09:50:00.000Z',
    updatedAt: '2026-09-05T13:00:00.000Z',
  },
  {
    id: 'f-u4-xlookup',
    unitId: 'unit-04',
    name: 'XLOOKUP: ฟังก์ชันค้นหารุ่นใหม่ (คืนค่าเดี่ยว & หลายค่า)',
    shortDescription: 'ฟังก์ชันค้นหาที่ทันสมัยที่สุด ค้นหาย้อนกลับได้ ดัก Error ในตัว และคืนค่าหลายคอลัมน์พร้อมกัน',
    formula: '=XLOOKUP(H4, A2:A24, C2:C24, "Not found")',
    purpose: 'ค้นหาข้อมูลโดยระบุคอลัมน์ที่ค้นหาและคอลัมน์ที่ต้องการคืนค่าได้โดยตรง ไม่ต้องนับเลขคอลัมน์ และสามารถกำหนดค่ากรณีหาไม่เจอได้ในตัว',
    syntax: '=XLOOKUP(lookup, lookup_array, return_array, [not_found], [match_mode], [search_mode])',
    example: 'คืนค่าเดี่ยว: =XLOOKUP(H4, A2:A24, C2:C24, "Not found") / คืนค่าหลายค่า: =XLOOKUP(F3, C2:C24, A2:B24)',
    teacherNote: '📌 สรุปหน้า 3: การคืนค่าหลายคอลัมน์ (Multiple Returns) ให้กำหนด return_array เป็นช่วงหลายคอลัมน์ เช่น A2:B24 ผลลัพธ์จะกระจายลง 2 เซลล์ทันที (Spill)',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-04T10:00:00.000Z',
    updatedAt: '2026-09-05T13:00:00.000Z',
  },

  // ================= UNIT 05 =================
  {
    id: 'f-u5-table-create',
    unitId: 'unit-05',
    name: 'การสร้างตาราง Excel Tables (Ctrl + T)',
    shortDescription: 'แปลงช่วงข้อมูลธรรมดาเป็นตารางทางการ พร้อมระบบจัดระเบียบอัตโนมัติ',
    formula: 'Insert > Table (Ctrl + T)',
    purpose: 'เปลี่ยนข้อมูลให้อยู่ในโครงสร้าง Table เพื่อให้ขยายขนาดอัตโนมัติเมื่อพิมพ์ข้อมูลต่อท้าย มีสลับสีแถว (Banded Rows) และมีปุ่ม Filter อัตโนมัติ',
    syntax: 'เลือกช่วงข้อมูล > Insert > Table (หรือกดปุ่ม Ctrl + T) > ตรวจสอบช่วงข้อมูล > OK',
    example: 'เลือกช่วง A1:B13 แล้วกด Ctrl + T ตารางจะถูกจัดรูปแบบอย่างสวยงามทันที',
    teacherNote: '📌 สไลด์ 1.2 หน้า 18 และสรุปหน้า 4: หากต้องการยกเลิกตาราง ให้ไปที่ Table Tools > Design > Convert to Range เพื่อแปลงกลับเป็นช่วงข้อมูลปกติโดยที่สูตรและสียังคงอยู่',
    importance: 'important',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-05T09:10:00.000Z',
    updatedAt: '2026-09-05T14:00:00.000Z',
  },
  {
    id: 'f-u5-table-calc',
    unitId: 'unit-05',
    name: 'สูตรคำนวณอัตโนมัติในตาราง (Calculated Column)',
    shortDescription: 'พิมพ์สูตรแค่เซลล์เดียว Excel จะคำนวณให้ทั้งคอลัมน์ทันที',
    formula: '=H3*10%',
    purpose: 'เมื่อสร้างคอลัมน์ใหม่ใน Excel Table เพียงพิมพ์สูตรในเซลล์ใดเซลล์หนึ่งแล้วกด Enter ระบบจะคัดลอกสูตรและคำนวณให้ทุกแถวอัตโนมัติ',
    syntax: '=เซลล์อ้างอิง * อัตราส่วน (พิมพ์ในคอลัมน์ใหม่ของ Table)',
    example: '=H3*10% หรือ =[@Price]*0.1',
    teacherNote: '📌 สรุปหน้า 5: ประหยัดเวลามาก ไม่ต้องลาก Fill Handle ลงมาเองเหมือนตารางข้อมูลธรรมดา',
    importance: 'normal',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-05T09:20:00.000Z',
    updatedAt: '2026-09-05T14:00:00.000Z',
  },
  {
    id: 'f-u5-total-row',
    unitId: 'unit-05',
    name: 'แถวสรุปผลรวมอัตโนมัติ (Table Total Row)',
    shortDescription: 'เปิดแถวสรุปผลลัพธ์ล่างสุดของตารางคำนวณ Sum, Average, Count',
    formula: 'Table Tools > Design > Total Row',
    purpose: 'เพิ่มแถวสรุปผลที่ด้านล่างสุดของตาราง สามารถคลิกเลือกสูตรที่ต้องการผ่าน Dropdown ได้ทันที เช่น ผลรวม (Sum), ค่าเฉลี่ย (Average)',
    syntax: 'คลิกเซลล์ในตาราง > Table Tools > แท็บ Design > ติ๊กเลือก Total Row',
    example: 'คำนวณผลรวมยอดขายทั้งปี: =SUBTOTAL(109, [Projected Sales]) ได้ยอด $730,098.08',
    teacherNote: '📌 สไลด์ 1.2 หน้า 19: ข้อดีที่สุดของ Total Row คือจะคำนวณผลลัพธ์เฉพาะแถวที่มองเห็น (Visible Cells) ดังนั้นเมื่อเรา Filter กรองข้อมูล ยอดรวมจะปรับเปลี่ยนตามอัตโนมัติ!',
    importance: 'important',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-05T09:30:00.000Z',
    updatedAt: '2026-09-05T14:00:00.000Z',
  },
  {
    id: 'f-u5-cond-format',
    unitId: 'unit-05',
    name: 'Conditional Formatting (จัดรูปแบบตามเงื่อนไข)',
    shortDescription: 'เปลี่ยนสีเซลล์หรือแสดงกราฟแท่งเปรียบเทียบค่าตามเงื่อนไขที่กำหนด',
    formula: 'Home > Conditional Formatting',
    purpose: 'เน้นข้อมูลที่น่าสนใจ เช่น ยอดขายที่มากกว่าเป้าหมาย (Greater Than), ค่าซ้ำ (Duplicate Values), ค่า Top 10 หรือแสดง Data Bars ในเซลล์',
    syntax: 'Home > Conditional Formatting > เลือก Highlight Cells Rules / Top-Bottom Rules / Data Bars',
    example: 'ใส่สีเขียวให้เซลล์ที่ยอดขาย > 60,000 และใส่สีแดงให้เซลล์ที่ < 50,000',
    teacherNote: '📌 สรุปหน้า 4: สามารถเข้าไปตรวจสอบ แก้ไข หรือลบกฎการจัดรูปแบบได้ที่เมนู Manage Rules หรือล้างทั้งหมดด้วย Clear Rules',
    importance: 'normal',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-05T09:40:00.000Z',
    updatedAt: '2026-09-05T14:00:00.000Z',
  },

  // ================= UNIT 06 =================
  {
    id: 'f-u6-pivottable',
    unitId: 'unit-06',
    name: 'PivotTable: โครงสร้าง 4 กล่องมหัศจรรย์',
    shortDescription: 'สรุปผลและวิเคราะห์ข้อมูลหลายมิติอย่างรวดเร็ว (Filters, Columns, Rows, Values)',
    formula: 'Insert > PivotTable',
    purpose: 'สรุปยอดขายตามกลุ่มสินค้าและตามเดือนจากข้อมูลนับหมื่นแถว ให้เหลือเป็นตารางสรุปที่อ่านง่ายและวิเคราะห์ได้ทันที',
    syntax: 'Insert > PivotTable > ลากฟิลด์ลง 4 กล่อง: 1) FILTERS (ตัวกรองภาพรวม), 2) COLUMNS (หัวคอลัมน์), 3) ROWS (หัวแถว), 4) VALUES (ตัวเลขสรุปผล Sum/Count/Avg)',
    example: 'ROWS: Category / COLUMNS: Months / VALUES: Sum of Sales / FILTERS: ShipCountry',
    teacherNote: '⭐ ข้อสอบออกทั้งทฤษฎีและปฏิบัติ! ท่อง 4 กล่องให้ขึ้นใจ: ROWS (แยกแถว), COLUMNS (แยกคอลัมน์), VALUES (ตัวเลขคำนวณ), FILTERS (กรองข้อมูลทั้งตาราง เช่น กรองเฉพาะ France หรือ Brazil)',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-05T10:00:00.000Z',
    updatedAt: '2026-09-05T15:00:00.000Z',
  },
  {
    id: 'f-u6-pivotchart-methods',
    unitId: 'unit-06',
    name: 'การสร้าง PivotChart (2 วิธีการสร้าง)',
    shortDescription: 'สร้างกราฟสรุปผลที่เชื่อมโยงและอัปเดตอัตโนมัติตาม PivotTable',
    formula: 'PivotTable Analyze > Tools > PivotChart',
    purpose: 'แสดงผลข้อมูลในรูปแบบแผนภูมิภาพหรือกราฟ เพื่อให้ผู้บริหารมองเห็นแนวโน้มและตัดสินใจได้เร็วกว่าการอ่านตัวเลขในตาราง',
    syntax: 'วิธีที่ 1 (จาก PivotTable เดิม): คลิกใน PivotTable > PivotTable Analyze > Tools > PivotChart / วิธีที่ 2 (จากตารางตรง): คลิกในตาราง > Insert > PivotChart',
    example: 'เลือกสร้างกราฟแท่ง Clustered Column หรือ Stacked Column',
    teacherNote: '⭐ สไลด์ 5.2 หน้า 9: "เมื่อมีการเปลี่ยนมุมมองที่ PivotTable กราฟ PivotChart ก็จะเปลี่ยนไปด้วย และในทางกลับกันหากปรับเปลี่ยน PivotChart ข้อมูลใน PivotTable ก็จะเปลี่ยนไปด้วย"',
    importance: 'exam',
    isFavorite: true,
    isDraft: false,
    createdAt: '2026-09-05T10:15:00.000Z',
    updatedAt: '2026-09-05T15:00:00.000Z',
  },
  {
    id: 'f-u6-pivotchart-tools',
    unitId: 'unit-06',
    name: 'การจัดการ PivotChart (Switch Row/Column & Chart Elements)',
    shortDescription: 'สลับมุมมองแกนข้อมูล และเพิ่มองค์ประกอบของแผนภูมิ',
    formula: 'Chart Design > Switch Row/Column',
    purpose: 'สลับมิติข้อมูลระหว่างแกน X และ Legend, เปลี่ยนประเภทแผนภูมิ (Change Chart Type เช่น Column เป็น Stacked Area), เพิ่มชื่อกราฟและป้ายข้อมูล',
    syntax: 'สลับแกน: Design > Switch Row/Column / เปลี่ยนประเภท: Design > Change Chart Type / เพิ่มองค์ประกอบ: Chart Design > Add Chart Element',
    example: 'สลับมุมมองจาก "ยอดขายของแต่ละผู้ขาย แยกตามเดือน" เป็น "ยอดขายแต่ละเดือน แยกตามผู้ขาย"',
    teacherNote: '📌 สไลด์ 5.2 หน้า 13-16: เมื่อกด Switch Row/Column บนกราฟ ตาราง PivotTable ที่เชื่อมโยงกันจะสลับรูปแบบการแสดงผลตามไปด้วยเช่นเดียวกัน',
    importance: 'important',
    isFavorite: false,
    isDraft: false,
    createdAt: '2026-09-05T10:30:00.000Z',
    updatedAt: '2026-09-05T15:00:00.000Z',
  },
  {
    id: 'f-u6-quick-draft-sample',
    unitId: 'unit-06',
    name: 'Power Pivot & Data Model',
    shortDescription: 'เชื่อมโยงข้อมูลหลายตารางผ่าน Data Model',
    formula: 'Insert > PivotTable > Add this data to Data Model',
    purpose: 'วิเคราะห์ข้อมูลข้ามหลายตารางโดยไม่ต้องใช้ VLOOKUP รวมข้อมูลเข้าด้วยกันก่อน',
    teacherNote: 'จดด่วนตอนอาจารย์กล่าวถึงท้ายคาบ — กลับมาเติมรายละเอียดก่อนสอบไฟนอล!',
    importance: 'important',
    isFavorite: false,
    isDraft: true,
    createdAt: '2026-09-05T11:00:00.000Z',
    updatedAt: '2026-09-05T15:00:00.000Z',
  }
];

export const storageService = {
  getApiKey: (): string => {
    return localStorage.getItem('excel_notes_gemini_key') || '';
  },
  saveApiKey: (key: string) => {
    localStorage.setItem('excel_notes_gemini_key', key);
  },
  getProfile: (): UserProfile => {
    const data = localStorage.getItem('excel_notes_profile');
    return data ? JSON.parse(data) : { name: 'Ailada', bio: 'study mode on ✦' };
  },
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem('excel_notes_profile', JSON.stringify(profile));
    window.dispatchEvent(new Event('profileUpdated'));
  },
  getUnits(): Unit[] {
    try {
      const stored = localStorage.getItem(UNITS_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);
        parsed = parsed.map((u: any) => {
          if (!u.noteSections) {
            u.noteSections = u.studyContent ? [{ id: "sec-" + Date.now() + Math.random(), order: 0, title: "Study Content", content: u.studyContent, layout: "text" }] : [];
          }
          if (!u.miniNotes) u.miniNotes = [];
          return u;
        });
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load units from localStorage', e);
    }
    this.saveUnits(COURSE_UNITS);
    localStorage.setItem(INITIAL_DATA_FLAG, 'true');
    return COURSE_UNITS;
  },

  saveUnits(units: Unit[]): void {
    try {
      localStorage.setItem(UNITS_KEY, JSON.stringify(units));
    } catch (e) {
      console.error('Failed to save units', e);
    }
  },

  getFormulas(): Formula[] {
    try {
      const stored = localStorage.getItem(FORMULAS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load formulas from localStorage', e);
    }
    this.saveFormulas(COURSE_FORMULAS);
    return COURSE_FORMULAS;
  },

  saveFormulas(formulas: Formula[]): void {
    try {
      localStorage.setItem(FORMULAS_KEY, JSON.stringify(formulas));
    } catch (e) {
      console.error('Failed to save formulas', e);
    }
  },

  async saveImage(key: string, dataUrl: string): Promise<void> {
    try {
      await set(`img_${key}`, dataUrl);
    } catch (e) {
      console.warn('IndexedDB save failed', e);
    }
  },

  async getImage(key: string): Promise<string | undefined> {
    try {
      return await get(`img_${key}`);
    } catch (e) {
      console.warn('IndexedDB get failed', e);
      return undefined;
    }
  },

  async deleteImage(key: string): Promise<void> {
    try {
      await del(`img_${key}`);
    } catch (e) {
      console.warn('IndexedDB del failed', e);
    }
  },

  exportData(): string {
    const units = this.getUnits();
    const formulas = this.getFormulas();
    const data = {
      app: 'Excel Formula Notes',
      version: '3.0.0',
      exportedAt: new Date().toISOString(),
      units,
      formulas,
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): { success: boolean; message: string; unitsCount?: number; formulasCount?: number } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.units || !Array.isArray(parsed.units)) {
        return { success: false, message: 'Invalid format' };
      }
      if (!parsed.formulas || !Array.isArray(parsed.formulas)) {
        return { success: false, message: 'Invalid format' };
      }

      this.saveUnits(parsed.units);
      this.saveFormulas(parsed.formulas);

      return {
        success: true,
        message: 'Import successful',
        unitsCount: parsed.units.length,
        formulasCount: parsed.formulas.length,
      };
    } catch (e) {
      return { success: false, message: 'Import failed: ' + String(e) };
    }
  },

  resetToDefaults(): { units: Unit[]; formulas: Formula[] } {
    this.saveUnits(COURSE_UNITS);
    this.saveFormulas(COURSE_FORMULAS);
    return {
      units: COURSE_UNITS,
      formulas: COURSE_FORMULAS,
    };
  }
};
