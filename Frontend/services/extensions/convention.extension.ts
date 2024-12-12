/** @param {string} input */
export function pascalToKeabCase(input: string) {
    var output = input[0].toLowerCase();
    for (var char of input.substring(1)) {
        if (char.match(/[A-Z]/g)) output += '-';
        output += char.toLowerCase();
    }

    return output;
}
