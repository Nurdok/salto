/*
 *                      Copyright 2024 Salto Labs Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  isInstanceElement,
  ReferenceExpression,
  InstanceElement,
  CORE_ANNOTATIONS,
  Element,
} from '@salto-io/adapter-api'
import { FilterCreator } from '../filter'
import { DOMAIN_TYPE_NAME } from '../constants'

/**
 * TODO
 */
const filterCreator: FilterCreator = () => ({
  name: 'domainFilter',
  onFetch: async (elements: Element[]) => {
    const instances: InstanceElement[] = elements
      .filter(isInstanceElement)
      .filter((instance: InstanceElement) => instance.elemID.typeName === DOMAIN_TYPE_NAME)

    // Instead of having a `Brand` reference expression, make it the parent of the domain.
    await Promise.all(
      instances.map(async instance => {
        instance.annotations[CORE_ANNOTATIONS.PARENT] = [instance.value.brandId as ReferenceExpression]
        delete instance.value.brandId
      }),
    )
  },
})

export default filterCreator
