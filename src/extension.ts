// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, window, ExtensionContext, workspace, ConfigurationTarget } from "vscode";

type JSONSchema = {
	fileMatch: String[]
	url: String
	addedBy: String
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tyk-configuration-validator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = commands.registerCommand('tyk-configuration-validator.validateTyk', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const configuration = workspace.getConfiguration("json");
		const tykSchema: JSONSchema[] = [{
			fileMatch: [
				"apioasdef.json"
			],
			url: "https://raw.githubusercontent.com/letzya/tyk-schemas/firstdraft/schema_apikey_lean.json",
			addedBy: "tyk-validator"
		}];
		configuration.update("schemas", tykSchema, ConfigurationTarget.Global).then(() => {
			window.showInformationMessage('Installed tyk validator');
		});

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
	const configuration = workspace.getConfiguration("json");
	if (configuration.has("schemas")) {
		let schemas = configuration.get("schemas") as JSONSchema[];
		schemas = schemas.filter(schema => schema.addedBy !== "tyk-validator");
		configuration.update("schemas", schemas, ConfigurationTarget.Global).then(() => {
			window.showInformationMessage('Uninstalled tyk validator');
		});
	}
}
