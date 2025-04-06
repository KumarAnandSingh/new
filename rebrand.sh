#!/bin/bash

# Script to update branding from Studify.in to studyify.in
# This script will find and replace all instances of Studify with studyify

echo "Starting rebranding process from Studify.in to studyify.in..."

# Create a log file to track changes
LOG_FILE="/home/ubuntu/studify/rebranding/rebranding_log.txt"
echo "Rebranding Log - $(date)" > $LOG_FILE
echo "Changing Studify.in to studyify.in" >> $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE

# Find all files containing "Studify" and log them
echo "Finding files containing 'Studify'..."
find_cmd="find /home/ubuntu/studify -type f -name \"*.js\" -o -name \"*.jsx\" -o -name \"*.ts\" -o -name \"*.tsx\" -o -name \"*.md\" -o -name \"*.html\" -o -name \"*.css\" -o -name \"*.json\" -o -name \"*.yml\" | xargs grep -l \"Studify\""
eval $find_cmd > /home/ubuntu/studify/rebranding/files_to_update.txt

echo "Found $(wc -l < /home/ubuntu/studify/rebranding/files_to_update.txt) files to update." >> $LOG_FILE

# Process each file
echo "Processing files..."
while IFS= read -r file; do
  echo "Updating $file" >> $LOG_FILE
  
  # Create backup of the original file
  cp "$file" "${file}.bak"
  
  # Replace "Studify.in" with "studyify.in"
  sed -i 's/Studify\.in/studyify.in/g' "$file"
  
  # Replace "Studify" with "studyify"
  sed -i 's/Studify/studyify/g' "$file"
  
  # Special case for title case "Studyify" - replace with "studyify"
  sed -i 's/Studyify/studyify/g' "$file"
  
  # Count the number of replacements
  diff_count=$(diff -y --suppress-common-lines "${file}.bak" "$file" | wc -l)
  echo "  Made $diff_count replacements" >> $LOG_FILE
  
  # Remove backup file
  rm "${file}.bak"
done < /home/ubuntu/studify/rebranding/files_to_update.txt

echo "Rebranding complete!"
echo "----------------------------------------" >> $LOG_FILE
echo "Rebranding completed on $(date)" >> $LOG_FILE

# Summary
echo "Rebranding summary has been saved to $LOG_FILE"
