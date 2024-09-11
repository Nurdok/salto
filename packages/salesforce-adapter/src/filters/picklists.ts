/*
 * Copyright 2024 Salto Labs Ltd.
 * Licensed under the Salto Terms of Use (the "License");
 * You may not use this file except in compliance with the License.  You may obtain a copy of the License at https://www.salto.io/terms-of-use
 *
 * CERTAIN THIRD PARTY SOFTWARE MAY BE CONTAINED IN PORTIONS OF THE SOFTWARE. See NOTICE FILE AT https://github.com/salto-io/salto/blob/main/NOTICES
 */
import { LocalFilterCreator } from '../filter'
import { isObjectType, ReferenceExpression } from '@salto-io/adapter-api'
import { naclCase } from '@salto-io/adapter-utils'

/**
  * This filter remodels picklists to allow references to their values, and adds such references to referencing fields.
 * TODO: maybe rename to "picklist_value_set_references"?
 */
const filterCreator: LocalFilterCreator = () => ({
  name: 'picklists',
  onFetch: async elements => {
    // Find record types with picklist fields and convert them to reference expressions
    const recordTypes = elements.filter(isObjectType).filter(objectType => objectType.elemID.typeName === 'RecordType')
    const picklistValuesItem = recordTypes.flatMap(rt => rt.annotations.picklistValues)
    picklistValuesItem.forEach(picklistValues => {
      const picklistRef: ReferenceExpression = picklistValues.picklist
      picklistValues.values = picklistValues.values.map(value => {
        return picklistRef.elemID.createNestedID(naclCase(value.fullName))
      })
    })
  }
})

export default filterCreator
