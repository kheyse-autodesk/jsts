export default class Character {}
Character.isWhitespace = c => ((c <= 32 && c >= 0) || c == 127)
