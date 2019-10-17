export type xtal_text_input_md = 'xtal-text-input-md';
export type xtal_email_input_md = 'xtal-email-input-md';

export interface IXtalInputOptions {
  data: any[];
  textFld: string;
  keyFld: string;
}

export interface IXtalInputProperties {
  value: string;
  options: IXtalInputOptions;
}
