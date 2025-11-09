from pathlib import Path
text = Path('Client/src/pages/TailorMadePage.css').read_text()
start = text.index('.hero-shell {')
end = text.index('.hero-pill {')
segment = text[start:end]
print(repr(segment[:120]))
print('---')
print(segment[:120])
