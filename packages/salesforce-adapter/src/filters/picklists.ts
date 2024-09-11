/*
 * Copyright 2024 Salto Labs Ltd.
 * Licensed under the Salto Terms of Use (the "License");
 * You may not use this file except in compliance with the License.  You may obtain a copy of the License at https://www.salto.io/terms-of-use
 *
 * CERTAIN THIRD PARTY SOFTWARE MAY BE CONTAINED IN PORTIONS OF THE SOFTWARE. See NOTICE FILE AT https://github.com/salto-io/salto/blob/main/NOTICES
 */
import { isInstanceElement, ReferenceExpression } from '@salto-io/adapter-api'
import { naclCase } from '@salto-io/adapter-utils'
import { LocalFilterCreator } from '../filter'

/**
  * This filter remodels picklists to allow references to their values, and adds such references to referencing fields.
 * TODO: maybe rename to "picklist_value_set_references"?
 */
const filterCreator: LocalFilterCreator = () => ({
  name: 'picklists',
  onFetch: async elements => {
    return
    // Find record types with picklist fields and convert them to reference expressions
    const recordTypes = elements.filter(isInstanceElement).filter(objectType => objectType.elemID.typeName === 'RecordType')
    const picklistValuesItem = recordTypes.flatMap(rt => rt.value.picklistValues)
    picklistValuesItem.forEach(picklistValues => {
      const picklistRef: ReferenceExpression = picklistValues.picklist
      picklistValues.values = picklistValues.values.map((value: { fullName: string | undefined }) => {
        if (picklistRef.elemID.typeName === 'GlobalValueSet') {
          return new ReferenceExpression(picklistRef.elemID.createNestedID('customValue', naclCase(value.fullName)))
        }
        if (picklistRef.elemID.typeName === 'StandardValueSet') {
          return new ReferenceExpression(picklistRef.elemID.createNestedID('standardValue', naclCase(value.fullName)))
        }
        return new ReferenceExpression(picklistRef.elemID.createNestedID('valueSet', naclCase(value.fullName)))
      })
    })
  }
})

export default filterCreator
