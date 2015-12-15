function entityCount(list, constructor) {
	var count = 0;
	for (var i in list) {
		if (list[i].constructor==constructor) {
			count++;
		};
	}
	return count;
}