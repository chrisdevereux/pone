set -e

rm -rf core toolkit

$(npm bin)/babel src --out-dir . --source-maps inline
cp -r src/toolkit/*.css toolkit
