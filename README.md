# Open in GitHub

VSCode extension to open the current file in GitHub/GitHub Enterprise with line selection.

## Features

- Open the current file in GitHub/GitHub Enterprise browser
- Automatically includes selected line numbers in the URL
- Supports both GitHub.com and GitHub Enterprise
- Works with any git remote

## Usage

1. Open a file in your git repository
2. Select the lines you want to link to (or just place cursor anywhere)
3. Use one of the following method:
   - Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run "Open in GitHub"

The extension will open your default browser with the GitHub URL pointing to the selected lines.

## Requirements

- Git must be installed and available in PATH
- The file must be in a git repository with a remote configured

## How it works

The extension:
1. Gets the current git branch
2. Retrieves the remote URL (defaults to 'origin')
3. Converts SSH URLs to HTTPS format
4. Constructs a GitHub URL with the file path and line numbers
5. Opens the URL in your default browser

## Release Notes

### 0.0.1

Initial release of Open in GitHub extension.

## License

MIT

