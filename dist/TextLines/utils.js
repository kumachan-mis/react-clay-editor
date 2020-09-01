import { TextLinesConstants } from "./constants";
export function analyzeLine(line) {
    const regex = TextLinesConstants.syntaxRegex.indent;
    const { indent, content } = line.match(regex)?.groups;
    return { indent, content };
}
export function analyzeFontOfContent(content, textStyle) {
    const regex = TextLinesConstants.syntaxRegex.bracket;
    let match = null;
    let offset = 0;
    const textsWithFont = [];
    while ((match = regex.exec(content))) {
        if (match.index - offset > 0) {
            const text = content.substring(offset, match.index);
            textsWithFont.push({ text, offset, section: [0, text.length] });
            offset = match.index;
        }
        const text = match[0];
        const option = match.groups?.option || "";
        if (option == "") {
            textsWithFont.push({ text: text, offset, section: [0, text.length] });
            offset = regex.lastIndex;
            continue;
        }
        const { level1, level2, level3 } = textStyle.fontSizes;
        const section = [option.length + 1, text.length - 1];
        const style = { bold: false, italic: false, underline: false, fontSize: level1 };
        for (let i = 0; i < option.length; i++) {
            switch (option[i]) {
                case "*":
                    if (!style.bold) {
                        style.bold = true;
                    }
                    else if (style.fontSize == level1) {
                        style.fontSize = level2;
                    }
                    else {
                        style.fontSize = level3;
                    }
                    break;
                case "/":
                    style.italic = true;
                    break;
                case "_":
                    style.underline = true;
                    break;
            }
        }
        textsWithFont.push({ text: text, offset, section, ...style });
        offset = regex.lastIndex;
    }
    if (content.length - offset > 0) {
        const subText = content.substring(offset, content.length);
        textsWithFont.push({ text: subText, offset, section: [0, subText.length] });
    }
    return textsWithFont;
}
