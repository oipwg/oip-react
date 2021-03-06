export default function buildQuery(state) {
	const forms = state.forms
	let sorted = []
	for (let uid in forms) {
		sorted.push([uid, forms[uid].index])
	}
	sorted.sort((a, b) => {
		return a[1] - b[1]
	})
	
	let queryObject = {
		0: []
	}
	let count = 0
	for (let form of sorted) {
		const formId = form[0]
		const formState = forms[formId]
		
		let qb = handleQueryBuild(formState)
		if (formState.type === 'complex') {
			if (formState.operator === 'NOT') {
				queryObject[count].push('AND NOT')
			} else if (formState.operator === 'AND') {
				queryObject[count].push(formState.operator)
			} else {
				count += 1
				queryObject[count] = []
			}
		}
		queryObject[count].push(qb)
	}
	let query = '';
	for (let q in queryObject) {
		query += `(${queryObject[q].join(' ')})`
		if (Number(q) !== Object.keys(queryObject).length - 1) {
			query += ' OR '
		}
	}
	console.log(query)
	return query
}

function handleContains(form) {
	if (form.field === '*') {
		return `${form.query}`
	}
	return `${form.field}:${form.query}`
}

function handleExact(form) {
	return `${form.field}:"${form.query}"`
}

function handleIsNot(form) {
	return `${form.field}:!${form.query}`
}

function handleGreater(form) {
	return `${form.field}:>${form.query}`
}

function handleLesser(form) {
	return `${form.field}:<${form.query}`
}

function handleBetween(form) {
	return `${form.field}:[${form.query} TO ${form.maxQuery}]`
}

function handleExists(form) {
	return `_exists_:${form.field}`
}

function handleNonexistent(form) {
return `-_exists_:${form.field}`
}

function handleQueryBuild(form) {
	const type = form.option
	switch (type) {
		case 'contains':
			return handleContains(form)
		case 'is (exact)':
			return handleExact(form)
		case 'is (not)':
			return handleIsNot(form)
		case 'above':
			return handleGreater(form)
		case 'below':
			return handleLesser(form)
		case 'between':
			return handleBetween(form)
		case 'before':
			return handleLesser(form)
		case 'after':
			return handleGreater(form)
		case 'is':
			return handleExact(form)
		case 'exists':
			return handleExists(form)
		case 'nonexistent':
			return handleNonexistent(form)
		//date-specific fields
		case 'is (on)':
			return handleBetween(form)
		case 'is (not on)':
			return handleBetween(form)
		default:
			throw new Error('invalid query option')
	}
}
