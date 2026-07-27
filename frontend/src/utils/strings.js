export function toPascalCase(string, delimiter = " ") {
    if (typeof string !== "string") {
        throw Error(`${string} is not a valid string!`);
    }

    const wordsArr = string.split(delimiter);
    const moddedWords = wordsArr.map(word => `${word[0].toUpperCase()}${word.length > 1 ? word.substring(1) : ''}`);
    const outputStr = moddedWords.join(" ");

    return outputStr;
}