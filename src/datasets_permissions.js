import bind from '../lib/bind.js';

import modal from '../lib/modal.js';

import {
	ce,
	remote_tmpl,
	qs,
	qsa,
	until,
} from '../lib/helpers.js';

const url = new URL(location);

const user_id = url.searchParams.get('user_id');
const dataset_id = url.searchParams.get('dataset_id');

export const base = 'datasets_permissions';

export const model = {
	"main": _ => "&nbsp;",

	"pkey": ['user_id', 'dataset_id'],

	"base": base,

	"clonable_attrs": [
		'user_id',
		'dataset_id',
		'type',
	],

	"schema": {
		"user_id": {
			"type":       "uuid",
			"fkey":       "users",
			"constraint": "user",
			"required":   true,
			"editable":   false,
			"label":      "User",
			"columns":    ['*'],
		},

		"dataset_id": {
			"type":       "uuid",
			"fkey":       "datasets",
			"constraint": "dataset",
			"required":   true,
			"editable":   false,
			"label":      "Dataset ID",
			"columns":    ['*'],
		},

		"type": {
			"type":       "select",
			"required":   true,
			"editable":   false,
			"label":      "Type",
			"default":    "read",
			"options":    ["read", "write", "publish"],
		},
	},
};

export const collection = {
	"endpoint": function() {
		const select = [
			"*",
			'user(*)',
			'dataset(*,category_name,geography_name)',
		];

		const params = { select };

		if (user_id)
			params['user_id'] = `eq.${user_id}`;

		else if (dataset_id)
			params['dataset_id'] = `eq.${dataset_id}`;

		return params;
	},
};

async function bulk_insert(dataset) {
	const users = await dt.API.get('users', {
		"select": ["id", "email", "role"],
		"order":  ["role", "email"],
	});

	const content = bind(
		await remote_tmpl("datasets_permissions/bulk-insert.html"),
		{ users, dataset, submit },
	);

	const m = new modal({
		"header": ce('h4', `Bulk Insert permissions for ${dataset.geography_name} - ${dataset.name || dataset.category_name}`),
		content,
	});

	function submit() {
		const type = qs('select[name=type]', m.content).value;
		qsa('input:checked', m.content, true).forEach(i => {
			const user_id = i.value;
			dt.API.post('datasets_permissions', null, { "payload": { dataset_id, type, user_id }});
		});
	};

	m.show();
};

export async function init() {
	if (!["leader", "manager", "director", "root"].includes(SELF.role)) return true;

	const dataset = await dt.API.get('datasets', {
		"id":     `eq.${dataset_id}`,
		"select": ["*", "category_name", "geography_name"],
	}, { "one": true });

	until(_ => qs('body main header .actions-drawer'))
		.then(_ => {
			const a = ce('button', ce('i', null, { "class": "bi-lock", "title": 'Bulk insert' }));
			a.onclick = _ => bulk_insert(dataset);
			qs('body main header .actions-drawer').append(a);

			bulk_insert(dataset);
		});

	return true;
};
