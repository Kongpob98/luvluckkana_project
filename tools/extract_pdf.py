#!/usr/bin/env python3
"""
แปลง PDF โหราศาสตร์เบื้องต้น เป็น Knowledge Base
"""

import pdfplumber
import json
import re

def extract_pdf_content():
    """แยกข้อความจาก PDF"""
    pdf_path = "โหราศาสตร์ เบื้องต้น.pdf"
    
    print("📄 กำลังอ่าน PDF...")
    all_text = []
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"📊 จำนวนหน้าทั้งหมด: {len(pdf.pages)}")
            
            for i, page in enumerate(pdf.pages, 1):
                text = page.extract_text()
                if text:
                    all_text.append({
                        'page': i,
                        'content': text
                    })
                    print(f"✅ อ่านหน้า {i} เสร็จ")
            
            # บันทึกข้อความดิบ
            with open('pdf_output.json', 'w', encoding='utf-8') as f:
                json.dump(all_text, f, ensure_ascii=False, indent=2)
            
            print(f"\n💾 บันทึกข้อความดิบไว้ที่: pdf_output.json")
            print(f"\n📖 ตัวอย่างเนื้อหาหน้าแรก:\n")
            print("=" * 50)
            print(all_text[0]['content'][:800])
            print("=" * 50)
            
            return all_text
            
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        return None

if __name__ == "__main__":
    extract_pdf_content()
    print("\n✨ เสร็จสิ้น!")
    print("💡 ขั้นตอนต่อไป: เปิดไฟล์ pdf_output.json แล้วบอกผมว่าเนื้อหาเป็นยังไง")
