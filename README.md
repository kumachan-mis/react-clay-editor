# react-realtime-markup-editor

A text document editor which is syntactically formattable in real time  
Inspired by [Scrapbox](https://scrapbox.io/product)

## TL;DR

### Installation

```sh
npm install react-realtime-markup-editor
```

or

```sh
yarn add react-realtime-markup-editor
```

### Simplest Usage

```tsx
import { Editor } from "react-realtime-markup-editor";

const App: React.FC = () => {
  const [text, setText] = React.useState("");
  return <Editor text={text} onChangeText={setText} />;
};
```

## Demo

[demo](https://kumachan-mis.github.io/react-realtime-markup-editor) on github pages

## Formatting Syntax

### Itemizations

| style         | syntax  | 　  |
| ------------- | ------- | --- |
| <li>item</li> | `␣item` |

**Note**  
Multiple spaces will provide nested itemizations.

### Text Decorations

| style            | syntax          | 　  |
| ---------------- | --------------- | --- |
| <b>bold</b>      | `[* bold]`      |
| <h4>larger</h4>  | `[** larger]`   |
| <h3>largest</h3> | `[*** largest]` |
| <i>italic</i>    | `[/ italic]`    |
| <u>underline</u> | `[_ underline]` |

**Note**  
Combinations of `*`, `/` and `_` are available.  
Here are some examples:

| style                          | syntax                                             | 　  |
| ------------------------------ | -------------------------------------------------- | --- |
| <b><i>bold italic</i></b>      | `[*/ bold italic]` or `[/* bold italic]`           |
| <b><u>bold underline</u></b>   | `[*_ bold underline]` or `[_* bold underline]`     |
| <i><u>italic underline</u></i> | `[/_ italic underline]` or `[_/ italic underline]` |

### Links

| style               | syntax               | 　  |
| ------------------- | -------------------- | --- |
| <a>blacket link</a> | `[blacket link]`     |
| <a>tagged link</a>  | `[tag: tagged link]` |
| <a>#hash-tag</a>    | `#hash-tag`          |

**Note**

1. Tagged links are useful when you want to make some link groups  
   Here are some examples:

- Can make `[github: @user_name/repository_name]` go to

```html
<a href="https://github.com/user_name/repository_name"> @user_name/repository_name </a>
```

- Can make `[npm: package_name]` go to

```html
<a href="https://www.npmjs.com/package/package_name"> package_name </a>
```

2. Can show input suggestions of links  
   For example, you can provide users with webpage list which may be refered from the document

## Public API

| name                 | type                                     | requried/optional | default                                   | description                                                                                                         |
| -------------------- | ---------------------------------------- | ----------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `text`               | `string`                                 | requried          | -                                         | syntactic text in `Editor`<br>you will use this like<br>`text={this.state.text}`                                    |
| `onChangeText`       | `(text: string) => void`                 | requried          | -                                         | callback function on `text` changed<br>you will use this like<br>`onChangeText={(text) => this.setState({ text })}` |
| `decoration`         | `Decoration`                             | optional          | see [Decoration](#Decoration)             | settings of decorations<br>details: [Decoration](#Decoration)                                                       |
| `bracketLinkProps`   | `BracketLinkProps`                       | optional          | see [BracketLinkProps](#BracketLinkProps) | settings of bracket links<br>details: [BracketLinkProps](#BracketLinkProps)                                         |
| `hashTagProps`       | `HashTagProps`                           | optional          | see [HashTagProps](#HashTagProps)         | settings of hash tags<br>details: [BracketLinkProps](#HashTagProps)                                                 |
| `taggedLinkPropsMap` | `{ [tagName: string]: TaggedLinkProps }` | optional          | see [TaggedLinkProps](#TaggedLinkProps)   | key-value object which maps a tag name to settings of tagged links<br>details: [TaggedLinkProps](#TaggedLinkProps)  |
| `disabled`           | `boolean`                                | optional          | `undefined` (falsy)                       | if `true`, make `text` uneditable                                                                                   |
| `style`              | `CSSProperties`                          | optional          | `undefined`                               | style of `Editor`                                                                                                   |

### Decoration

settings of decorations

```ts
interface Decoration {
  text?: TextDecoration;
  suggestionList?: SuggestionListDecoration;
}
```

#### Decoration.text: TextDecoration

settings of text decorations (optional)

```ts
interface TextDecoration {
  fontSizes: {
    level1: number;
    level2: number;
    level3: number;
  };
}
```

**Attributes**

- fontSizes
  - level1: font size \[px\] of normal-sized text
  - level2: font size \[px\] of larger-sized text  
    c.f. `[** larger]`
  - level3: font size \[px\] of largest-sized text  
    c.f. `[*** largest]`

**Default**

```ts
const defaultTextDecoration: TextDecoration = {
  fontSizes: {
    level1: 16,
    level2: 20,
    level3: 24,
  },
};
```

you can import `defaultTextDecoration` by adding

```ts
import { defaultTextDecoration } from "react-realtime-markup-editor";
```

#### Decoration.suggestionList: SuggestionListDecoration

settings of link suggestion list (optional)

```ts
interface SuggestionListDecoration {
  width: number;
  maxHeight: number;
  fontSize: number;
}
```

**Attributes**

- width: width \[px\] of suggestion list
- maxHeight: maximum height \[px\] of suggestion list  
  If many suggestions are provided, the list will be scrollable
- fontSize: font size \[px\] of suggestions

**Default**

```ts
const defaultSuggestionListDecoration: SuggestionListDecoration = {
  width: 250,
  maxHeight: 100,
  fontSize: 14,
};
```

you can import `defaultSuggestionListDecoration` by adding

```ts
import { defaultSuggestionListDecoration } from "react-realtime-markup-editor";
```

### BracketLinkProps

settings of bracket links

```ts
interface BracketLinkProps {
  anchorProps?: (linkName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
  suggestions?: string[];
  initialSuggestionIndex?: number;
  disabled?: boolean;
}
```

**Attributes**

- anchorProps: given `linkName`, this function returns props of `<a>` tag  
  default: `(linkName: string) => ({ style: defaultLinkStyle })`
- suggestions: input suggestions of bracket links  
  default: `[]`
- initialSuggestionIndex: index of focusd suggestion when showing the suggestion list  
  default: `0`
- disabled: if `true`, bracket links behave in the same way as plain texts  
  default: `undefined` (falsy)

**Default**

```ts
const defaultLinkStyle: React.CSSProperties = {
  color: "#5E8AF7",
  textDecoration: "none",
  cursor: "pointer",
};
```

you can import `defaultLinkStyle` by adding

```ts
import { defaultLinkStyle } from "react-realtime-markup-editor";
```

### HashTagProps

settings of hash tags

```ts
interface HashTagProps {
  anchorProps?: (hashTagName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
  suggestions?: string[];
  initialSuggestionIndex?: number;
  disabled?: boolean;
}
```

same as `BracketLinkProps`

### TaggedLinkProps

settings of tagged links

```ts
interface TaggedLinkProps {
  linkNameRegex?: RegExp;
  anchorProps?: (linkName: string) => React.AnchorHTMLAttributes<HTMLAnchorElement>;
  suggestions?: string[];
  initialSuggestionIndex?: number;
  tagHidden?: boolean;
}
```

same as `BracketLinkProps` except `linkNameRegex`

**Attributes**

- linkNameRegex: regular expression of link names. This must be a subset of `defaultLinkNameRegex = /[^[\]]+/`  
  If `linkName` does not match the pattern, `[tag: ${linkName}]` will be a BRACKET LINK whose link name is `"tag: ${linkName}"`  
  default: `defaultLinkNameRegex`

**Default**

```ts
const defaultLinkNameRegex = /[^[\]]+/;
```

you can import `defaultLinkNameRegex` by adding

```ts
import { defaultLinkNameRegex } from "react-realtime-markup-editor";
```
