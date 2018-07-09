/**
 * Add no breaking spaces before one and two character words.
 */
export function polishLineBreaks(text: string) {
    let result = "";
    let words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
        let space;
        if (words[i].length <= 2) {
            space = "\u00A0";  // non breaking space
        } else if (i >= words.length - 1) { // last iteration
            space = "";
        } else {
            space = " ";
        }
        result += words[i] + space;
    }
    return result;
}
