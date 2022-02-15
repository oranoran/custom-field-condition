import React, {
  useCallback,
  useState,
  useEffect,
  FunctionComponent,
} from 'react'
import styled from 'styled-components'
import { useField } from 'payload/components/forms'
import { Field } from 'payload/types'
import Editor from 'rich-markdown-editor'

// Make sure to never re-render the editor, since it tracks the value on its own.
const MemorizedEditor = React.memo(Editor, (prev, next) => prev.id === next.id)

type FieldWithPath = Field & { path?: string }
type WhichEditor = 'blank' | 'non-blank'

const StyledMarkdownField = styled.div`
  > .field-label {
    padding-bottom: 0.4807692308rem;
  }

  > .field-type {
    min-height: 80px;
    border: 1px solid #dadada;
    padding: 10px 30px;
  }

  &.error {
    > .field-type {
      background-color: rgba(255, 111, 118, 0.1);
      p {
        background-color: rgba(255, 111, 118, 0.1);
      }
    }
  }
`

export const MarkdownField: FunctionComponent<FieldWithPath> = (
  props: FieldWithPath
) => {
  const { label, path, admin } = props
  const { value, setValue, errorMessage, showError } = useField<string>({
    path,
  })
  const [origValue, setOrigValue] = useState(value)
  const [edited, setEdited] = useState(false)
  const [whichEditor, setWhichEditor] = useState<WhichEditor>(
    value && value !== '\n' ? 'non-blank' : 'blank' // the value starts out as undefined for optional fields, or a line break for required fields
  )

  useEffect(() => {
    if (!edited && value) {
      setWhichEditor('non-blank')
      setOrigValue(value.trim().replace(/\r\n/g, '\n'))
    }
  }, [value, edited])

  const onChange = useCallback(
    (getValue) => {
      const newValue = getValue().replace(/^\s*\\/gm, '')
      if (newValue) {
        setEdited(true)
      }
      const trimmedNewValue = newValue.trim().replace(/\r\n/g, '\n')
      const modified =
        trimmedNewValue !== origValue &&
        (Boolean(trimmedNewValue) || Boolean(origValue))
      setValue(newValue, modified)
    },
    [path, edited, origValue]
  )

  return (
    <StyledMarkdownField
      className={`field-type text${showError ? ' error' : ''}`}
    >
      {errorMessage && (
        <aside className="tooltip field-error">
          {errorMessage}
          <span></span>
        </aside>
      )}
      <div className="field-label">{label}</div>
      <div style={(admin as any)?.style ?? {}} className="field-type markdown">
        {whichEditor === 'blank' && (
          <MemorizedEditor
            id={`markdown-new-field-${path.replace(/\W/g, '-')}`}
            defaultValue={value}
            onChange={onChange}
            placeholder="Write something here..."
          />
        )}
        {whichEditor === 'non-blank' && (
          <MemorizedEditor
            id={`markdown-field-${path.replace(/\W/g, '-')}`}
            defaultValue={value}
            onChange={onChange}
            placeholder="Write something here..."
          />
        )}
      </div>
    </StyledMarkdownField>
  )
}
