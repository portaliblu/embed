import {
  getFormHeightChangedHandler,
  getFormQuestionChangedHandler,
  getFormReadyHandler,
  getFormSubmitHandler,
  getThankYouScreenButtonClickHandler,
  getWelcomeScreenHiddenHandler,
} from './get-form-event-handler'

describe('get-form-event-handler', () => {
  const embedId = 'foobar'
  const data = { foo: 'bar', bar: 'foo' }
  const spy = jest.fn()

  beforeEach(() => {
    spy.mockReset()
  })

  describe('#getFormReadyHandler', () => {
    const handler = getFormReadyHandler(embedId, spy)

    it('should call the callback function', () => {
      handler({ data: { type: 'form-ready', embedId, ...data } })
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(data)
    })

    it('should not call the callback function for mismatched embed id', () => {
      handler({ data: { type: 'form-ready', embedId: 'other', ...data } })
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should not call the callback function for different event type', () => {
      handler({ data: { type: 'form-submit', embedId, ...data } })
      expect(spy).toHaveBeenCalledTimes(0)
    })
  })

  describe('#getFormQuestionChangedHandler', () => {
    const handler = getFormQuestionChangedHandler(embedId, spy)

    it('should call the callback function', () => {
      handler({ data: { type: 'form-screen-changed', embedId, ...data } })
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(data)
    })

    it('should not call the callback function for mismatched embed id', () => {
      handler({ data: { type: 'form-screen-changed', embedId: 'other', ...data } })
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should not call the callback function for different event type', () => {
      handler({ data: { type: 'form-submit', embedId, ...data } })
      expect(spy).toHaveBeenCalledTimes(0)
    })
  })

  describe('#getFormHeightChangedHandler', () => {
    const handler = getFormHeightChangedHandler(embedId, spy)

    it('should call the callback function', () => {
      handler({ data: { type: 'form-height-changed', embedId, ...data } })
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(data)
    })

    it('should not call the callback function for mismatched embed id', () => {
      handler({ data: { type: 'form-height-changed', embedId: 'other', ...data } })
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should not call the callback function for different event type', () => {
      handler({ data: { type: 'form-screen-changed', embedId, ...data } })
      expect(spy).toHaveBeenCalledTimes(0)
    })
  })

  describe('#getFormSubmitHandler', () => {
    const handler = getFormSubmitHandler(embedId, spy)

    it('should call the callback function', () => {
      handler({ data: { type: 'form-submit', embedId, ...data } })
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(data)
    })

    it('should not call the callback function for mismatched embed id', () => {
      handler({ data: { type: 'form-submit', embedId: 'other', ...data } })
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should not call the callback function for different event type', () => {
      handler({ data: { type: 'form-ready', embedId, ...data } })
      expect(spy).toHaveBeenCalledTimes(0)
    })
  })

  describe('#getWelcomeScreenHiddenHandler', () => {
    const element = document.createElement('div')
    const handler = getWelcomeScreenHiddenHandler(embedId, element)

    beforeEach(() => {
      element.className = ''
    })

    it('should add class to the element', () => {
      handler({ data: { type: 'welcome-screen-hidden', embedId, ...data } })
      expect(element.className).toBe('tf-v1-widget-fullscreen')
    })

    it('should not add class to the element for mismatched embed id', () => {
      handler({ data: { type: 'form-submit', embedId: 'other', ...data } })
      expect(element.className).toBe('')
    })

    it('should not add class to the element for different event type', () => {
      handler({ data: { type: 'form-ready', embedId, ...data } })
      expect(element.className).toBe('')
    })
  })

  describe('#getThankYouScreenButtonClickHandler', () => {
    const handler = getThankYouScreenButtonClickHandler(embedId, spy)

    it('should call the callback function', () => {
      handler({ data: { type: 'thank-you-screen-button-click', embedId } })
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})
