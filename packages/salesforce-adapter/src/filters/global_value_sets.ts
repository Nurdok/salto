/*
 * Copyright 2024 Salto Labs Ltd.
 * Licensed under the Salto Terms of Use (the "License");
 * You may not use this file except in compliance with the License.  You may obtain a copy of the License at https://www.salto.io/terms-of-use
 *
 * CERTAIN THIRD PARTY SOFTWARE MAY BE CONTAINED IN PORTIONS OF THE SOFTWARE. See NOTICE FILE AT https://github.com/salto-io/salto/blob/main/NOTICES
 */
import {
  Element,
  ObjectType,
  Field,
  ReferenceExpression,
  ElemID,
  isObjectType,
} from '@salto-io/adapter-api'
import { multiIndex } from '@salto-io/lowerdash'
import { LocalFilterCreator } from '../filter'
import { VALUE_SET_FIELDS } from '../constants'
import { apiName, isCustomObject } from '../transformers/transformer'
import { buildElementsSourceForFetch, isInstanceOfTypeSync } from './utils'

export const GLOBAL_VALUE_SET = 'GlobalValueSet'
export const CUSTOM_VALUE = 'customValue'
export const MASTER_LABEL = 'master_label'

const addGlobalValueSetRefToObject = (object: ObjectType, gvsToRef: multiIndex.Index<[string], ElemID>): void => {
  const getValueSetName = (field: Field): string | undefined => field.annotations[VALUE_SET_FIELDS.VALUE_SET_NAME]

  Object.values(object.fields).forEach(f => {
    const valueSetName = getValueSetName(f)
    if (valueSetName === undefined) {
      return
    }
    const valueSetId = gvsToRef.get(valueSetName)
    if (valueSetId) {
      f.annotations[VALUE_SET_FIELDS.VALUE_SET_NAME] = new ReferenceExpression(valueSetId)
    }
  })
}

/**
 * Create filter that adds global value set references where needed
 */
const filterCreator: LocalFilterCreator = ({ config }) => ({
  name: 'globalValueSetFilter',
  /**
   * @param elements the already fetched elements
   */
  onFetch: async (elements: Element[]): Promise<void> => {
    /*
    elements.filter(isInstanceOfTypeSync(GLOBAL_VALUE_SET)).forEach(gvsInstance => {
        const valueMap: Values = {}
        if (gvsInstance.value.customValue === undefined) {
          return
        }
        if (!Array.isArray(gvsInstance.value.customValue)) {
          gvsInstance.value.customValue = [gvsInstance.value.customValue]
        }
        gvsInstance.value.customValue.forEach((customValue: Value) => {
          valueMap[naclCase(customValue.fullName)] = customValue
        })
        gvsInstance.value.customValue = valueMap
        if (gvsInstance.refType.type?.fields?.customValue?.refType?.type !== undefined) {
          gvsInstance.refType.type.fields.customValue.refType.type = new MapType(
            gvsInstance.refType.type.fields.customValue.refType?.type)
        }
    })

     */
    const referenceElements = buildElementsSourceForFetch(elements, config)
    const valueSetNameToRef = await multiIndex.keyByAsync({
      iter: await referenceElements.getAll(),
      filter: isInstanceOfTypeSync(GLOBAL_VALUE_SET),
      key: async inst => [await apiName(inst)],
      map: inst => inst.elemID,
    })
    const customObjects = elements.filter(isObjectType).filter(isCustomObject)
    customObjects.forEach(object => addGlobalValueSetRefToObject(object, valueSetNameToRef))
  },
})

export default filterCreator
