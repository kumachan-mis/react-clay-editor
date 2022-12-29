# react-realtime-markup-editor

A document editor which reflects syntactic formatting in real time

- The document editor is inspired by [Scrapbox](https://scrapbox.io/product)
- Icons made from [Icon Fonts](http://www.onlinewebfonts.com/icon) is licensed by CC BY 3.0

## TL;DR

### Installation

```sh
npm install katex
npm install react-realtime-markup-editor
```

or

```sh
yarn add katex
yarn add react-realtime-markup-editor
```

### Simplest Usage

To Be Updated...

### Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               |

### Demo

[demo](https://kumachan-mis.github.io/react-realtime-markup-editor) on github pages

## Formatting Syntax

### Itemizations

#### bracket-based syntax

| style         | syntax  |
| ------------- | ------- |
| <li>item</li> | `␣item` |

#### markdown-like syntax

| style         | syntax   |
| ------------- | -------- |
| <li>item</li> | `- item` |
| <li>item</li> | `* item` |

**Note**  
Multiple spaces will provide nested itemizations.

### Text Decorations

#### bracket-based syntax

| style            | syntax          |
| ---------------- | --------------- |
| <b>normal</b>    | `[* normal]`    |
| <h3>larger</h3>  | `[** larger]`   |
| <h2>largest</h2> | `[*** largest]` |
| <b>bold</b>      | `[* bold]`      |
| <i>italic</i>    | `[/ italic]`    |
| <u>underline</u> | `[_ underline]` |

**Note**  
Combinations of `*`, `/` and `_` are available.  
Here are some examples:

| style                          | syntax                                             |
| ------------------------------ | -------------------------------------------------- |
| <b><i>bold italic</i></b>      | `[*/ bold italic]` or `[/* bold italic]`           |
| <b><u>bold underline</u></b>   | `[*_ bold underline]` or `[_* bold underline]`     |
| <i><u>italic underline</u></i> | `[/_ italic underline]` or `[_/ italic underline]` |

#### markdown-like syntax

| style            | syntax       |
| ---------------- | ------------ |
| <b>normal</b>    | `### normal` |
| <h3>larger</h3>  | `## larger`  |
| <h2>largest</h2> | `# largest`  |
| <b>bold</b>      | `*bold*`     |
| <i>italic</i>    | `_italic_`   |

**Note**  
Combinations of `*` and `_` are NOT available yet...

### Links

| style                   | syntax               |
| ----------------------- | -------------------- |
| <a>blacket link</a>     | `[blacket link]`     |
| <a>tag: tagged link</a> | `[tag: tagged link]` |
| <a>#hashtag</a>         | `#hashtag`           |

**Note**

1. A space(`␣`) in a hashtag name will get converted to an underscore(`_`)

2. Tagged links are useful when you want to make some link groups  
   Here are some examples:

- Can make `[github: @user_name/repository_name]` go to

```html
<a href="https://github.com/user_name/repository_name"> @user_name/repository_name </a>
```

- Can make `[npm: package_name]` go to

```html
<a href="https://www.npmjs.com/package/package_name"> package_name </a>
```

3. Can show input suggestions of links  
   For example, you can provide users with webpage list which may be refered from the document

### Code Strings

#### inline code string

- style  
  `inline code string`
- syntax  
  `` `inline code string` ``

#### block code string

- style
  ```
  block code string
  ```
- syntax
  ````
  ```
  block code string
  ```
  ````

### Math Formulas

### inline math formula

- style  
  ![inline-mode](figures/inline-mode.png)
- syntax  
  `$\int_a^b f(x) \mathrm{d}x$`

### display math formula

- style  
  ![display-mode](figures/display-mode.png)
- syntax  
  `$$\int_a^b f(x) \mathrm{d}x$$`

### block math formula

- style  
  ![block-mode](figures/block-mode.png)
- syntax
  ```
  $$
  A =
  \left(
  \begin{matrix}
    a_{11} & a_{12} & \cdots & a_{1n} \\
    a_{21} & a_{22} & \cdots & a_{2n} \\
    \vdots & \vdots & \ddots & \vdots \\
    a_{m1} & a_{m2} & \cdots & a_{mn} \\
  \end{matrix}
  \right)
  $$
  ```

### Quotations

- style
  > quotation
- syntax  
   `> quotation`

**Note**  
Multiple spaces will provide nested quotations.

## Public API

To Be Updated...
