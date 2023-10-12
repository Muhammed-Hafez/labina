// $$$ Ahmed Ouda $$$
interface IFormFieldValidators {
	required?: boolean;
	min?: number;
	max?: number;
	pattern?: RegExp;
	minlength?: number;
	maxlength?: number;
}

interface IFormFieldErrors {
	[key: string]: {
		valid: boolean;
		message: string;
	};
}

export interface IFormField {
	name: string;
	type: 'text' | 'password' | 'checkbox' | 'radio' | 'number' | 'date';
	value: string | number;
	label?: string;
	dirty?: boolean;
	touched?: boolean;
	invalid?: boolean;
	validators?: IFormFieldValidators;
	errors?: IFormFieldErrors;
}

export interface IForm {
	valid?: boolean;
	dirty?: boolean;
	submitted?: boolean;
	fields: {
		[key: string]: IFormField;
	};
}
