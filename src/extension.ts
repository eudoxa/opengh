import * as vscode from 'vscode';
import { execSync } from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('opengh.openInGitHub', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    const document = editor.document;
    const selection = editor.selection;

    // Get the file path relative to workspace
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('File is not in a workspace');
      return;
    }

    const workspacePath = workspaceFolder.uri.fsPath;
    const filePath = document.uri.fsPath;
    const relativePath = path.relative(workspacePath, filePath);

    try {
      // Get current branch
      const branch = execSync('git rev-parse --abbrev-ref HEAD', {
        cwd: workspacePath,
        encoding: 'utf-8'
      }).trim();

      // Get remote (default to 'origin')
      let remote = 'origin';
      try {
        // Check if origin exists
        execSync('git remote get-url origin', {
          cwd: workspacePath,
          encoding: 'utf-8'
        });
      } catch {
        // If origin doesn't exist, get the first remote
        const remotes = execSync('git remote', {
          cwd: workspacePath,
          encoding: 'utf-8'
        }).trim().split('\n');
        if (remotes.length > 0 && remotes[0]) {
          remote = remotes[0];
        }
      }

      // Get remote URL and convert to HTTPS URL
      const remoteUrl = execSync(`git remote get-url ${remote}`, {
        cwd: workspacePath,
        encoding: 'utf-8'
      }).trim();

      // Convert git@github.com:user/repo.git to https://github.com/user/repo
      let gheBasePath = remoteUrl
        .replace(/^git@/, 'https://')
        .replace(/\.com:/, '.com/')
        .replace(/\.co:/, '.co/')
        .replace(/\.git$/, '');

      // Build the full URL with line numbers
      const firstLine = selection.start.line + 1; // VSCode uses 0-based indexing
      const lastLine = selection.end.line + 1;

      const url = `${gheBasePath}/tree/${branch}/${relativePath}#L${firstLine}-L${lastLine}`;

      // Open in browser
      await vscode.env.openExternal(vscode.Uri.parse(url));

      vscode.window.showInformationMessage(`Opened in browser: ${url}`);
    } catch (error) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(`Failed to open in GitHub: ${error.message}`);
      } else {
        vscode.window.showErrorMessage('Failed to open in GitHub');
      }
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() { }

