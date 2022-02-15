import { CollectionConfig } from 'payload/types'
import { MarkdownField } from '../custom-fields/markdown'

const Todo: CollectionConfig = {
  slug: 'todos',
  admin: {
    defaultColumns: ['listName', 'tasks', 'updatedAt'],
    useAsTitle: 'listName',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    { name: 'builtInField', type: 'text', admin: { condition } },
    {
      name: 'customField',
      type: 'text',
      admin: {
        condition,
        components: { Field: MarkdownField },
      },
    },
  ],
}

function condition(data, siblings) {
  // console.log('data', JSON.stringify(data), 'siblings', JSON.stringify(siblings))
  return Boolean(siblings.name)
}

export default Todo
