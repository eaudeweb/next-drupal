import * as yup from 'yup'

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

const defaultTextValidation = ({ name, required }) => {
  let validation = yup.string()
  if (required) {
    validation = validation.required(`${capitalize(name)} is required`)
  }
  return validation
}

// Validations mapping
export const validationsMapping = {
  type: {
    captcha: () => {
      return yup.string().required('Captcha verification is required')
    },
    email: ({ name, required }) => {
      let validation = yup.string().email('Must be a valid email')
      if (required) {
        validation = validation.required(`${capitalize(name)} is required`)
      }
      return validation
    },
    text: defaultTextValidation,
    textarea: defaultTextValidation,
    textfield: defaultTextValidation,
  },
}
