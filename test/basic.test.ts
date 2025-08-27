import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Form, FormBuilder } from '../src/index'

describe('Basic Functionality', () => {
  let wrapper: VueWrapper<any>
  
  const testForm = {
    display: 'form' as const,
    components: [
      {
        input: false,
        columns: [
          {
            components: [
              {
                tabindex: 1,
                tags: [],
                clearOnHide: true,
                hidden: false,
                input: true,
                tableView: true,
                inputType: 'text',
                inputMask: '',
                label: 'First Name',
                key: 'firstName',
                placeholder: 'Enter your first name',
                prefix: '',
                suffix: '',
                multiple: false,
                defaultValue: '',
                protected: false,
                unique: false,
                persistent: true,
                validate: {
                  required: false,
                  minLength: '',
                  maxLength: '',
                  pattern: '',
                  custom: '',
                  customPrivate: false
                },
                conditional: {
                  show: '',
                  when: null,
                  eq: ''
                },
                type: 'textfield',
                autofocus: false,
                spellcheck: true
              },
              {
                tabindex: 3,
                tags: [],
                clearOnHide: true,
                hidden: false,
                input: true,
                tableView: true,
                inputType: 'email',
                label: 'Email',
                key: 'email',
                placeholder: 'Enter your email address',
                prefix: '',
                suffix: '',
                defaultValue: '',
                protected: false,
                unique: false,
                persistent: true,
                type: 'email',
                conditional: {
                  show: '',
                  when: null,
                  eq: ''
                },
                kickbox: {
                  enabled: false
                },
                autofocus: false
              }
            ],
            width: 6,
            offset: 0,
            push: 0,
            pull: 0
          },
          {
            components: [
              {
                tabindex: 2,
                tags: [],
                clearOnHide: true,
                hidden: false,
                input: true,
                tableView: true,
                inputType: 'text',
                inputMask: '',
                label: 'Last Name',
                key: 'lastName',
                placeholder: 'Enter your last name',
                prefix: '',
                suffix: '',
                multiple: false,
                defaultValue: '',
                protected: false,
                unique: false,
                persistent: true,
                validate: {
                  required: false,
                  minLength: '',
                  maxLength: '',
                  pattern: '',
                  custom: '',
                  customPrivate: false
                },
                conditional: {
                  show: '',
                  when: null,
                  eq: ''
                },
                type: 'textfield',
                autofocus: false,
                spellcheck: true
              },
              {
                tabindex: 4,
                tags: [],
                clearOnHide: true,
                hidden: false,
                input: true,
                tableView: true,
                inputMask: '(999) 999-9999',
                label: 'Phone Number',
                key: 'phoneNumber',
                placeholder: 'Enter your phone number',
                prefix: '',
                suffix: '',
                multiple: false,
                protected: false,
                unique: false,
                persistent: true,
                defaultValue: '',
                validate: {
                  required: false
                },
                type: 'phoneNumber',
                conditional: {
                  show: '',
                  when: null,
                  eq: ''
                },
                autofocus: false,
                inputType: 'tel'
              }
            ],
            width: 6,
            offset: 0,
            push: 0,
            pull: 0
          }
        ],
        type: 'columns',
        key: 'columns1',
        conditional: {
          show: '',
          when: null,
          eq: ''
        },
        clearOnHide: false,
        label: 'Columns',
        hideLabel: true,
        tableView: false
      },
      {
        tabindex: 6,
        conditional: {
          eq: '',
          when: null,
          show: ''
        },
        tags: [],
        input: true,
        label: 'Submit',
        tableView: false,
        key: 'submit',
        size: 'md',
        leftIcon: '',
        rightIcon: '',
        block: false,
        action: 'submit',
        disableOnInvalid: true,
        theme: 'primary',
        type: 'button',
        autofocus: false
      }
    ]
  }

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Form Component', () => {
    it('Should render a form', async () => {
      expect(() => {
        wrapper = mount(Form, {
          props: { form: testForm }
        })
      }).not.toThrow()

      await nextTick()

      expect(wrapper.vm).toBeTruthy()
      expect(wrapper.find('div').exists()).toBe(true)

      expect(wrapper.props('form')).toBeDefined()
      expect(wrapper.props('form').display).toBe('form')
      expect(wrapper.props('form').components).toHaveLength(2)

      const formSchema = wrapper.props('form')
      const componentTypes = formSchema.components.map((comp: any) => comp.type)
      expect(componentTypes).toContain('columns')
      expect(componentTypes).toContain('button')

      // Columns component validation
      const columnsComponent = formSchema.components.find((comp: any) => comp.type === 'columns')
      expect(columnsComponent).toBeDefined()
      expect(columnsComponent.columns).toHaveLength(2)

      // First column validation
      const firstColumnFields = columnsComponent.columns[0].components
      const firstColumnKeys = firstColumnFields.map((field: any) => field.key)
      expect(firstColumnKeys).toEqual(['firstName', 'email'])

      // Second column validation
      const secondColumnFields = columnsComponent.columns[1].components
      const secondColumnKeys = secondColumnFields.map((field: any) => field.key)
      expect(secondColumnKeys).toEqual(['lastName', 'phoneNumber'])

      // Submit button validation
      const submitButton = formSchema.components.find((comp: any) => comp.type === 'button')
      expect(submitButton).toBeDefined()
      expect(submitButton.action).toBe('submit')
      expect(submitButton.theme).toBe('primary')
      expect(submitButton.key).toBe('submit')

      // Field-specific validation
      const firstNameField = firstColumnFields.find((field: any) => field.key === 'firstName')
      expect(firstNameField.type).toBe('textfield')
      expect(firstNameField.placeholder).toBe('Enter your first name')

      const emailField = firstColumnFields.find((field: any) => field.key === 'email')
      expect(emailField.type).toBe('email')
      expect(emailField.placeholder).toBe('Enter your email address')

      const phoneField = secondColumnFields.find((field: any) => field.key === 'phoneNumber')
      expect(phoneField.inputMask).toBe('(999) 999-9999')
      expect(phoneField.inputType).toBe('tel')
    })

    it('Should handle props correctly', async () => {
      const submissionData = {
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '(555) 123-4567',
          submit: true
        }
      }

      wrapper = mount(Form, {
        props: {
          form: testForm,
          submission: submissionData
        }
      })

      await nextTick()

      expect(wrapper.props('form')).toEqual(testForm)
      expect(wrapper.props('submission')).toEqual(submissionData)
      
      const formData = wrapper.props('submission').data
      expect(formData.firstName).toBe('John')
      expect(formData.lastName).toBe('Doe')
      expect(formData.email).toBe('john.doe@example.com')
      expect(formData.phoneNumber).toBe('(555) 123-4567')
      expect(formData.submit).toBe(true)
    })

    it('Should accept event handler props without errors', async () => {
      const mockHandlers = {
        onSubmit: vi.fn(),
        onChange: vi.fn(),
        onError: vi.fn(),
        onFormLoad: vi.fn(),
        onRender: vi.fn(),
        onFocus: vi.fn(),
        onBlur: vi.fn(),
        onNextPage: vi.fn(),
        onPrevPage: vi.fn()
      }

      wrapper = mount(Form, {
        props: { 
          form: testForm,
          ...mockHandlers
        }
      })

      await nextTick()

      // Verify all handlers were passed as props
      Object.keys(mockHandlers).forEach(handlerName => {
        expect(wrapper.props(handlerName)).toBe(mockHandlers[handlerName])
      })
    })

    it('Should handle submission event props correctly', async () => {
      const submissionHandlers = {
        onSubmit: vi.fn(),
        onSubmitDone: vi.fn(),
        onSubmitError: vi.fn(),
        onCancelSubmit: vi.fn(),
        onBeforeSetSubmission: vi.fn()
      }

      wrapper = mount(Form, {
        props: {
          form: testForm,
          ...submissionHandlers
        }
      })

      await nextTick()

      expect(wrapper.props('onSubmit')).toBe(submissionHandlers.onSubmit)
      expect(wrapper.props('onSubmitDone')).toBe(submissionHandlers.onSubmitDone)
      expect(wrapper.props('onSubmitError')).toBe(submissionHandlers.onSubmitError)
      expect(wrapper.props('onCancelSubmit')).toBe(submissionHandlers.onCancelSubmit)
      expect(wrapper.props('onBeforeSetSubmission')).toBe(submissionHandlers.onBeforeSetSubmission)
    })

    it('Should handle form lifecycle event props', async () => {
      const lifecycleHandlers = {
        onFormLoad: vi.fn(),
        onInitialized: vi.fn(),
        onRender: vi.fn(),
        onAttach: vi.fn(),
        onBuild: vi.fn()
      }

      wrapper = mount(Form, {
        props: {
          form: testForm,
          ...lifecycleHandlers
        }
      })

      await nextTick()

      Object.keys(lifecycleHandlers).forEach(handlerName => {
        expect(wrapper.props(handlerName)).toBe(lifecycleHandlers[handlerName])
      })
    })

    it('Should handle component interaction events', async () => {
      const interactionHandlers = {
        onChange: vi.fn(),
        onComponentChange: vi.fn(),
        onFocus: vi.fn(),
        onBlur: vi.fn(),
        onCancelComponent: vi.fn(),
        onCustomEvent: vi.fn()
      }

      wrapper = mount(Form, {
        props: {
          form: testForm,
          ...interactionHandlers
        }
      })

      await nextTick()

      Object.keys(interactionHandlers).forEach(handlerName => {
        expect(wrapper.props(handlerName)).toBe(interactionHandlers[handlerName])
      })
    })

    it('Should handle navigation events', async () => {
      const navigationHandlers = {
        onNextPage: vi.fn(),
        onPrevPage: vi.fn(),
      }

      wrapper = mount(Form, {
        props: {
          form: testForm,
          ...navigationHandlers
        }
      })

      await nextTick()

      Object.keys(navigationHandlers).forEach(handlerName => {
        expect(wrapper.props(handlerName)).toBe(navigationHandlers[handlerName])
      })
    })

    it('Should handle draft events', async () => {
      const navigationHandlers = {
        onSaveDraft: vi.fn(),
        onSaveDraftBegin: vi.fn(),
        onRestoreDraft: vi.fn(),
      }

      wrapper = mount(Form, {
        props: {
          form: testForm,
          ...navigationHandlers
        }
      })

      await nextTick()

      Object.keys(navigationHandlers).forEach(handlerName => {
        expect(wrapper.props(handlerName)).toBe(navigationHandlers[handlerName])
      })
    })    
  })

  describe('FormBuilder Component', () => {
    it('Should render a FormBuilder', async () => {
      wrapper = mount(FormBuilder)

      await nextTick()

      expect(wrapper.vm).toBeTruthy()
      expect(wrapper.props('initialForm')).toEqual({ display: 'form', components: [] })
    })

    it('Should handle initialForm prop', async () => {
      wrapper = mount(FormBuilder, {
        props: { initialForm: testForm }
      })

      await nextTick()

      expect(wrapper.props('initialForm')).toEqual(testForm)
      expect(wrapper.props('initialForm').display).toBe('form')
      expect(wrapper.props('initialForm').components).toHaveLength(2)

      const components = wrapper.props('initialForm').components
      
      // Validate columns component structure
      const columnsComponent = components.find((comp: any) => comp.type === 'columns')
      expect(columnsComponent).toBeDefined()
      expect(columnsComponent.key).toBe('columns1')
      expect(columnsComponent.columns).toHaveLength(2)
      
      // Validate submit button structure  
      const submitButton = components.find((comp: any) => comp.type === 'button')
      expect(submitButton).toBeDefined()
      expect(submitButton.key).toBe('submit')
      expect(submitButton.action).toBe('submit')
    })

    it('Should accept builder event handlers', async () => {
      const builderHandlers = {
        onChange: vi.fn(),
        onSaveComponent: vi.fn(),
        onEditComponent: vi.fn(),
        onUpdateComponent: vi.fn(),
        onDeleteComponent: vi.fn(),
        onBuilderReady: vi.fn()
      }

      wrapper = mount(FormBuilder, {
        props: {
          initialForm: testForm,
          ...builderHandlers
        }
      })

      await nextTick()

      Object.keys(builderHandlers).forEach(handlerName => {
        expect(wrapper.props(handlerName)).toBe(builderHandlers[handlerName])
      })
    })
  })

  describe('Component Exports', () => {
    it('Should export Form and FormBuilder', () => {
      expect(Form).toBeDefined()
      expect(FormBuilder).toBeDefined()
      expect(typeof Form).toBe('object')
      expect(typeof FormBuilder).toBe('object')
    })

    it('Should export FormIO libraries', async () => {
      const { Components, Formio, Utils, Templates } = await import('../src/index')
      
      expect(Components).toBeDefined()
      expect(Formio).toBeDefined()
      expect(Utils).toBeDefined()
      expect(Templates).toBeDefined()
    })
  })
})