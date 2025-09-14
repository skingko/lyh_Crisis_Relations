#!/bin/bash

# Fix all absolute paths in HTML files for Cloudflare Pages deployment

echo "🔧 Fixing absolute paths in HTML files..."

# Fix all HTML files
for html_file in $(find out -name "*.html"); do
    echo "Processing $html_file..."
    
    # Fix /_next/ paths to ./_next/
    sed -i '' 's|/_next/|./_next/|g' "$html_file"
    
    # Fix favicon.ico path
    sed -i '' 's|href="/favicon.ico"|href="./favicon.ico"|g' "$html_file"
    
    # Fix any other absolute paths starting with /
    # Be careful not to break external URLs or special paths
    sed -i '' 's|href="/\([^"]*\)"|href="./\1"|g' "$html_file"
    sed -i '' 's|src="/\([^"]*\)"|src="./\1"|g' "$html_file"
    
    # Fix paths in inline JavaScript
    sed -i '' 's|"/_next/|"./_next/|g' "$html_file"
    sed -i '' "s|'/_next/|'./_next/|g" "$html_file"
    
    echo "✅ Fixed paths in $html_file"
done

# Also fix any CSS files that might have absolute paths
for css_file in $(find out -name "*.css"); do
    echo "Processing $css_file..."
    
    # Fix any absolute paths in CSS
    sed -i '' 's|url(/_next/|url(./_next/|g' "$css_file"
    sed -i '' 's|url("/_next/|url("./_next/|g' "$css_file"
    sed -i '' "s|url('/_next/|url('./_next/|g" "$css_file"
    
    echo "✅ Fixed paths in $css_file"
done

echo "🎉 All paths fixed successfully!"

# Verify the fixes
echo "📋 Verification - checking for remaining absolute paths:"
if grep -r "/_next/" out/ --include="*.html" --include="*.css" | head -5; then
    echo "⚠️  Found remaining absolute paths (shown above)"
else
    echo "✅ No absolute /_next/ paths found"
fi

if grep -r 'href="/[^h]' out/ --include="*.html" | head -5; then
    echo "⚠️  Found remaining absolute href paths (shown above)"
else
    echo "✅ No absolute href paths found (except external URLs)"
fi