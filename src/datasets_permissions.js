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
