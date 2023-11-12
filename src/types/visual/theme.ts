export type BaseTheme = {
  fontFamily: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  cursorColor: string;
  selectionColor: string;
  dividerColor: string;
};

export type DecorationTheme = {
  fontSize: number | string;
  lineHeight: number | string;
};

export type LinkTheme = {
  color: string;
  clickableColor: string;
};

export type MonospaceTheme = {
  fontFamily: string;
  backgroundColor: string;
};

export type QuotationTheme = {
  color: string;
  backgroundColor: string;
  markColor: string;
};

export type ListTheme = {
  borderColor: string;
  backgroundColor: string;
  shadowColor: string;
};

export type ListItemTheme = DecorationTheme & {
  unselectedColor: string;
  unselectedBackgroundColor: string;
  unselectedHoverBackgroundColor: string;
  selectedColor: string;
  selectedBackgroundColor: string;
  selectedHoverBackgroundColor: string;
  disabledColor: string;
  disabledBackgroundColor: string;
  dividerColor: string;
};

export type IconButtonTheme = {
  unselectedIconColor: string;
  unselectedBackgroundColor: string;
  unselectedHoverBackgroundColor: string;
  selectedIconColor: string;
  selectedBackgroundColor: string;
  selectedHoverBackgroundColor: string;
  disabledIconColor: string;
  disabledBackgroundColor: string;
  borderColor: string;
};
