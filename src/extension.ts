// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const provider = new ImagePreviewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      'imagePreview.preview',
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false
      }
    )
  );
}

class ImagePreviewProvider implements vscode.CustomReadonlyEditorProvider {
  constructor(
    private readonly extensionUri: vscode.Uri
  ) { }

  async openCustomDocument(
    uri: vscode.Uri,
    openContext: vscode.CustomDocumentOpenContext,
    token: vscode.CancellationToken
  ): Promise<vscode.CustomDocument> {
    return { uri, dispose: () => { } };
  }



  async resolveCustomEditor(
    document: vscode.CustomDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.extensionUri, 'media'),
        vscode.Uri.file(path.dirname(document.uri.fsPath))
      ]
    };

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, document.uri);
  }
  private getHtmlForWebview(webview: vscode.Webview, imageUri: vscode.Uri): string {
    const imageWebviewUri = webview.asWebviewUri(imageUri);

    const mediaPath = vscode.Uri.joinPath(this.extensionUri, 'media');

    const htmlPath = path.join(mediaPath.fsPath, 'HDRView.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    const resourceFiles = ['HDRView.js', 'HDRView.wasm', 'HDRView.data'];
    const resourceUris: { [key: string]: string } = {};

    resourceFiles.forEach(file => {
      const resourceUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaPath, file));
      resourceUris[file] = resourceUri.toString();
    });

    const moduleScript = `
      <script>
        var hdrViewArgs = ["--url", "${imageWebviewUri}"];
        var Module = Module || {};

        Module.locateFile = function(path, scriptDirectory) {
          if (path in resourceUriMap) {
            return resourceUriMap[path];
          }
          return scriptDirectory + path;
        };

        var resourceUriMap = {
          ${resourceFiles.map(file => `"${file}": "${resourceUris[file]}"`).join(',\n          ')}
        };

        Module.arguments = "--url ${imageWebviewUri.toString()}";

        (function() {
          const originalFetch = window.fetch;
          window.fetch = function(input, init) {
            if (typeof input === 'string') {
              for (const file in resourceUriMap) {
                if (input === file || input.endsWith('/' + file)) {
                  return originalFetch(resourceUriMap[file], init);
                }
              }
            }
            return originalFetch(input, init);
          };

          const originalXHROpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (typeof url === 'string') {
              for (const file in resourceUriMap) {
                if (url === file || url.endsWith('/' + file)) {
                  return originalXHROpen.call(this, method, resourceUriMap[file], ...args);
                }
              }
            }
            return originalXHROpen.call(this, method, url, ...args);
          };
        })();
      </script>
    `;

    htmlContent = htmlContent.replace('</head>', `${moduleScript}</head>`);

    resourceFiles.forEach(file => {
      const regex = new RegExp(`(src|href)="${file}([^"]+)"`, 'g');
      htmlContent = htmlContent.replace(regex, `$1="${resourceUris[file]}$2"`);
    });

    return htmlContent;
  }
}


// This method is called when your extension is deactivated
export function deactivate() { }
