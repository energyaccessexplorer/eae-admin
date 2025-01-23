/* eslint no-undef: "off" */

Object.assign(config, {
	"paver_endpoint":      "http://eae.localhost/paver",
	"departer_endpoint":   "http://eae.localhost/departer",
	"status":              "http://eae.localhost/status",
	"bucket":              "http://eae.localhost/bucket",
	"storage_track_files": false,
	"storage_use_prefix":  true,
	"default_model":       "geographies",
	"landing":             false,
	"pre_view":            async function() {
		try {
			const id = jwt_decode(localStorage['token']).id;
			const u = (await dt.API.get('users', { "id": `eq.${id}` }, { "one": true }));

			window.SELF = u;
		} catch(err) {
			console.error(err);
			window.SELF = { "data": { "circles": [], "envs": [] } };
		}
	},
});

export const fetchables = {
	"geographies": {
		"primary":     'name',
		"placeholder": "name",
		"options":     function(v) {
			return {
				"table": 'geographies',
				"query": {
					"select": ['id', 'name'],
					"name":   `ilike.*${v}*`,
				},
				"input":      x => x['id'],
				"descriptor": x => x['name'],
				"value":      v,
				"threshold":  2,
			};
		},
	},

	"categories": {
		"primary":     'id',
		"placeholder": "name",
		"options":     function(v) {
			return {
				"table": 'categories',
				"query": {
					"select": ['id', 'name', 'name_long', 'unit'],
					"name":   `ilike.*${v}*`,
				},
				"input":      x => x['id'],
				"descriptor": x => `${x.name} - ${x.name_long}`,
				"value":      v,
				"threshold":  2,
			};
		},
	},

	"datasets": {
		"primary":     'id',
		"placeholder": "category_name",
		"options":     function(v) {
			return {
				"table": 'datasets',
				"query": {
					"select":        ['id', 'name', 'name_long', 'geography_name', 'category_name', 'category_id'],
					"category_name": `ilike.*${v}*`,
				},
				"input":      x => x['id'],
				"descriptor": x => `${x.geography_name} - ${x.category_name} -- ${x.name} -- ${x.name_long}`,
				"value":      v,
				"threshold":  2,
			};
		},
	},
};

export const navlist = [
	["geographies", "Geographies", "globe"],
	["categories", "Categories", "list-nested"],
	["users", "Users", "people-fill"],
];
