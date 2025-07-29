declare module 'react-quill' {
  import { Component } from 'react';

  export interface ReactQuillProps {
    theme?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    modules?: any;
    formats?: string[];
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    onChangeSelection?: (selection: any, source: string, editor: any) => void;
    onFocus?: (selection: any, source: string, editor: any) => void;
    onBlur?: (previousSelection: any, source: string, editor: any) => void;
    onKeyPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    tabIndex?: number;
    className?: string;
    style?: React.CSSProperties;
    preserveWhitespace?: boolean;
  }

  export default class ReactQuill extends Component<ReactQuillProps> {
    getEditor(): any;
    getEditingArea(): HTMLElement;
    focus(): void;
    blur(): void;
  }
}

declare module 'react-quill/dist/quill.snow.css';
