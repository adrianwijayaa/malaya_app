lines = [
    '.hero-shell {',
    '  position: relative;',
    '  z-index: 1;',
    '  width: min(1120px, 100%);',
    '  margin: 0 auto;',
    '  display: flex;',
    '  flex-direction: column;',
    '  align-items: center;',
    '}',
    '',
    '.hero-info {',
    '  width: min(960px, 100%);',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: clamp(18px, 3vw, 26px);',
    '  background: rgba(6, 24, 36, 0.62);',
    '  border-radius: 32px;',
    '  padding: clamp(30px, 4.5vw, 48px);',
    '  border: 1px solid rgba(255, 255, 255, 0.18);',
    '  backdrop-filter: blur(8px);',
    '  box-shadow: 0 28px 60px rgba(4, 20, 32, 0.32);',
    '  margin: 0 auto;',
    '}',
    ''
]
new_block = '\r\n'.join(lines)
print(repr(new_block))
