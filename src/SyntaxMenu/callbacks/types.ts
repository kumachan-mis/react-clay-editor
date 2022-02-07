// eslint-disable-next-line @typescript-eslint/ban-types
export type MenuHandler<MenuProps = {}> = Required<Omit<MenuProps, 'disabled'>> & { syntax?: 'bracket' | 'markdown' };
