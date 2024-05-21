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

const emailValidation = ({ name, required }) => {
  let validation = yup.string().email('Must be a valid email')
  if (required) {
    validation = validation.required(`${capitalize(name)} is required`)
  }
  return validation
}

const friendlycaptchaValidation = () => {
  return yup
    .string()
    .test('captcha', 'Captcha verification is invalid', async (solution) => {
      if (process.env.NODE_ENV === 'development') {
        return true
      }
      const body = new FormData()
      body.append(
        'secret',
        process.env.NEXT_PUBLIC_FRIENDLYCAPTCHA_SECRET || '',
      )
      body.append(
        'sitekey',
        process.env.NEXT_PUBLIC_FRIENDLYCAPTCHA_SITEKEY || '',
      )
      body.append('solution', solution || '')

      try {
        const response = await fetch(
          'https://api.friendlycaptcha.com/api/v1/siteverify',
          {
            body,
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          },
        )
        const result: any = await response.text()
        if (result?.success) {
          return true
        }
        return false
      } catch (e) {
        return false
      }
    })
    .required('Captcha verification is required')
}

// Validations mapping
export const validationsMapping = {
  type: {
    email: emailValidation,
    headless_captcha: friendlycaptchaValidation,
    text: defaultTextValidation,
    textarea: defaultTextValidation,
    textfield: defaultTextValidation,
  },
}
