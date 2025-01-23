import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
	"baseDirectory": path.dirname(fileURLToPath(import.meta.url)),
	"recommendedConfig": js.configs.recommended,
	"allConfig": js.configs.all
});

export default [{
	"ignores": ["lib/*.js"],
}, ...compat.extends("eslint:recommended"), {
	"languageOptions": {
		"globals": {
			...globals.browser,
			"SELF": "writable",
			"dt": "readonly",
			"email_user": "readonly",
			"external_link_base": "readonly",
			"fake_blob_download": "readonly",
			"modal": "readonly",
			"maybe": "readonly",
			"or": "readonly",
			"and": "readonly",
			"coalesce": "readonly",
			"ce": "readonly",
			"qs": "readonly",
			"qsa": "readonly",
			"remote_tmpl": "readonly",
			"pgrest": "readonly",
			"until": "readonly",
			"uuid": "readonly",
			"jwt_decode": "readonly"
		},
		"ecmaVersion": "latest",
		"sourceType": "module",
	},

	"rules": {
		"comma-dangle": ["error", "always-multiline"],
		"indent": ["error", "tab"],
		"key-spacing": ["error", {
			"align": {
				"beforeColon": false,
				"afterColon": true,
				"on": "value",
				"mode": "minimum",
			},
		}],
		"linebreak-style": ["error", "unix"],
		"quotes": "off",
		"quote-props": ["error", "always"],
		"semi": ["error", "always"],
		"no-cond-assign": "off",
		"no-console": "off",
		"no-useless-escape": "off",
		"no-extra-semi": "off",
		"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
		"no-prototype-builtins": "off",
		"no-unused-vars": ["warn", {
			"varsIgnorePattern": "^_",
			"argsIgnorePattern": "^_",
		}],
	},
}];
