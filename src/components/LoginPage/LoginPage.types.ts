export interface LoginFormValues {
  email: string
  password: string
}

export interface LoginPageProps {
  onSubmit?: (values: LoginFormValues) => void | Promise<void>
  onSignUpClick?: () => void
  onForgotPasswordClick?: () => void
}
