import deployment_options from './deployment-options.js';

export const base = 'access';

export const header = "Access";

export const model = {
	"base": base,

	"pkey": ["user_id", "circle", "deployment"],

	"schema": {
		"user_id": {
			"type":       "uuid",
			"fkey":       "user",
			"constraint": "users!id",
			"columns":    ['id', 'email'],
			"required":   true,
			"editable":   false,
		},

		"circle": {
			"type":     "string",
			"required": true,
		},

		"deployment": {
			"type":     "string",
			"options":  deployment_options,
			"required": true,
		},
	},
};

export const collection = {
	"endpoint": function() {
		const url = new URL(location);
		const user_id = url.searchParams.get('user_id');
		const circle = url.searchParams.get('circle');
		const deployment = url.searchParams.get('deployment');

		const select = ['*', 'user:users(email)'];
		const params = { select };

		if (user_id) params['user_id'] = `eq.${user_id}`;
		if (circle) params['circle'] = `eq.${circle}`;
		if (deployment) params['deployment'] = `eq.${deployment}`;

		params['order'] = ['circle', 'deployment'];

		return params;
	},
};
