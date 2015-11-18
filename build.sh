set -e

rm -rf core toolkit

$(npm bin)/babel src --out-dir .
cp -r src/toolkit/*.css toolkit
