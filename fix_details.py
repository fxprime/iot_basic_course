#!/usr/bin/env python3
"""
Fix <details> tags in markdown files by adding markdown="1" attribute
"""

import os
import re
from pathlib import Path

def fix_details_tags(content):
    """
    Add markdown="1" attribute to <details> tags that don't have it
    """
    # Replace <details> with <details markdown="1"> if not already present
    pattern = r'<details(?!\s+markdown=)>'
    replacement = r'<details markdown="1">'
    
    fixed = re.sub(pattern, replacement, content)
    
    return fixed

def process_file(file_path):
    """Process a single markdown file"""
    print(f"Processing: {file_path.name}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        fixed_content = fix_details_tags(content)
        
        if fixed_content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            
            # Count changes
            changes = len(re.findall(r'<details markdown="1">', fixed_content)) - len(re.findall(r'<details markdown="1">', original_content))
            print(f"  ✅ Fixed {changes} <details> tag(s)")
            return True
        else:
            print(f"  ⏭️  No changes needed")
            return False
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def main():
    """Main function"""
    script_dir = Path(__file__).parent
    docs_dir = script_dir / 'docs' / 'esp32'
    
    if not docs_dir.exists():
        print(f"❌ Error: Directory not found: {docs_dir}")
        return
    
    md_files = sorted(docs_dir.glob('*.md'))
    
    print(f"🔍 Found {len(md_files)} markdown files\n")
    
    fixed_count = 0
    total_changes = 0
    
    for md_file in md_files:
        if process_file(md_file):
            fixed_count += 1
    
    print(f"\n✅ Fixed {fixed_count} file(s)")
    print(f"🎉 All <details> tags now have markdown=\"1\" attribute")

if __name__ == '__main__':
    main()
