/*
 * Copyright 2024 Salto Labs Ltd.
 * Licensed under the Salto Terms of Use (the "License");
 * You may not use this file except in compliance with the License.  You may obtain a copy of the License at https://www.salto.io/terms-of-use
 *
 * CERTAIN THIRD PARTY SOFTWARE MAY BE CONTAINED IN PORTIONS OF THE SOFTWARE. See NOTICE FILE AT https://github.com/salto-io/salto/blob/main/NOTICES
 */
import { isInstanceElement, ReferenceExpression } from '@salto-io/adapter-api'
import { naclCase } from '@salto-io/adapter-utils'
import { values } from '@salto-io/lowerdash'
import { LocalFilterCreator } from '../filter'
import { GLOBAL_VALUE_SET } from './global_value_sets'
import { STANDARD_VALUE_SET } from './standard_value_sets'
import { ORDERED_MAP_VALUES_FIELD } from './convert_maps'

const { isDefined } = values

/**
 * This filter remodels picklists to allow references to their values, and adds such references to referencing fields.
 * TODO: maybe rename to "picklist_value_set_references"?
 */
const filterCreator: LocalFilterCreator = () => ({
  name: 'picklistReferences',
  onFetch: async elements => {
    // Find record types with picklist fields and convert them to reference expressions
    const recordTypes = elements.filter(isInstanceElement).filter(objectType => objectType.elemID.typeName === 'RecordType')
    const picklistValuesItem = recordTypes.flatMap(rt => rt.value.picklistValues).filter(isDefined)
    picklistValuesItem.forEach(picklistValues => {
      const picklistRef: ReferenceExpression = picklistValues.picklist?.value?.annotations?.valueSetName ?? picklistValues.picklist
      picklistValues.values = picklistValues.values.map((value: { fullName: string | undefined }) => {
        if (value.fullName === undefined) {
          throw new Error('Failed to find value name')
        }
        const valueName = naclCase(decodeURIComponent(value.fullName))
        if (picklistRef.elemID.typeName === GLOBAL_VALUE_SET) {
          return new ReferenceExpression(picklistRef.elemID.createNestedID('customValue', ORDERED_MAP_VALUES_FIELD, valueName))
        }
        if (picklistRef.elemID.typeName === STANDARD_VALUE_SET) {
          return new ReferenceExpression(picklistRef.elemID.createNestedID('standardValue', ORDERED_MAP_VALUES_FIELD, valueName))
        }
        return new ReferenceExpression(picklistRef.elemID.createNestedID('valueSet', ORDERED_MAP_VALUES_FIELD, valueName))
      })
    })
  }
})

export default filterCreator
