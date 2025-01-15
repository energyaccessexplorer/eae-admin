const claims = jwt_decode(localStorage.getItem('token'));

if (!['leader', 'manager', 'director', 'root'].includes(claims['role']))
	qs(`nav#dt-nav a[href="${dt.config.base}/?model=users"]`).remove();

export const model = {
	"main": "email",

	"schema": {
		"email": {
			"type":     "email",
			"required": true,
		},

		"role": {
			"type":     "string",
			"required": true,
		},

		"disabled": {
			"type":    "boolean",
			"default": false,
		},

		"data": {
			"type": "json",
		},

		"about": {
			"type": "json",
		},
	},

	"edit_modal_jobs": [
		async function(object, form) {
			const follows = await dt.API.get('follows', {
				"select": ['*', 'dataset:datasets(info)'],
				"email":  `eq.${object.data.email}`,
			});
			const d = ce('details');
			d.append(ce('summary', ce('label', 'follows')));

			const x = ce('div', null, { "id": "badges" });
			x.append(...follows.map(f => ce(
				'span',
				ce('a', f.dataset.info, { "href": `./?model=datasets&id=${f.dataset_id}&edit_model=${f.dataset_id}` }),
				{ "class": "badge" },
			)));

			d.append(x);

			qs('fieldset', form).append(d);
		},
	],
};

export const collection = {
	"filters": ['email+name'],

	"endpoint": {
		"select": [
			'id',
			'email',
			'role',
			'data',
			'about',
		],
		"order": 'email.asc',
	},

	"parse": function($) {
		const a = $['about'] || {};

		$._country = a['country'];
		$._aoi = maybe(a, 'areas_of_interest', 'length') ? a['areas_of_interest'][0] : a['areas_of_interest'];

		$._first_name = a['first_name'];
		$._last_name = a['last_name'];

		$._email_name = `${$.email};;;${a['last_name']};;;${a['first_name']}`;

		$['email+name'] = $._email_name; // just so that it looks pretty.

		return $;
	},
};

export const base = 'users';

export const header = "Users";

export const new_disabled = true;
