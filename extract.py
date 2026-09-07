from pypdf import PdfReader

try:
    reader = PdfReader('Manual_Boas_Vindas.pdf')
    for page in reader.pages:
        print(page.extract_text())
except Exception as e:
    print(f"Error: {e}")
