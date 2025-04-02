
export function idIsExist(id, array) {
	if (!array) {
		console.log('is not array');
		return false;
	}
	return array.includes(id);
}