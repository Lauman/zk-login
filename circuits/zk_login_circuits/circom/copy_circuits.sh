#!/bin/bash

# --- CONFIGURATION ---
# Define the source and destination file pairs in an associative array.
# Key: Source file path
# Value: Destination file path
local rootPath = "../../../"
declare -A FILES_TO_COPY=(
    ["verification_key.json"]="${rootPath}frontend/public/verification_key.json"
    ["zKLogin_0001.zkey"]="${rootPath}frontend/public/zKLogin_0001.zkey"
    ["zKLogin_js/zKLogin.wasm"]="${rootPath}frontend/public/zKLogin.wasm"
    ["verifier.sol"]="${rootPath}/contracts/Groth16Verifier.sol"
    # Add more pairs here
)

# --- COPY AND REPLACE FUNCTION ---

# This function handles the core logic: checking, deleting, and copying.
copy_and_replace() {
    local source_file="$1"
    local destination_file="$2"

    echo "--- Processing: $source_file ---"

    # 1. Check if the source file exists
    if [[ ! -f "$source_file" ]]; then
        echo "⚠️  ERROR: Source file does not exist: $source_file"
        return 1 # Exit function with error
    fi

    # 2. Check if the destination file exists and remove it
    if [[ -e "$destination_file" ]]; then
        echo "✅  Destination file exists: $destination_file"
        echo "🗑️  Deleting existing destination file..."
        # Use 'rm -f' for forced, non-interactive deletion
        if rm -f "$destination_file"; then
            echo "👍  Deletion successful."
        else
            echo "❌  ERROR while trying to delete: $destination_file. Aborting copy."
            return 1 # Exit function with error
        fi
    else
        echo "✨  Destination file does not exist. Continuing with copy."
        # Ensure the destination directory exists
        destination_dir=$(dirname "$destination_file")
        if [[ ! -d "$destination_dir" ]]; then
            echo "📁  Creating destination directory: $destination_dir"
            mkdir -p "$destination_dir"
        fi
    fi

    # 3. Perform the copy
    echo "📄  Copying $source_file to $destination_file..."
    if cp "$source_file" "$destination_file"; then
        echo "🎉  Successful copy of $source_file to $destination_file."
    else
        echo "❌  ERROR: Copy failed."
        return 1 # Exit function with error
    fi

    echo "" # Empty line for separation
    return 0
}

# --- MAIN EXECUTION ---

echo "🚀  Starting copy and replace script..."
echo "=========================================="

# Iterate over all pairs in the list
for source in "${!FILES_TO_COPY[@]}"; do
    destination="${FILES_TO_COPY[$source]}"
    copy_and_replace "$source" "$destination"
done

echo "=========================================="
echo "🏁  Copy process completed."