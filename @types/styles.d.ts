declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export default classNames;
}

declare module '*.sass' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export default classNames;
}

declare module '*.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export default classNames;
}
