import ActionWidget from '../components/utils/Widgets/ActionWidget'
import CaptchaWidget from '../components/utils/Widgets/CaptchaWidget'
import EmailWidget from '../components/utils/Widgets/EmailWidget'
import TextareaWidget from '../components/utils/Widgets/TextareaWidget'
import TextWidget from '../components/utils/Widgets/TextWidget'

// Default Widget
export const defaultWidget = TextWidget

// Widgets mapping
export const widgetsMapping = {
  type: {
    email: EmailWidget,
    headless_captcha: CaptchaWidget,
    text: defaultWidget,
    textarea: TextareaWidget,
    textfield: defaultWidget,
    webform_actions: ActionWidget,
  },
}
