export const  taskType = {
		TODO:"todo",
		COMPLETED:"completed",
};

export function setEndOfContentEditable(contentEditableElement) {
	let range, selection;
	range = document.createRange();//Create a range (a range is a like the selection but invisible)
	range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the
                                                         // range
	range.collapse(false);//collapse the range to the end point. false means collapse to end rather than
                              // the start
	selection = window.getSelection();//get the selection object (allows you to change selection)
	selection.removeAllRanges();//remove any selections already made
	selection.addRange(range);//make the range you have just created the visible selection
}
export const singleClickDelay = 200;

export const arrowDown = String.fromCharCode(0x25BD);
export const arrowRight = String.fromCharCode(0x25BA);