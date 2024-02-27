type AllowedInputTypes = "password" | "text" | "number" | "tel";

type InputProps = Required<
  Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "value"
    | "onChange"
    | "onFocus"
    | "onBlur"
    | "onKeyDown"
    | "onPaste"
    | "aria-label"
    | "maxLength"
    | "autoComplete"
    | "style"
    | "inputMode"
    | "onInput"
  > & {
    ref: React.RefCallback<HTMLInputElement>;
    placeholder: string | undefined;
    className: string | undefined;
    type: AllowedInputTypes;
  }
>;

export interface NativeEvent {
  data: string | null;
  inputType: string;
}

export interface OTPInputProps {
  /** Value of the OTP input */
  value?: string;
  /** Number of OTP inputs to be rendered */
  numInputs?: number;
  /** Whether the first input should be auto focused */
  shouldAutoFocus?: boolean;
  /** Function to render the separator */
  renderSeparator?: ((index: number) => React.ReactNode) | React.ReactNode;
  /** Style for the container */
  containerStyle?: React.CSSProperties | string;
  /** Style for the input */
  inputStyle?: React.CSSProperties | string;
  /** The type that will be passed to the input being rendered */
  inputType?: AllowedInputTypes;
  /** Callback to be called when the OTP value changes */
  onChange: (otp: string, activeInput: number) => void;
  /** Function to render the input */
  renderInput: (inputProps: InputProps, index: number) => React.ReactNode;
}
