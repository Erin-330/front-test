export interface LoginFormValues {
  email: string
  password: string
}

export interface LoginFormErrors {
  email?: string
  password?: string
  form?: string
}

export interface LoginProps {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void
}
